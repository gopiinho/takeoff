'use client'
import { useState, use } from 'react'
import { useReadContract } from 'wagmi'
import abi from '@/utils/abis/token-factory.json'
import { TokenInfoType } from '@/utils/types'
import { factoryContractAddress } from '@/utils/constants'
import { formatAddress } from '@/utils/helpers'
import { formatEther } from 'viem'

export default function Coin(props: { params: Promise<{ address: string }> }) {
  const params = use(props.params)
  const [isBuy, setIsBuy] = useState(true)

  const { data } = useReadContract({
    abi,
    address: factoryContractAddress,
    functionName: 'getTokenInfo',
    args: [params.address],
  })

  const tokenData = data as TokenInfoType | undefined
  console.log(tokenData)

  if (!params.address) {
    return <div className="w-full lg:w-[70%] mx-auto text-white/50 px-4">NO ADDRESS</div>
  }

  return (
    <div className="w-full lg:w-[70%] mx-auto text-white/50 px-4">
      {tokenData ? (
        <div className="flex max-sm:flex-col justify-between px-4">
          <div className="flex gap-2 border border-transparent p-4">
            <img src={tokenData.logoUrl} className="max-sm:w-28 max-sm:h-28 w-48 h-48 flex-shrink-0 bg-red-400" />
            <div className="flex flex-col gap-1 flex-1">
              <span className="max-sm:text-xs text-sm">created by: {formatAddress(tokenData.creator)}</span>
              <span className="max-sm:text-xs text-xl text-green-400">
                raised: {tokenData.raised ? formatEther(BigInt(tokenData.raised)) : 0}/24 ETH
              </span>
              <div>
                <span className="font-semibold max-sm:text-xs text-lg">
                  {tokenData.name} ({tokenData.symbol}):
                </span>{' '}
                <span className="text-white/70 break-words max-sm:text-xs text-lg">{tokenData.description}</span>
              </div>
            </div>
          </div>
          <div>
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
              <input type="number" className="py-2 px-4 rounded-md bg-transparent border border-white" />
              <button
                className={`w-full py-2 rounded-md text-black 
                  ${isBuy ? 'bg-green-400 hover:bg-green-500' : 'bg-red-400 hover:bg-red-400/80 text-white/80'}`}
              >
                place trade
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">Loading coin info...</div>
      )}
    </div>
  )
}
