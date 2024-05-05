// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// 設定情境: 演唱會門票
contract ConcertTicket is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    mapping(uint256 => Ticket) private _tickets;
    mapping(address => uint256[]) private owned_tickets;

    uint256[] private sold_tokenIds;
    uint256[] private buyable_tokenIds;
    uint private tokenIdCounter;

    // 基本資訊
    string public title;
    string public description;
    string public date;
    string public place;

    struct Ticket {
        address owner; // 紀錄此票的擁有者
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
    }

    modifier checkTicketNotSold(uint256 tokenId) {
        bool sold = false;

        for (uint i = 0; i < sold_tokenIds.length; i++) {
            if (tokenId == sold_tokenIds[i]) {
                sold = true;
            }
        }

        require(!sold, "ticket has already been sold or not exists!");
        _;
    }

    // 方便初始化不同演唱會的資訊
    function initalConcertInfo(
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
        returns (string memory, string memory, string memory, string memory)
    {
        return (title, description, date, place);
    }

    // 演唱會結束後，將所有的 tokenIds 的門票標記 expired = true，並清空 tokenIds list
    function cleanTickets() public onlyOwner {
        for (uint i = 0; i < buyable_tokenIds.length; i++) {
            _tickets[buyable_tokenIds[i]].expired = true;
        }

        delete buyable_tokenIds;
        delete sold_tokenIds;
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
                msg.sender,
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

    // For clients
    function getOwnedTickets() public view returns (uint256[] memory) {
        return owned_tickets[msg.sender];
    }

    // 購買指定門票 => 指定 tokenId
    function buyTicket(
        address to,
        uint256 tokenId
    )
        external
        payable
        // string memory uri
        checkTicketNotSold(tokenId)
    {
        require(msg.value == _tickets[tokenId].price);

        _safeTransfer(owner(), msg.sender, tokenId);

        // _setTokenURI(tokenId, uri);

        sold_tokenIds.push(tokenId);

        for (uint i = 0; i < buyable_tokenIds.length; i++) {
            if (buyable_tokenIds[i] == tokenId) {
                delete buyable_tokenIds[i];
                break;
            }
        }

        _tickets[tokenId].owner = to;

        owned_tickets[msg.sender].push(tokenId);
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
