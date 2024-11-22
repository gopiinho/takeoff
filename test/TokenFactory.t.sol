// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {TokenFactory} from "../src/TokenFactory.sol";
import {Token} from "../src/Token.sol";

contract TokenFactoryTest is Test {
    TokenFactory tokenFactory;
    Token token;
    address USER;
    uint256 private constant FEE = 0.0005 ether;

    function setUp() public {
        tokenFactory = new TokenFactory();
        USER = makeAddr("user");
        vm.deal(USER, 1 ether);
    }

    function testCanDeployToken() public {
        string memory name = "DogeCoin";
        string memory symbol = "DOGE";
        string memory description = "Official DogeCoin";
        string memory logoUrl = "https://dogecoin.com";
        vm.startPrank(USER);
        address tokenAddress = tokenFactory.createToken{value: FEE}(name, symbol, description, logoUrl);
        vm.stopPrank();

        token = Token(tokenAddress);
        uint256 tokenSupply = token.totalSupply();
        assertEq(tokenSupply, tokenFactory.INITIAL_SUPPLY());
    }
}
