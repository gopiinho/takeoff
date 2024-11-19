// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {TokenFactory} from "../src/TokenFactory.sol";

contract TokenFactoryTest is Test {
    TokenFactory tokenFactory;
    address USER;
    uint256 private constant FEE = 0.0005 ether;

    function setUp() public {
        tokenFactory = new TokenFactory();
        USER = makeAddr("user");
        vm.deal(USER, 1 ether);
    }

    function testCanDeployToken() public {
        vm.startPrank(USER);
        tokenFactory.createToken{value: FEE}("Test Token", "TST", "This is description", "RANDOM URI");
        vm.stopPrank();

        (,,,,, address creator) = tokenFactory.addressToToken(USER);
        assertEq(creator, USER);
    }
}
