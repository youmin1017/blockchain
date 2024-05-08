// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {Freezable} from "./freezable.sol";

contract TYTokenBank is AccessControl, Freezable {
    bytes32 private constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant CLIENT_ROLE = keccak256("CLIENT_ROLE");
    int clientCounter;
    // Faucet private faucet;

    struct ClientAccount {
        int clientId;
        uint clientBlance;
    }

    // ClientAccount[] clients;
    mapping(address => ClientAccount) clients;

    constructor(address _faucet) Freezable(msg.sender) {
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, OWNER_ROLE);
        _grantRole(OWNER_ROLE, msg.sender);
        clientCounter = 0;
        faucet = Faucet(_faucet);
    }
}
