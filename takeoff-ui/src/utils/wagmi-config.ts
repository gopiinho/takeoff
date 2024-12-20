// importing createConfig from @privy-io/wagmi for integration
import { createConfig } from '@privy-io/wagmi'
import { baseSepolia } from 'viem/chains'
import { http } from 'wagmi'

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(process.env.RPC_API_KEY),
  },
})
