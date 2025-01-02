import Link from 'next/link'
import { formatEther } from 'viem'
import { formatAddress } from '@/utils/helpers'
import { TokenInfoType } from '@/utils/types'

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
        className="m-2 flex cursor-pointer gap-2 border border-transparent p-2 text-white/50 hover:border-white/80"
      >
        <img
          className="h-28 w-28 flex-shrink-0"
          src={logoUrl}
          alt="image"
          width={0}
          height={0}
        />
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-xs">created by: {formatAddress(creator)}</span>
          <span className="text-xs text-green-400">
            raised: {raised ? formatEther(BigInt(raised)) : 0}/24 ETH
          </span>
          <div className="max-h-72 overflow-hidden">
            <span className="font-semibold">
              {name} ({symbol}):
            </span>{' '}
            <span className="break-words text-white/70">{description}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
