// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {Freezable} from "./freezable.sol";
import {TYToken} from "./erc20.sol";

contract TYTokenBank is AccessControl, Freezable {
    bytes32 private constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant CLIENT_ROLE = keccak256("CLIENT_ROLE");
    int clientCounter;
    TYToken private tyt;
    // Faucet private faucet;

    struct ClientAccount {
        int clientId;
        uint clientBlance;
    }

    // ClientAccount[] clients;
    mapping(address => ClientAccount) clients;

    address public tytAddress;

    constructor(address _tytAddress) Freezable(msg.sender) {
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, OWNER_ROLE);
        _grantRole(OWNER_ROLE, msg.sender);
        clientCounter = 0;
        tyt = TYToken(_tytAddress);
    }

    function deposit(uint amount) public notFrozen {
        require(
            tyt.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        clients[msg.sender].clientBlance += amount;
    }

    function withdraw(uint amount) public notFrozen {
        require(
            clients[msg.sender].clientBlance >= amount,
            "Insufficient balance"
        );
        require(tyt.transfer(msg.sender, amount), "Transfer failed");
        clients[msg.sender].clientBlance -= amount;
    }

    function transfer(address to, uint amount) public notFrozen {
        require(
            clients[msg.sender].clientBlance >= amount,
            "Insufficient balance"
        );
        clients[msg.sender].clientBlance -= amount;
        clients[to].clientBlance += amount;
    }

    function getBalance() public view returns (uint) {
        return clients[msg.sender].clientBlance;
    }

    function getContractBalance()
        public
        view
        onlyRole(OWNER_ROLE)
        returns (uint)
    {
        return tyt.balanceOf(address(this));
    }

    function mintFromTyToken(uint amount) public {
        tyt.mint(amount);
        clients[msg.sender].clientBlance += amount;
    }
}
