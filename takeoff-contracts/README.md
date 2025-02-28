# Takeoff

A decentralized platform for creating, buying, and selling meme tokens with a bonding curve pricing mechanism and automatic Uniswap liquidity provision.

## Overview

The Takeoff Factory is a Solidity-based platform that allows users to:

1. Create new meme tokens with custom names, symbols, descriptions, and logos
2. Buy tokens using a bonding curve pricing mechanism
3. Sell tokens back to the factory
4. Automatically deploy liquidity to Uniswap when funding goals are met

## Features

### Token Creation
- Deploy your own meme token with custom branding
- Small creation fee (0.0005 ETH)
- Initial supply of 20% of max supply automatically minted

### Trading Mechanism
- Purchase tokens directly through the factory
- Dynamic pricing based on an exponential bonding curve
- Sell tokens back to the factory at the current bonding curve price
- Funding goal of 24 ETH triggers automatic liquidity provision

### Liquidity Provision
- Automatic deployment of ETH/token liquidity pair on Uniswap V2
- Liquidity tokens are burned, creating a locked liquidity pool
- Ensures tradability of tokens on Uniswap after funding goal is met

## Technical Specifications

- **Token Standard**: Custom ERC20-compatible tokens
- **Max Supply**: 1 billion tokens (1e9)
- **Initial Supply**: 200 million tokens (20% of max supply)
- **Pricing Model**: Exponential bonding curve with formula `INITIAL_PRICE * e^(K * supply)`
- **Contract Compatibility**: Solidity 0.8.28
- **Dependencies**: Uniswap V2 Router and Factory contracts

## Usage

### Creating a Token
```solidity
function createToken(
    string memory name, 
    string memory symbol, 
    string memory description, 
    string memory logoUrl
) public payable returns (address)
```

### Buying Tokens
```solidity
function buyTokens(address tokenAddress, uint256 amount) public payable
```

### Selling Tokens
```solidity
function sellTokens(address tokenAddress, uint256 amount) public
```

### Viewing Token Information
```solidity
function getAllTokensInfo() public view returns (TokenInfo[] memory)
function getTokenInfo(address tokenAddress) public view returns (TokenInfo memory)
```

## Economic Model

The platform uses an exponential bonding curve model where:
- Token price increases as supply increases
- Initial price starts at 0.00000003 ETH per token
- After funding goal is met (24 ETH), liquidity is automatically added to Uniswap
- Protocol fees are collected from token creation

## Security Considerations

- Tokens follow a mint/burn model during the initial funding phase
- Liquidity tokens are burned to prevent rug pulls
- Bonding curve calculations use Taylor Series approximation for gas efficiency
- Comprehensive error handling for user safety

## License

MIT License
