// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {TokenFactory} from "../src/TokenFactory.sol";
import {Token} from "../src/Token.sol";

contract TokenTest is Test {
    TokenFactory tokenFactory;
    Token token;
    address CREATOR;
    address USER;
    uint256 private constant FEE = 0.0005 ether;

    function setUp() public {
        tokenFactory = new TokenFactory();
        CREATOR = makeAddr("creator");
        USER = makeAddr("user");
        vm.deal(CREATOR, 1 ether);
        vm.deal(USER, 30 ether);
    }

    function testOnlyOwnerCanMint() public {
        string memory name = "DogeCoin";
        string memory symbol = "DOGE";
        string memory description = "Official DogeCoin";
        string memory logoUrl = "https://dogecoin.com";
        vm.startPrank(CREATOR);
        address tokenAddress = tokenFactory.createToken{value: FEE}(name, symbol, description, logoUrl);
        vm.stopPrank();
        token = Token(tokenAddress);

        vm.startPrank(USER);
        vm.expectRevert(Token.Token__NotOwner.selector);
        token.mintTokens(USER, 1000);
        vm.stopPrank();
    }
}
