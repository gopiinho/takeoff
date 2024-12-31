import { Address } from 'viem'

export type TokenInfoType = {
  name: string
  symbol: string
  description: string
  logoUrl: string
  creator: Address
  raised: number
  tokenAddress: Address
}
