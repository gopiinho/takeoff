import Link from 'next/link'
import TokenDetails from '@/components/token-details'

export default function Create() {
  return (
    <div className="w-full block items-center justify-center text-center">
      <Link href="/" className="hover:font-semibold text-2xl">
        [go back]
      </Link>
      <TokenDetails />
    </div>
  )
}
