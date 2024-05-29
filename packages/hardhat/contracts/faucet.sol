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

    /**
     * @dev Grants `DEFAULT_ADMIN_ROLE` and `OWNER_ROLE` to the account that
     * deploys the contract.
     */
    constructor() payable Freezable(msg.sender) {
        /**
         * AccessControl includes a special role, called DEFAULT_ADMIN_ROLE,
         * which acts as the default admin role for all roles.
         */
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    event Withdrawal(address indexed from, uint amount, uint when);

    function withdraw(uint amount) external payable notFrozen {
        require(amount <= 1 ether, "You can only withdraw up to 1 ether");
        require(address(this).balance >= amount);

        console.log(
            "FaucetLog: Faucent withdrawing %s to %s on %s",
            amount,
            msg.sender,
            block.timestamp
        );
        console.log("FaucetLog: %s balance %s", msg.sender, msg.sender.balance);

        emit Withdrawal(msg.sender, amount, block.timestamp);

        payable(msg.sender).transfer(amount);

        console.log("FaucetLog: %s balance %s", msg.sender, msg.sender.balance);
    }

    function shutdown() public onlyRole(OWNER_ROLE) {
        freeze();
        payable(msg.sender).transfer(address(this).balance);
    }
}
