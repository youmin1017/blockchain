import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Faucet", function () {
  async function deployFaucetFixture() {
    const lockedAmount = ethers.parseEther("1000");

    const [owner, otherAccount] = await ethers.getSigners();

    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy({ value: lockedAmount });

    return { faucet, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { faucet, owner, otherAccount, lockedAmount } = await loadFixture(deployFaucetFixture);

      expect(await faucet.owner()).to.equal(owner.address);
    });

    it("Should able to withdraw the funds", async function () {
      const { faucet, owner, otherAccount, lockedAmount } = await loadFixture(deployFaucetFixture);

      const res = await faucet.connect(otherAccount).withdraw(ethers.parseEther("1"));

      expect(await ethers.provider.getBalance(otherAccount)).to.greaterThan(ethers.parseEther("10000"));
    });

    it("Should not able to withdraw more than 1 ether", async function () {
      const { faucet, owner, otherAccount, lockedAmount } = await loadFixture(deployFaucetFixture);

      await expect(faucet.connect(otherAccount).withdraw(ethers.parseEther("2"))).to.be.revertedWith(
        "You can only withdraw up to 1 ether"
      );
    });
  });
});
