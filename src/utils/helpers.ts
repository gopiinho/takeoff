import { Address } from 'viem'

export const formatAddress = (addr: Address) => {
  if (!addr) return ''
  return `${addr.slice(0, 5)}...${addr.slice(-4)}`
}
