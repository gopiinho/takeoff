"use client"
import { usePrivy } from "@privy-io/react-auth"
import { useAccount } from "wagmi"

export default function Navbar() {
  const { login, authenticated, logout } = usePrivy()
  const { address } = useAccount()

  return (
    <div className="h-16 flex justify-between items-center px-6">
      <h1 className="font-semibold">take.off</h1>
      {authenticated ? (
        <button onClick={logout}>{address?.slice(0, 6)}...</button>
      ) : (
        <button onClick={login}>[connect wallet]</button>
      )}
    </div>
  )
}
