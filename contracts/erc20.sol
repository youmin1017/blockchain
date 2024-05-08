// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {Freezable} from "./freezable.sol";

contract TYToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("TYT", "TYT") {
        _mint(msg.sender, initialSupply);
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, 1000);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        if (!(from == address(0) && to == block.coinbase)) {
            _mintMinerReward();
        }
        super._update(from, to, value);
    }
}
