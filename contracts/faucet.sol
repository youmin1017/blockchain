// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {Freezable} from "./freezable.sol";

contract Faucet is AccessControl, Freezable {
    // Create a new role identifier for the minter role
    bytes32 private constant OWNER_ROLE = keccak256("OWNER_ROLE");

    // bytes32 public constant CLIENT_ROLE = keccak256("CLIENT_ROLE");

    constructor(address payable _owner) Freezable(_owner) {
        _grantRole(DEFAULT_ADMIN_ROLE, _owner);
    }

    event Withdrawal(address indexed from, uint amount, uint when);

    function withdraw(uint amount) public payable notFrozen {
        require(amount <= 1 ether);
        require(address(this).balance >= amount);

        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);
        emit Withdrawal(msg.sender, amount, block.timestamp);

        payable(msg.sender).transfer(amount);
    }

    /**
     * 在合約關機時，將合約內的所有餘額轉移給合約擁有者
     */
    function shutdown() public onlyRole(OWNER_ROLE) {
        freeze();
        payable(msg.sender).transfer(address(this).balance);
    }
}
