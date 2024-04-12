// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract BankFaucet {
    // 定義用戶結構
    struct ClientAccount {
        int clientId;
        address clientAddress;
        uint clientBlance;
    }

    ClientAccount[] clients;

    // 設置一個用戶計數器，用來當作流水號
    int clientCounter;

    // 這個銀行合約的管理者
    address payable manager;

    // 每個用戶對應到 => 最後利息轉入時間
    mapping(address => uint) public interestDate;

    // constructor
    constructor() {
        clientCounter = 0;
    }

    // modifiers: 函數修改器，用來對函數進行限制，_ 可以視為目標函數
    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call!");
        _;
    }

    modifier onlyClients() {
        bool isClient = false;

        for (uint i = 0; i < clients.length; i++) {
            if (clients[i].clientAddress == msg.sender) {
                isClient = true;
                break;
            }
        }

        require(isClient, "Only clients can call!");

        _;
    }

    // methods
    function setManager(address managerAddress) public returns (string memory) {
        manager = payable(managerAddress);

        return "";
    }

    // 加入這個銀行合約
    function joinAsClient() public payable returns (string memory) {
        interestDate[msg.sender] = block.timestamp;
        clients.push(
            ClientAccount(
                clientCounter++,
                msg.sender,
                address(msg.sender).balance
            )
        );

        return "";
    }

    // 用戶將錢轉到這個合約
    function deposit() public payable onlyClients {
        payable(address(this)).transfer(msg.value);
    }

    // 轉錢給用戶
    function withdraw(uint amount) public payable onlyClients {
        // 0.1 ether
        require(amount <= 100000000000000000);

        payable(msg.sender).transfer(amount);
    }

    // 發送利息給全部 clients
    function sendInterest() public payable onlyManager {
        for (uint i = 0; i < clients.length; i++) {
            address initialAddress = clients[i].clientAddress;
            uint lastInterestDate = interestDate[initialAddress];
            if (block.timestamp < lastInterestDate + 10 seconds) {
                revert("It's just been less than 10 seconds!");
            }
            payable(initialAddress).transfer(1 ether);
            interestDate[initialAddress] = block.timestamp;
        }
    }

    // 取得目前合約餘額
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    // fallback
    receive() external payable {}
}
