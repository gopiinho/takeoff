// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {TokenFactory} from "../src/TokenFactory.sol";

contract TokenFactoryTest is Test {
    TokenFactory tokenFactory;
    address USER;

    function setUp() public {
        tokenFactory = new TokenFactory();
        USER = makeAddr("user");
    }

    function testCanDeployToken() public {
        vm.startPrank(USER);
        tokenFactory.createToken("Test Token", "TST", "RANDOM URI");
        vm.stopPrank();

        (,,,, address creator) = tokenFactory.userTokens(USER);
        assertEq(creator, USER);
    }
}
