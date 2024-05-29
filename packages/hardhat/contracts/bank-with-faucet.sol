// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {console} from "hardhat/console.sol";

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Faucet} from "./faucet.sol";
import {Freezable} from "./freezable.sol";

/**
 * @title BankWithFaucet
 * @author Youmin & Tu
 *
 * Features:
 * - AccessControl(Owner, Client)
 * - Register(owner only)
 * - Deregister(owner only)
 * - IsRegistered
 * - Deposit(client only)
 * - Withdraw(client only)
 * - Transfer(C2C)
 * - GetBalance(client only)
 * - WithdrawFromFaucet(offer by Faucet contract)
 * - GetContractBalance(owner only)
 * - SetInterest(owner only)
 * - Freezable
 */
contract BankWithFaucet is AccessControl, Freezable {
    bytes32 private constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant CLIENT_ROLE = keccak256("CLIENT_ROLE");
    int clientCounter;
    Faucet private faucet;

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

    /* 註冊銀行帳戶 */
    function register(address client) public notFrozen onlyRole(OWNER_ROLE) {
        require(!hasRole(CLIENT_ROLE, client), "Already registered");
        _grantRole(CLIENT_ROLE, client);
        clients[client] = ClientAccount(clientCounter++, 0);
    }

    /* 確認是否已經註冊 */
    function isRegistered() public view returns (bool) {
        return hasRole(CLIENT_ROLE, msg.sender);
    }

    /* 註銷銀行帳戶 */
    function deregister(address client) public notFrozen onlyRole(OWNER_ROLE) {
        require(hasRole(CLIENT_ROLE, client), "Not registered");
        _revokeRole(CLIENT_ROLE, client);
        if (clients[client].clientBlance > 0) {
            payable(client).transfer(clients[client].clientBlance);
        }
        delete clients[client];
    }

    /* 存款到合約中 */
    function deposit() public payable notFrozen {
        require(hasRole(CLIENT_ROLE, msg.sender), "Not registered");
        require(msg.sender.balance >= msg.value, "Insufficient balance");
        payable(address(this)).transfer(msg.value);
        clients[msg.sender].clientBlance += msg.value;
        console.log(
            "BankWithFaucetLog: bank balance %s",
            address(this).balance
        );
    }

    /* 從合約中提款 */
    function withdraw(uint amount) public notFrozen {
        require(hasRole(CLIENT_ROLE, msg.sender), "Not registered");
        require(
            clients[msg.sender].clientBlance >= amount,
            "Insufficient balance"
        );
        clients[msg.sender].clientBlance -= amount;
        payable(msg.sender).transfer(amount);
    }

    /* 從Faucet合約中提款到Bank中 */
    function withdrawFromFaucet(uint amount) public payable notFrozen {
        require(hasRole(CLIENT_ROLE, msg.sender), "Not registered");
        faucet.withdraw(amount);
        clients[msg.sender].clientBlance += amount;
    }

    /* 轉帳給其他帳戶 */
    function transfer(address to, uint amount) public notFrozen {
        require(hasRole(CLIENT_ROLE, msg.sender), "Not registered");
        require(hasRole(CLIENT_ROLE, to), "Recipient not registered");
        require(
            clients[msg.sender].clientBlance >= amount,
            "Insufficient balance"
        );
        clients[msg.sender].clientBlance -= amount;
        clients[to].clientBlance += amount;
    }

    function getBalance() public view notFrozen returns (uint) {
        require(hasRole(CLIENT_ROLE, msg.sender), "Not registered");
        return clients[msg.sender].clientBlance;
    }

    /* 取得合約餘額 */
    function getContractBalance()
        public
        view
        onlyRole(OWNER_ROLE)
        returns (uint)
    {
        return address(this).balance;
    }

    /**
     * 在合約關機時，將合約內的所有餘額轉移給合約擁有者(捲款跑路)
     */
    function shutdown() public onlyRole(OWNER_ROLE) {
        freeze();
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {}
}
