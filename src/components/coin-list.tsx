'use client'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'
import abi from '@/utils/abis/token-factory.json'
import { factoryContractAddress } from '@/utils/constants'
import CoinDetails from './coin-details'

interface TokenInfo {
  name: string
  ticker: string
  description: string
  logoUrl: string
  creator: Address
  raised: number
  tokenAddress: Address
}

export default function CoinList() {
  const { data } = useReadContract({
    abi,
    address: factoryContractAddress,
    functionName: 'getAllTokensInfo',
  })

  const tokensData = data as unknown as TokenInfo[]

  console.log(tokensData)

  return (
    <div className="grid max-lg:grid-cols-1 grid-cols-3 px-10 max-sm:px-2">
      {tokensData && tokensData.length > 0 ? (
        tokensData.map((token: TokenInfo, index) => (
          <CoinDetails
            key={index}
            image={token.logoUrl}
            creator={token.creator}
            raised={token.raised}
            name={token.name}
            ticker={token.ticker}
            description={token.description}
          />
        ))
      ) : (
        <p>Loading tokens...</p>
      )}
    </div>
  )
}
