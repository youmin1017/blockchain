import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Faucet", function () {
  async function deployTYTokenFixture() {
    // const lockedAmount = ethers.parseEther("1000");

    const [owner, otherAccount] = await ethers.getSigners();

    const TYT = await ethers.getContractFactory("TYToken");
    const tyt = await TYT.deploy(10000);

    return { tyt, owner, otherAccount };
  }

  describe("Deployment", function () {
  })
})