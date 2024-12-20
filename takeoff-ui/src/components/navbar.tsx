'use client'
import Link from 'next/link'
import { usePrivy } from '@privy-io/react-auth'
import { useAccount } from 'wagmi'
import { formatAddress } from '@/utils/helpers'

export default function Navbar() {
  const { login, authenticated, logout } = usePrivy()
  const { address } = useAccount()

  return (
    <div className="h-16 flex justify-between items-center px-6">
      <Link href="/" className="font-semibold hover:opacity-80 text-xl">
        take.off
      </Link>
      {authenticated && address ? (
        <button className="font-semibold hover:opacity-80" onClick={logout}>
          {formatAddress(address)}
        </button>
      ) : (
        <button className="font-semibold hover:opacity-60" onClick={login}>
          [connect wallet]
        </button>
      )}
    </div>
  )
}
