// importing createConfig from @privy-io/wagmi for integration
import { createConfig } from "@privy-io/wagmi"
import { base, baseSepolia } from "viem/chains"
import { http } from "wagmi"

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})
