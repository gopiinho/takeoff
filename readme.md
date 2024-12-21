# Take.Off

Takeoff is a solidity implementation of pump.fun, based on bonding curve logic to determine the token price. Does not use the oracles to determine the funding goal of a token, instead the LP is deployed to as a Uniswap V2 pair once it reaches 24 ETH target.

Uses Foundry with Solidity + Nextjs with Viem, Wagmi, Privy, Typescript and Tailwind.

## Packages

- [takeoff-contracts](https://github.com/gopiinho/takeoff/tree/main/takeoff-contracts) - Foundry project with core takeoff contracts.
- [takeoff-ui](https://github.com/gopiinho/takeoff/tree/main/takeoff-ui) - Nextjs application as frontend.

## [takeoff-contracts](https://github.com/gopiinho/takeoff/tree/main/takeoff-contracts)

Built using foundry, has 2 core contracts:

1. `TokenFactory.sol` - Factory contract that creates new tokens for a user that can be traded.
2. `Token.sol` - Contract used by factory contract as an erc20 baseline.
