// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import {console} from "hardhat/console.sol";

/**
 * @title Concert ticket management system using ERC721 NFT
 * @author Youmin & Tu
 *
 * Manager:
 * - Provide concert information
 * - Create new tickets (NFT) for concert
 * - Clean current buyable tickets and mark them as expired
 * - Limit each client can only has one ticket per concert
 *
 * Client:
 * - Buy tickets
 * - Transfer to another client
 * - Get information of concert
 * - Get information of tickets
 */

// 設定情境: 演唱會門票
// 一張門票只能一人使用，所以不會用到授權
contract ConcertTicket is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    mapping(uint256 => Ticket) private _tickets;
    mapping(address => uint256[]) private owned_tickets; // 只記錄用戶，不紀錄管理者

    uint256[] private sold_tokenIds;
    uint256[] private buyable_tokenIds;
    uint[] private tokenIdRange; // [min, max]
    uint private tokenIdCounter;

    // 基本資訊
    string private title;
    string private description;
    string private date;
    string private place;

    struct Ticket {
        uint256 tokenId; // 直接用 token id 當作 ticket id
        string _tokenURI; // IPFS URL
        bool expired;
        // 座位資訊
        uint area;
        uint seet;
        uint _type; // 全票，VIP套票
        uint256 price;
    }

    // 合約創建時，初始化 ERC721 並指定原始擁有者 (管理者)
    constructor(
        address initalOwner,
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) Ownable(initalOwner) {
        tokenIdCounter = 0;
        tokenIdRange = new uint[](2);
    }

    modifier ticketNotSold(uint256 tokenId) {
        bool sold = false;

        for (uint i = 0; i < sold_tokenIds.length; i++) {
            if (tokenId == sold_tokenIds[i]) {
                sold = true;
            }
        }

        require(!sold, "ticket has already been sold or not exists!");
        _;
    }

    // 檢查此梯次演唱會是否已經擁有一張門票
    modifier onlyOneTicketPerConcert(address client) {
        bool noTicket = true;
        for (uint i = 0; i < sold_tokenIds.length; i++) {
            if (ownerOf(sold_tokenIds[i]) == client) {
                noTicket = false;
            }
        }

        require(
            noTicket,
            "This address is already hold one ticket in this concert"
        );
        _;
    }

    // 方便初始化不同演唱會的資訊
    function initialConcertInfo(
        string memory title_,
        string memory description_,
        string memory date_,
        string memory place_
    ) external onlyOwner {
        title = title_;
        description = description_;
        date = date_;
        place = place_;
    }

    function getConcertInfo()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            uint[] memory
        )
    {
        return (title, description, date, place, tokenIdRange);
    }

    // 演唱會結束後，將所有的 tokenIds 的門票標記 expired = true，並清空 tokenIds list
    function cleanTickets() public onlyOwner {
        for (uint i = 0; i < buyable_tokenIds.length; i++) {
            _tickets[buyable_tokenIds[i]].expired = true;
        }

        for (uint i = 0; i < sold_tokenIds.length; i++) {
            _tickets[sold_tokenIds[i]].expired = true;
        }

        delete buyable_tokenIds;
        delete sold_tokenIds;

        console.log(
            "Log: all currrent buyable tickets have been clean and marked them as expired"
        );
    }

    // 依照座位數量生成門票，需指定區域、座位數量、門票類型、價錢
    function genTickets(
        uint area,
        uint seet_size,
        uint type_,
        uint256 price
    ) public onlyOwner {
        for (uint i = 0; i < seet_size; i++) {
            tokenIdCounter += 1;
            buyable_tokenIds.push(tokenIdCounter);

            _tickets[tokenIdCounter] = Ticket(
                tokenIdCounter,
                "",
                false,
                area,
                i,
                type_,
                price
            );

            _safeMint(msg.sender, tokenIdCounter);
        }

        genTicketRange();
    }

    // 指定一定數量的區域，為每個區域加上同樣的座位數量
    function genAreaTickets(
        uint n_area,
        uint seet_size,
        uint type_,
        uint256 price
    ) public onlyOwner {
        for (uint i = 0; i < n_area; i++) {
            genTickets(i, seet_size, type_, price);
        }
    }

    // 生成 id 區間，用於表示此次演唱會的門票包含哪些 id
    function genTicketRange() internal {
        tokenIdRange[0] = buyable_tokenIds[0];
        tokenIdRange[1] = buyable_tokenIds[buyable_tokenIds.length - 1];
    }

    // 查詢相關資料
    function getBuyableTickets() public view returns (uint256[] memory) {
        return buyable_tokenIds;
    }

    function getSoldTickets() public view returns (uint256[] memory) {
        return sold_tokenIds;
    }

    function getTicketInfo(
        uint256 tokenId
    ) public view returns (Ticket memory) {
        return _tickets[tokenId];
    }

    // 查看自己擁有的門票
    function getOwnedTickets() public view returns (uint256[] memory) {
        return owned_tickets[msg.sender];
    }

    // 購買指定門票，每個人在每次演唱會只能擁有一張門票，而且只能由本人購買
    function buyTicket(
        uint256 tokenId
    )
        external
        payable
        // string memory uri
        ticketNotSold(tokenId)
        onlyOneTicketPerConcert(msg.sender)
    {
        require(
            msg.value == _tickets[tokenId].price,
            "given money is not enough or exceed"
        );

        _safeTransfer(owner(), msg.sender, tokenId);

        // _setTokenURI(tokenId, uri);

        sold_tokenIds.push(tokenId);

        for (uint i = 0; i < buyable_tokenIds.length; i++) {
            if (buyable_tokenIds[i] == tokenId) {
                for (uint j = i; j < buyable_tokenIds.length - 1; j++) {
                    buyable_tokenIds[j] = buyable_tokenIds[j + 1];
                }

                buyable_tokenIds.pop();
                break;
            }
        }

        owned_tickets[msg.sender].push(tokenId);

        console.log(
            "Log: %s buy ticket %s from %s",
            msg.sender,
            tokenId,
            owner()
        );
    }

    // 轉讓門票只能由本人操作，也就是擁有者
    function transferOnlyTicketOwner(address to, uint256 tokenId) external {
        safeTransferFrom(msg.sender, to, tokenId);

        // 轉讓後原本擁有者刪除 tokenId，目標 address 增加一個 tokenId

        // 搜尋並刪除
        for (uint i = 0; i < owned_tickets[msg.sender].length; i++) {
            if (owned_tickets[msg.sender][i] == tokenId) {
                for (
                    uint j = i;
                    j < owned_tickets[msg.sender].length - 1;
                    j++
                ) {
                    owned_tickets[msg.sender][j] = owned_tickets[msg.sender][
                        j + 1
                    ];
                }

                owned_tickets[msg.sender].pop();
                break;
            }
        }

        // 新增
        owned_tickets[to].push(tokenId);

        console.log(
            "Log: %s transfer ticket %s to %s",
            msg.sender,
            tokenId,
            to
        );
    }

    ///////////////////////////////////////////////////////////////////////////

    // https://www.quicknode.com/guides/ethereum-development/nfts/how-to-create-and-deploy-an-erc-721-nft

    // The following functions are overrides required by Solidity.

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
