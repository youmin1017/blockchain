import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TYToken", function () {
  async function deployTYTokenFixture() {
    // const lockedAmount = ethers.parseEther("1000");

    const [owner, otherAccount] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("10000");

    const TYT = await ethers.getContractFactory("TYToken");
    const tyt = await TYT.deploy(initialSupply);

    return { tyt, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should able to mint token", async function () {
      const { tyt, owner, otherAccount } = await loadFixture(deployTYTokenFixture);

      expect(await tyt.connect(otherAccount).mint(1000)).to.be.ok;
    });

    it("Should able to transfer", async function () {
      const { tyt, owner, otherAccount } = await loadFixture(deployTYTokenFixture);

      await tyt.transfer(otherAccount, 1000);

      expect(await tyt.balanceOf(otherAccount)).to.equal(1000);
    });

    it("Should able to approve and transferFrom", async function () {
      const { tyt, owner, otherAccount } = await loadFixture(deployTYTokenFixture);

      await tyt.approve(otherAccount, 1000);
      await tyt.connect(otherAccount).transferFrom(owner, otherAccount, 1000);

      expect(await tyt.balanceOf(otherAccount.address)).to.equal(1000);
    });

    it("Should not able to transfer more than balance", async function () {
      const { tyt, owner, otherAccount } = await loadFixture(deployTYTokenFixture);

      await expect(tyt.connect(otherAccount).transfer(owner, 1001)).to.be.reverted;
    });

    it("Should not able to transfer more than approved amount", async function () {
      const { tyt, owner, otherAccount } = await loadFixture(deployTYTokenFixture);

      await tyt.approve(otherAccount, 1000);

      await expect(tyt.connect(otherAccount).transferFrom(owner, otherAccount, 1001)).to.be.reverted;
    });
  });
});
