import Link from 'next/link'
import { Address, formatEther } from 'viem'
import { formatAddress } from '@/utils/helpers'
import { TokenInfoType } from '@/utils/types'

interface CoinDetailsProps {
  image: string
  creator: Address
  raised: number
  name: string
  ticker: string
  description: string
  tokenAddress: Address
}

export default function CoinDetails({
  logoUrl,
  creator,
  raised,
  name,
  symbol,
  description,
  tokenAddress,
}: TokenInfoType) {
  return (
    <div>
      <Link
        href={`/coin/${tokenAddress}`}
        className="p-2 m-2 flex gap-2 border border-transparent hover:border-white/80 cursor-pointer text-white/50"
      >
        <img className="w-28 h-28 flex-shrink-0" src={logoUrl} alt="image" width={0} height={0} />
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-xs">created by: {formatAddress(creator)}</span>
          <span className="text-xs text-green-400">raised: {raised ? formatEther(BigInt(raised)) : 0}/24 ETH</span>
          <div className="max-h-72 overflow-hidden">
            <span className="font-semibold">
              {name} ({symbol}):
            </span>{' '}
            <span className="text-white/70 break-words">{description}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
