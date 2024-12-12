// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console2} from "forge-std/Script.sol";
import {TokenFactory} from "../src/TokenFactory.sol";

contract DeployTokenFactory is Script {
    TokenFactory public tokenFactory;

    function run() external {
        vm.startBroadcast();
        tokenFactory = new TokenFactory();
        vm.stopBroadcast();

        console2.log("TokenFactory deployed to: ", address(tokenFactory));
    }
}
