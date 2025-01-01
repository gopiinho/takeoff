import { Address } from 'viem'
import { DECIMALS } from './constants'
import { K } from './constants'
import { INITIAL_PRICE } from './constants'

export const formatAddress = (addr: Address) => {
  if (!addr) return ''
  return `${addr.slice(0, 5)}...${addr.slice(-4)}`
}

export function _exp(x: bigint): bigint {
  let sum = DECIMALS
  let term = DECIMALS
  const xPower = x

  for (let i = 1n; i <= 20n; ++i) {
    term = (term * xPower) / (i * DECIMALS)
    sum += term

    if (term < 1) break
  }

  return sum
}

export function calculateCost(currentSupply: bigint, amount: bigint, isBuying: boolean): bigint {
  const scaledAmount = amount / DECIMALS

  const exp1 = isBuying ? (K * (currentSupply + scaledAmount)) / DECIMALS : (K * currentSupply) / DECIMALS
  const exp2 = isBuying ? (K * currentSupply) / DECIMALS : (K * (currentSupply - scaledAmount)) / DECIMALS

  const e1 = _exp(exp1)
  const e2 = _exp(exp2)

  const ethValue = (INITIAL_PRICE * DECIMALS * (e1 - e2)) / K

  return ethValue
}
