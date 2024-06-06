// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC1155MetadataURI} from "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract RestaurantCoupon is IERC1155MetadataURI, ERC1155, AccessControl {
    bytes32 private constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MEMBER_ROLE = keccak256("MEMBER_ROLE");
    uint256 private _nextTokenId;
    address public owner;

    uint256 public constant COUPON30 = 1;
    uint256 public constant COUPON40 = 2;
    uint256 public constant COUPON50 = 3;

    constructor()
        ERC1155(
            "https://ipfs.io/ipfs/QmQQqWxt5Q6C7zY1PMrkSZgfWc58iivLyLKCAZdabvuNMB/{id}.json"
        )
    {
        owner = msg.sender;
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
        _grantRole(ADMIN_ROLE, msg.sender);
        _mint(msg.sender, COUPON30, 100, "");
        _mint(msg.sender, COUPON40, 100, "");
        _mint(msg.sender, COUPON50, 100, "");
    }

    function mintCoupon(
        uint256 tokenId,
        uint32 amount
    ) public onlyRole(ADMIN_ROLE) {
        require(
            tokenId == COUPON30 || tokenId == COUPON40 || tokenId == COUPON50,
            "Invalid token id"
        );
        _mint(msg.sender, tokenId, amount, "");
    }

    function useCoupon(uint256 tokenId) public {
        require(
            tokenId == COUPON30 || tokenId == COUPON40 || tokenId == COUPON50,
            "Invalid token id"
        );
        _burn(tx.origin, tokenId, 1);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(IERC165, ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
