import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TYToken Bank", function () {
  async function deployTYTBankFixture() {
    // const lockedAmount = ethers.parseEther("1000");

    const [owner, otherAccount] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("10000");

    const TYT = await ethers.getContractFactory("TYToken");
    const tyt = await TYT.deploy(initialSupply);

    await tyt.waitForDeployment();

    const Bank = await ethers.getContractFactory("TYTokenBank");
    const bank = await Bank.deploy(tyt);

    return { tyt, bank, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should able to mint from TYToken", async function () {
      const { tyt, bank, owner, otherAccount } = await loadFixture(deployTYTBankFixture);
      await bank.connect(otherAccount).mintFromTyToken(1000);
      expect(await bank.connect(otherAccount).getBalance()).to.equal(1000);
    });

    it("Should able to deposit to TYTokenBank", async function () {
      const { tyt, bank, owner, otherAccount } = await loadFixture(deployTYTBankFixture);
      await tyt.approve(bank, 1000);
      await bank.deposit(1000);
      expect(await bank.getBalance()).to.equal(1000);
    });

    it("Should able to withdraw from TYTokenBank", async function () {
      const { tyt, bank, owner, otherAccount } = await loadFixture(deployTYTBankFixture);
      await tyt.approve(bank, 1000);
      await bank.deposit(1000);
      await bank.withdraw(1000);
      expect(await bank.getBalance()).to.equal(0);
    });

    it("Should able to transfer to other account", async function () {
      const { tyt, bank, owner, otherAccount } = await loadFixture(deployTYTBankFixture);
      await tyt.approve(bank, 1000);
      await bank.deposit(1000);
      await bank.transfer(otherAccount, 1000);
      expect(await bank.getBalance()).to.equal(0);
      expect(await bank.connect(otherAccount).getBalance()).to.equal(1000);
    });
  });
});
