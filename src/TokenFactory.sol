// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Token} from "./Token.sol";

contract TokenFactory {
    Token token;
    ///////////////
    /// Errors  ///
    ///////////////

    //////////////
    /// Types  ///
    //////////////
    struct TokenInfo {
        string name;
        string symbol;
        string logoUrl;
        address tokenAddress;
        address creator;
    }

    ///////////////////////
    /// State Variables ///
    ///////////////////////
    uint256 public constant DECIMALS = 10e18;
    uint256 public constant MAX_SUPPLY = 10_00_000 * DECIMALS;
    uint256 public constant INITIAL_SUPPLY = MAX_SUPPLY * 20 / 100;
    uint256 public totalTokensDeployed;
    mapping(address => TokenInfo) public userTokens;

    ///////////////
    ///  Events ///
    ///////////////
    event TokenCreated(string indexed name, string indexed symbol, string uri, address indexed creator);

    ///////////////
    //  Modifier //
    ///////////////

    ///////////////
    // Functions //
    ///////////////
    function createToken(string memory _name, string memory _symbol, string memory _logoUrl) public returns (address) {
        token = new Token(_name, _symbol);
        userTokens[msg.sender] = TokenInfo(_name, _symbol, _logoUrl, address(token), msg.sender);
        emit TokenCreated(_name, _symbol, _logoUrl, msg.sender);

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
