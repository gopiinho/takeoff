'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePrivy } from '@privy-io/react-auth'
import { useAccount } from 'wagmi'
import { formatAddress } from '@/utils/helpers'

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(false)
  const { login, authenticated, logout } = usePrivy()
  const { address } = useAccount()

  return (
    <div className='flex h-16 items-center justify-between px-6'>
      <Link href='/' className='text-xl font-semibold hover:opacity-80'>
        take.off
      </Link>
      {authenticated && address ? (
        <button className='group relative font-semibold'>
          <span className='group-hover:hidden'>{formatAddress(address)}</span>
          <span
            className='hidden text-center text-lg text-red-500 group-hover:inline'
            onClick={logout}
          >
            disconnect
          </span>
        </button>
      ) : (
        <button className='font-semibold hover:opacity-60' onClick={login}>
          [connect wallet]
        </button>
      )}
    </div>
  )
}
