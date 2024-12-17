// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console2} from "forge-std/Script.sol";
import {TokenFactory} from "../src/TokenFactory.sol";

contract DeployTokenFactory is Script {
    TokenFactory public tokenFactory;

    function setUp() public {}

    function run() external {
        uint256 privateKey = vm.envUint("DEV_KEY");
        address account = vm.addr(privateKey);

        vm.startBroadcast(account);
        tokenFactory = new TokenFactory();
        vm.stopBroadcast();

        // Log the address of the deployed contract and the transaction hash
        console2.log("TokenFactory deployed to: ", address(tokenFactory));
    }
}
