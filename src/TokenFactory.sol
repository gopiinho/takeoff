// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Token} from "./Token.sol";
import {IUniswapV2Router01} from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
import {IUniswapV2Factory} from "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import {IUniswapV2Pair} from "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

contract TokenFactory {
    ///////////////
    /// Errors  ///
    ///////////////
    error TokenFactory__NotOwner();
    error TokenFactory__ZeroAmount();
    error TokenFactory__ZeroAddress();
    error TokenFactory__FundingFulfilled();
    error TokenFactory__MaxSupplyExceeded();
    error TokenFactory__FeeWithdrawalFailed();
    error TokenFactory__CreatorFeeNotIncluded();
    error TokenFactory__NotEnoughEthToBuyTokens();

    //////////////
    /// Types  ///
    //////////////
    struct TokenInfo {
        string name;
        string symbol;
        string description;
        string logoUrl;
        address tokenAddress;
        address creator;
        uint256 amountRaised;
    }

    ///////////////////////
    /// State Variables ///
    ///////////////////////
    address public owner;

    address public constant UNISWAP_V2_ROUTER = 0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24;
    address public constant UNISWAP_v2_FACTORY = 0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6;

    uint256 public constant CREATION_PROTOCOL_FEES = 0.0005 ether;
    uint256 public constant FUNDING_GOAL = 24 ether;
    uint256 public constant DECIMALS = 1e18;
    uint256 public constant MAX_SUPPLY = 1e9 * DECIMALS;
    uint256 public constant INITIAL_SUPPLY = 20 * MAX_SUPPLY / 100;

    // Remaining supply after creation / FUNDING_GOAL = 0.00000003 * 10e18 = INITIAL_PRICE
    uint256 public constant INITIAL_PRICE = 30000000000;
    uint256 public constant K = 8 * 1e15;

    uint256 public totalTokensDeployed;
    mapping(address => TokenInfo) public addressToToken;
    address[] public deployedTokenAddresses;

    ///////////////
    ///  Events ///
    ///////////////
    event TokenCreated(
        string indexed name, string indexed symbol, string description, string uri, address indexed creator
    );

    event TokenPairDeployed(address token0, address token1);

    ///////////////
    // Functions //
    ///////////////
    constructor() {
        owner = msg.sender;
    }
    /**
     * @notice User calls this function to create a new meme token.
     *  @dev This function is called by the user to create a new token. User is able to set the name, symbol, description and logo url.
     *       After token creation, the INITIAL_SUPPLY will be sent to the TokenFactory (this) contract.
     *  @param name The name of the token.
     *  @param symbol The symbol of the token.
     *  @param description The description of the token.
     *  @param logoUrl The logo url of the token.
     *  @return address The address of the token deployed.
     */

    function createToken(string memory name, string memory symbol, string memory description, string memory logoUrl)
        public
        payable
        returns (address)
    {
        require(msg.value >= CREATION_PROTOCOL_FEES, TokenFactory__CreatorFeeNotIncluded());

        Token token = new Token(name, symbol, INITIAL_SUPPLY);
        address tokenAddress = address(token);
        addressToToken[tokenAddress] = TokenInfo(name, symbol, description, logoUrl, tokenAddress, msg.sender, 0);
        deployedTokenAddresses.push(tokenAddress);

        emit TokenCreated(name, symbol, description, logoUrl, msg.sender);
        return tokenAddress;
    }

    /**
     * @notice User calls this function to buy already deployed tokens.
     *  @dev User buys their desired amount of specific tokens and instead pays with eth.
     *  @param tokenAddress Address of the token.
     *  @param amount Amount of tokens to buy.
     */
    function buyTokens(address tokenAddress, uint256 amount) public payable {
        TokenInfo memory tokenInfo = addressToToken[tokenAddress];
        Token token = Token(tokenAddress);
        uint256 tokenCurrentSupply = token.totalSupply();
        uint256 availableSupply = MAX_SUPPLY - tokenCurrentSupply;

        require(tokenInfo.tokenAddress != address(0), TokenFactory__ZeroAddress());
        require(amount > 0, TokenFactory__ZeroAmount());
        require(amount <= availableSupply, TokenFactory__MaxSupplyExceeded());
        require(tokenInfo.amountRaised <= FUNDING_GOAL, TokenFactory__FundingFulfilled());

        // Calculate the cost of tokens of amount quantity based on exponential bonding curve.
        uint256 purchasedCurrentSupply = (tokenCurrentSupply - INITIAL_SUPPLY) / DECIMALS;
        uint256 ethAmount = calculateCost(purchasedCurrentSupply, amount);

        require(msg.value >= ethAmount, TokenFactory__NotEnoughEthToBuyTokens());
        tokenInfo.amountRaised += ethAmount;

        if (tokenInfo.amountRaised >= FUNDING_GOAL) {
            uint256 ethAmountLp = tokenInfo.amountRaised;
            uint256 tokenAmountLp = INITIAL_SUPPLY;

            _deployLpAndBurnTokens(tokenAddress, ethAmountLp, tokenAmountLp);
        }

        token.mintTokens(msg.sender, amount);
    }

    function _deployLpAndBurnTokens(address tokenAddress, uint256 amount, uint256 ethAmount) internal {
        address pool = _createLiquidityPair(tokenAddress);
        uint256 liquidity = _provideLiquidity(tokenAddress, amount, ethAmount);
        _burnLiquidityTokens(pool, liquidity);
    }

    function _createLiquidityPair(address tokenAddress) internal returns (address) {
        IUniswapV2Factory factory = IUniswapV2Factory(UNISWAP_v2_FACTORY);
        IUniswapV2Router01 router = IUniswapV2Router01(UNISWAP_V2_ROUTER);
        address pairAddress = factory.createPair(tokenAddress, router.WETH());

        return pairAddress;
    }

    function _provideLiquidity(address tokenAddress, uint256 amount, uint256 ethAmount) internal returns (uint256) {
        Token token = Token(tokenAddress);
        token.approve(UNISWAP_V2_ROUTER, amount);
        IUniswapV2Router01 router = IUniswapV2Router01(UNISWAP_V2_ROUTER);
        (,, uint256 liquidity) = router.addLiquidityETH{value: ethAmount}(
            address(token), amount, amount, ethAmount, address(this), block.timestamp
        );

        return liquidity;
    }

    function _burnLiquidityTokens(address pool, uint256 liquidity) internal {
        IUniswapV2Pair uniswapv2Pair = IUniswapV2Pair(pool);
        uniswapv2Pair.transfer(address(0), liquidity);
    }

    /**
     * @notice Withdraws the protocol earned fees.
     *  @dev Withdraws the protocol earned fees, can only be called by the owner which is set to the deployer of the contract.
     *  @param to Address where the fees will be sent.
     */
    function withdrawFee(address to) public {
        require(msg.sender == owner, TokenFactory__NotOwner());
        uint256 amount = address(this).balance;
        (bool success,) = to.call{value: amount}("");
        require(success, TokenFactory__FeeWithdrawalFailed());
    }

    ///////////////////////////////////////
    // Public & External View Functions ///
    ///////////////////////////////////////
    function calculateCost(uint256 currentSupply, uint256 amount) public pure returns (uint256) {
        uint256 scaledAmount = amount / DECIMALS;
        uint256 exp1 = (K * (currentSupply + scaledAmount)) / 1e18;
        uint256 exp2 = (K * currentSupply) / 1e18;

        uint256 e1 = _exp(exp1);
        uint256 e2 = _exp(exp2);

        // cost =  P0/K * (e^K(c + x) - e^K(c))
        // Where (P0 / k) * (e^(k * (currentSupply + amount)) - e^(k * currentSupply))
        uint256 ethCost = (INITIAL_PRICE * DECIMALS * (e1 - e2)) / K;

        return ethCost;
    }

    ///////////////////////////////////////
    // Private & Internal View Functions //
    ///////////////////////////////////////
    // Follows the Taylor Series Approximation
    function _exp(uint256 x) internal pure returns (uint256) {
        // Start with 1 * 10^18 for precision
        uint256 sum = 1e18;
        // Initial term = 1 * 10^18
        uint256 term = 1e18;
        uint256 xPower = x;

        for (uint256 i = 1; i <= 20; ++i) {
            // Increase iterations for better accuracy
            // x^i / i!
            term = (term * xPower) / (i * 1e18);
            sum += term;
            // Prevent overflow and unnecessary calculations
            if (term < 1) break;
        }

        return sum;
    }
}
