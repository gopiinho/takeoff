'use client'
import { use } from 'react'
import { useReadContract } from 'wagmi'
import abi from '@/utils/abis/token-factory.json'
import { TokenInfoType } from '@/utils/types'
import { factoryContractAddress } from '@/utils/constants'
import { formatAddress } from '@/utils/helpers'
import { Address, formatEther } from 'viem'
import CoinTrade from '@/components/coin-trade'

export default function Coin(props: { params: Promise<{ address: Address }> }) {
  const params = use(props.params)

  const { data } = useReadContract({
    abi,
    address: factoryContractAddress,
    functionName: 'getTokenInfo',
    args: [params.address],
  })

  const tokenData = data as TokenInfoType | undefined

  if (!params.address) {
    return (
      <div className='mx-auto w-full px-4 text-white/50 lg:w-[70%]'>
        NO ADDRESS
      </div>
    )
  }

  return (
    <div className='mx-auto w-full text-white/50 lg:w-[70%]'>
      {tokenData ? (
        <div className='flex justify-between max-sm:flex-col'>
          <div className='flex gap-2 border border-transparent p-4'>
            <img
              src={tokenData.logoUrl}
              className='h-48 w-48 flex-shrink-0 bg-red-400 max-sm:h-28 max-sm:w-28'
            />
            <div className='flex flex-1 flex-col gap-1'>
              <span className='text-sm max-sm:text-xs'>
                created by: {formatAddress(tokenData.creator)}
              </span>
              <span className='text-xl text-green-400 max-sm:text-xs'>
                raised:{' '}
                {tokenData.raised ? formatEther(BigInt(tokenData.raised)) : 0}
                /24 ETH
              </span>
              <div>
                <span className='text-lg font-semibold max-sm:text-xs'>
                  {tokenData.name} ({tokenData.symbol}):
                </span>{' '}
                <span className='break-words text-lg text-white/70 max-sm:text-xs'>
                  {tokenData.description}
                </span>
              </div>
            </div>
          </div>
          <CoinTrade tokenAddress={params.address} symbol={tokenData.symbol} />
        </div>
      ) : (
        <div className='py-4 text-center'>Loading coin info...</div>
      )}
    </div>
  )
}
