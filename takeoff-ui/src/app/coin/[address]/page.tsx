'use client'
import { useState, use } from 'react'
import { useReadContract } from 'wagmi'
import abi from '@/utils/abis/token-factory.json'
import { TokenInfoType } from '@/utils/types'
import { factoryContractAddress } from '@/utils/constants'
import { formatAddress } from '@/utils/helpers'
import { formatEther } from 'viem'
import CoinTrade from '@/components/coin-trade'

export default function Coin(props: { params: Promise<{ address: string }> }) {
  const params = use(props.params)

  const { data } = useReadContract({
    abi,
    address: factoryContractAddress,
    functionName: 'getTokenInfo',
    args: [params.address],
  })

  const tokenData = data as TokenInfoType | undefined

  if (!params.address) {
    return <div className="w-full lg:w-[70%] mx-auto text-white/50 px-4">NO ADDRESS</div>
  }

  return (
    <div className="w-full lg:w-[70%] mx-auto text-white/50">
      {tokenData ? (
        <div className="flex max-sm:flex-col justify-between">
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
          <CoinTrade tokenAddress={params.address} symbol={tokenData.symbol} />
        </div>
      ) : (
        <div className="text-center py-4">Loading coin info...</div>
      )}
    </div>
  )
}
