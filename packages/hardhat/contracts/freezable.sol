// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Freezable is Ownable {
    bool private _frozen;

    constructor(address owner) Ownable(owner) {}

    modifier notFrozen() {
        require(!_frozen, "Contract is frozen");
        _;
    }

    function freeze() internal onlyOwner {
        _frozen = true;
    }
}
