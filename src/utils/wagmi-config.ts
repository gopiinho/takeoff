// importing createConfig from @privy-io/wagmi for integration
import { createConfig } from '@privy-io/wagmi'
import { base, baseSepolia } from 'viem/chains'
import { http } from 'wagmi'

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(process.env.ALCHEMY_API_KEY),
  },
})
