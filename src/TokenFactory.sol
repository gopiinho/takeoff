// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Token} from "./Token.sol";

contract TokenFactory {
    ///////////////
    /// Errors  ///
    ///////////////
    error TokenFactory__CreatorFeeNotIncluded();
    error TokenFactory__ZeroAddress();
    error TokenFactory__ZeroAmount();
    error TokenFactory__MaxSupplyExceeded();
    error TokenFactory__FundingFulfilled();
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

    // List of all deployed token addresses.
    address[] public deployedTokenAddresses;

    ///////////////
    ///  Events ///
    ///////////////
    event TokenCreated(
        string indexed name, string indexed symbol, string description, string uri, address indexed creator
    );

    ///////////////
    // Functions //
    ///////////////
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
        addressToToken[tokenAddress] = TokenInfo(name, symbol, description, logoUrl, address(token), msg.sender, 0);
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

        token.mintTokens(msg.sender, amount);
    }

    ///////////////////////////////////////
    // Private & Internal View Functions //
    ///////////////////////////////////////
    function calculateCost(uint256 currentSupply, uint256 amount) public pure returns (uint256) {
        uint256 scaledAmount = amount / DECIMALS;
        uint256 exp1 = (K * (currentSupply + scaledAmount)) / 1e18;
        uint256 exp2 = (K * currentSupply) / 1e18;

        uint256 e1 = exp(exp1);
        uint256 e2 = exp(exp2);

        // cost =  P0/K * (e^K(c + x) - e^K(c))
        // Where (P0 / k) * (e^(k * (currentSupply + amount)) - e^(k * currentSupply))
        uint256 ethCost = (INITIAL_PRICE * DECIMALS * (e1 - e2)) / K;

        return ethCost;
    }

    // Follows the Taylor Series Approximation
    function exp(uint256 x) internal pure returns (uint256) {
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
