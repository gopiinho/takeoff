// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Token} from "./Token.sol";

contract TokenFactory {
    Token token;
    ///////////////
    /// Errors  ///
    ///////////////

    error TokenFactory__CreatorFeeNotIncluded();

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
    }

    ///////////////////////
    /// State Variables ///
    ///////////////////////
    uint256 public constant CREATION_PROTOCOL_FEES = 0.0005 ether;
    uint256 public constant FUNDING_GOAL = 24 ether;
    uint256 public constant DECIMALS = 10e18;
    uint256 public constant MAX_SUPPLY = 1000000 * DECIMALS;
    uint256 public constant INITIAL_SUPPLY = MAX_SUPPLY * 20 / 100;

    uint256 public totalTokensDeployed;
    mapping(address => TokenInfo) public addressToToken;

    address[] public tokensAddress;

    ///////////////
    ///  Events ///
    ///////////////
    event TokenCreated(
        string indexed name, string indexed symbol, string description, string uri, address indexed creator
    );

    ///////////////
    //  Modifier //
    ///////////////

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
        token = new Token(name, symbol, INITIAL_SUPPLY);
        addressToToken[msg.sender] = TokenInfo(name, symbol, description, logoUrl, address(token), msg.sender);
        emit TokenCreated(name, symbol, description, logoUrl, msg.sender);

        return address(token);
    }

    ////////////////////////
    // External Functions //
    ////////////////////////

    ///////////////////////////////////////
    // Private & Internal View Functions //
    ///////////////////////////////////////

    ///////////////////////////////////////
    // Public & External View Functions ///
    ///////////////////////////////////////
}
