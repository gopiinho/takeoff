// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public owner;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {}

    function mintTokens(address account, uint256 amount) public {
        _mint(account, amount);
    }
}
