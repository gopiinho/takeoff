// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    error Token__NotOwner();

    address public owner;

    constructor(string memory name, string memory symbol, uint256 initialMintAmount) ERC20(name, symbol) {
        owner = msg.sender;
        _mint(msg.sender, initialMintAmount);
    }

    function mintTokens(address account, uint256 amount) external returns (bool) {
        require(msg.sender == owner, Token__NotOwner());
        _mint(account, amount);
        return true;
    }

    function burnTokens(address account, uint256 amount) external returns (bool) {
        require(msg.sender == owner, Token__NotOwner());
        _burn(account, amount);
        return true;
    }
}
