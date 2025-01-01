import { useState } from 'react'
import { useWriteContract, useReadContract } from 'wagmi'
import { Address, erc20Abi } from 'viem'
import abi from '@/utils/abis/token-factory.json'
import { calculateCost } from '@/utils/helpers'
import { factoryContractAddress, INITIAL_SUPPLY } from '@/utils/constants'

interface CoinTradeProps {
  tokenAddress: Address
  symbol: string
}

export default function CoinTrade({ tokenAddress, symbol }: CoinTradeProps) {
  const [isBuy, setIsBuy] = useState(true)
  const [amount, setAmount] = useState('')
  const { writeContractAsync } = useWriteContract()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }

  const { data: tokenTotalSupply } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'totalSupply',
  })

  const totalSupply = tokenTotalSupply || 0n
  const purchasedSupply = totalSupply - INITIAL_SUPPLY

  console.log('Total Supply', { totalSupply })
  console.log('Purchased Suply = totalSupply - INITIAL_SUPPLY', { purchasedSupply })
  console.log('tokenTotalSupply - returned from wagmi', { tokenTotalSupply })
  console.log('INITIAL_SUPPLY', { INITIAL_SUPPLY })

  const cost = calculateCost(purchasedSupply, BigInt(amount), true)

  console.log('Cost', cost)

  const handleTrade = async () => {
    if (isBuy) {
      await writeContractAsync({
        abi,
        address: factoryContractAddress,
        functionName: 'buyTokens',
        args: [tokenAddress, amount],
        value: cost,
      })
    } else console.log('sell')
  }

  return (
    <div className="p-4">
      <div className="p-4 bg-[#2D303A] rounded-md flex flex-col gap-4 justify-between">
        <div className="flex gap-4">
          <button
            className={`min-w-[150px] mx-auto py-2 rounded-md ${
              isBuy ? 'bg-green-400/80 hover:bg-green-400/80 text-black' : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
            onClick={() => setIsBuy(true)}
          >
            buy
          </button>
          <button
            className={`min-w-[150px] mx-auto py-2 rounded-md ${
              !isBuy ? 'bg-red-400/80 hover:bg-red-400/80 text-white' : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
            onClick={() => setIsBuy(false)}
          >
            sell
          </button>
        </div>
        <div className="flex flex-col justify-between text-white">
          <span>amount {isBuy ? '(ETH)' : `(${symbol})`}</span>
        </div>
        <input
          type="text"
          className="py-2 px-4 rounded-md bg-transparent border border-white focus:border-white focus:outline-white"
          value={amount}
          onChange={handleInputChange}
          onInput={(e) => {
            const input = e.currentTarget
            input.value = input.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\./g, '$1')
          }}
        />
        <button
          className={`w-full py-2 rounded-md text-black 
        ${isBuy ? 'bg-green-400 hover:bg-green-500' : 'bg-red-400 hover:bg-red-400/80 text-white/80'}`}
          onClick={handleTrade}
        >
          place trade
        </button>
      </div>
    </div>
  )
}
