import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = ethers.parseEther("1000");

  const TYT = await ethers.getContractFactory("TYToken");
  const tyt = await TYT.deploy(10000);
  // const tyt = await ethers.deployContract("TYToken", [10000]);
  // await tyt.waitForDeployment();

  console.log(
    `Deployed TYToken with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} to ${await tyt.getAddress()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
