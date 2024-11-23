// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {TokenFactory} from "../src/TokenFactory.sol";
import {Token} from "../src/Token.sol";

contract TokenFactoryTest is Test {
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
        vm.deal(USER, 10 ether);
    }

    function testCanDeployToken() public {
        string memory name = "DogeCoin";
        string memory symbol = "DOGE";
        string memory description = "Official DogeCoin";
        string memory logoUrl = "https://dogecoin.com";
        vm.startPrank(CREATOR);
        address tokenAddress = tokenFactory.createToken{value: FEE}(name, symbol, description, logoUrl);
        vm.stopPrank();

        token = Token(tokenAddress);
        uint256 tokenSupply = token.totalSupply();
        assertEq(tokenSupply, tokenFactory.INITIAL_SUPPLY());
    }

    function testCanBuyTokens() public {
        testCanDeployToken();
        uint256 amountToBuy = 80000000e18;
        address tokenToBuy = address(token);
        uint256 purchasedSupply = token.totalSupply() - tokenFactory.INITIAL_SUPPLY();
        uint256 ethCost = tokenFactory.calculateCost(purchasedSupply, amountToBuy);

        vm.startPrank(USER);
        tokenFactory.buyTokens{value: ethCost}(tokenToBuy, amountToBuy);
        vm.stopPrank();

        uint256 userBalance = token.balanceOf(USER);
        assertEq(userBalance, amountToBuy);
    }
}
