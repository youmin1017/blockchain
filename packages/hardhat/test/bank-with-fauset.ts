import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Bank with Faucet", function () {
  async function deployBankWithFaucetFixture() {
    const lockedAmount = ethers.parseEther("1000");

    const [owner, otherAccount] = await ethers.getSigners();

    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy({ value: lockedAmount });

    await faucet.waitForDeployment();

    const Bank = await ethers.getContractFactory("BankWithFaucet");
    const bank = await Bank.deploy(await faucet.getAddress());

    return { bank, faucet, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { bank, owner, otherAccount, lockedAmount } = await loadFixture(deployBankWithFaucetFixture);

      expect(await bank.owner()).to.equal(owner.address);
    });

    it("Should be able to register", async function () {
      const { bank, owner, otherAccount, lockedAmount } = await loadFixture(deployBankWithFaucetFixture);

      await bank.register(otherAccount.address);
      expect(await bank.connect(otherAccount).isRegistered()).to.true;
    });

    it("Should be able to withdraw from the faucet", async function () {
      const { bank, owner, otherAccount, lockedAmount } = await loadFixture(deployBankWithFaucetFixture);

      await bank.register(otherAccount);
      await bank.connect(otherAccount).withdrawFromFaucet(ethers.parseEther("1"));

      expect(await bank.connect(otherAccount).getBalance()).to.eq(ethers.parseEther("1"));
    });

    it("Should be able to withdraw from the bank", async function () {
      const { bank, owner, otherAccount, lockedAmount } = await loadFixture(deployBankWithFaucetFixture);
      const otherAccountBalance = await ethers.provider.getBalance(otherAccount);

      await bank.register(otherAccount);
      await bank.connect(otherAccount).withdrawFromFaucet(ethers.parseEther("1"));
      await bank.connect(otherAccount).withdraw(ethers.parseEther("1"));

      expect(await ethers.provider.getBalance(otherAccount)).to.greaterThan(otherAccountBalance);
    });

    it("Should be able to deposit to the bank", async function () {
      const { bank, owner, otherAccount, lockedAmount } = await loadFixture(deployBankWithFaucetFixture);

      await bank.register(otherAccount);
      const res = await bank.connect(otherAccount).deposit({ value: ethers.parseEther("1") });

      // expect(await bank.getBalance()).to.eq(ethers.parseEther("1"));
      expect(await bank.connect(otherAccount).getBalance()).to.eq(ethers.parseEther("1"));
    });

    it("Should be able to transfer to other account", async function () {
      const { bank, owner, otherAccount, lockedAmount } = await loadFixture(deployBankWithFaucetFixture);

      await bank.register(owner);
      await bank.register(otherAccount);
      await bank.connect(otherAccount).withdrawFromFaucet(ethers.parseEther("1"));
      await bank.connect(otherAccount).transfer(owner, ethers.parseEther("1"));

      expect(await bank.connect(owner).getBalance()).to.eq(ethers.parseEther("1"));
    });

    it("Should be able to diregister", async function () {
      const { bank, owner, otherAccount, lockedAmount } = await loadFixture(deployBankWithFaucetFixture);

      await bank.register(otherAccount);
      await bank.deregister(otherAccount);

      expect(await bank.connect(otherAccount).isRegistered()).to.false;
    });
  });
});
