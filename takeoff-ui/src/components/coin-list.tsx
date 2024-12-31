'use client'
import { useReadContract } from 'wagmi'
import abi from '@/utils/abis/token-factory.json'
import { factoryContractAddress } from '@/utils/constants'
import CoinDetails from './coin-details'
import { TokenInfoType } from '@/utils/types'

export default function CoinList() {
  const { data } = useReadContract({
    abi,
    address: factoryContractAddress,
    functionName: 'getAllTokensInfo',
  })

  const tokensData = data as unknown as TokenInfoType[]

  return (
    <div className="grid max-lg:grid-cols-1 grid-cols-3 px-10 max-sm:px-2">
      {tokensData && tokensData.length > 0 ? (
        tokensData.map((token: TokenInfoType, index) => (
          <CoinDetails
            key={index}
            logoUrl={token.logoUrl}
            creator={token.creator}
            raised={token.raised}
            name={token.name}
            symbol={token.symbol}
            description={token.description}
            tokenAddress={token.tokenAddress}
          />
        ))
      ) : (
        <p>Loading tokens...</p>
      )}
    </div>
  )
}
