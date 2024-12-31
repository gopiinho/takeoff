// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {TokenFactory} from "../src/TokenFactory.sol";
import {Token} from "../src/Token.sol";

contract TokenFactoryTest is Test {
    TokenFactory tokenFactory;
    Token token;
    address OWNER;
    address WITHDRAW_WALLET;
    address CREATOR;
    address USER;
    uint256 private constant FEE = 0.0005 ether;
    uint256 amountToBuy = 700000000e18;

    function setUp() public {
        OWNER = makeAddr("owner");
        CREATOR = makeAddr("creator");
        WITHDRAW_WALLET = makeAddr("withdrawWallet");
        USER = makeAddr("user");
        vm.deal(CREATOR, 1 ether);
        vm.deal(USER, 30 ether);

        vm.startPrank(OWNER);
        tokenFactory = new TokenFactory();
        vm.stopPrank();

        string memory name = "DogeCoin";
        string memory symbol = "DOGE";
        string memory description = "Official DogeCoin";
        string memory logoUrl = "https://dogecoin.com";
        vm.startPrank(CREATOR);
        address tokenAddress = tokenFactory.createToken{value: FEE}(name, symbol, description, logoUrl);
        vm.stopPrank();

        token = Token(tokenAddress);
    }

    modifier _buysToken() {
        address tokenToBuy = address(token);
        uint256 purchasedSupply = token.totalSupply() - tokenFactory.INITIAL_SUPPLY();
        uint256 ethCost = tokenFactory.calculateCost(purchasedSupply, amountToBuy);

        vm.startPrank(USER);
        tokenFactory.buyTokens{value: ethCost}(tokenToBuy, amountToBuy);
        vm.stopPrank();
        _;
    }

    function testCanDeployToken() public view {
        uint256 tokenSupply = token.totalSupply();
        assertEq(tokenSupply, tokenFactory.INITIAL_SUPPLY());
    }

    function testCanBuyTokens() public _buysToken {
        uint256 userBalance = token.balanceOf(USER);
        assertEq(userBalance, amountToBuy);
    }

    function testCanSellTokens() public _buysToken {
        uint256 userBalance = token.balanceOf(USER);
        assertEq(userBalance, amountToBuy);

        uint256 amountToSell = 500000000e18;
        vm.startPrank(USER);
        tokenFactory.sellTokens(address(token), amountToSell);
        vm.stopPrank();

        uint256 userBalanceAfterSell = token.balanceOf(USER);
        assertEq(userBalanceAfterSell, amountToBuy - amountToSell);
    }

    function testCanWithdrawProtocolFee() public {
        uint256 startingProtocolFeeBalance = address(tokenFactory).balance;
        vm.startPrank(OWNER);
        tokenFactory.withdrawFee(WITHDRAW_WALLET);
        vm.stopPrank();
        uint256 endingProtocolFeeBalance = address(tokenFactory).balance;

        uint256 withdrawWalletBalance = WITHDRAW_WALLET.balance;
        assertEq(withdrawWalletBalance, startingProtocolFeeBalance);
        assertEq(endingProtocolFeeBalance, 0);
    }

    function testOnlyOwnerCanWithdrawProtocolFee() public {
        vm.startPrank(USER);
        vm.expectRevert(TokenFactory.TokenFactory__NotOwner.selector);
        tokenFactory.withdrawFee(USER);
        vm.stopPrank();
    }

    function testReturnsAllTokensList() public {
        string memory name = "Bitcoin";
        string memory symbol = "BTC";
        string memory description = "Official Bitcoin";
        string memory logoUrl = "https://bitcoin.com";
        vm.startPrank(USER);
        tokenFactory.createToken{value: FEE}(name, symbol, description, logoUrl);
        vm.stopPrank();

        TokenFactory.TokenInfo[] memory tokensList = tokenFactory.getAllTokensInfo();

        assertEq(tokensList.length, 2);
    }

    function testReturnsTokenInfo() public view {
        TokenFactory.TokenInfo memory tokenInfo = tokenFactory.getTokenInfo(address(token));

        assertEq(tokenInfo.name, "DogeCoin");
        assertEq(tokenInfo.symbol, "DOGE");
        assertEq(tokenInfo.description, "Official DogeCoin");
        assertEq(tokenInfo.logoUrl, "https://dogecoin.com");
        assertEq(tokenInfo.tokenAddress, address(token));
        assertEq(tokenInfo.creator, CREATOR);
        assertEq(tokenInfo.amountRaised, 0);
    }
}
