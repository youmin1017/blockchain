import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import { ethers, ignition } from "hardhat";

export default buildModule("TYTokenBank", (m) => {
  const tyt = m.contract("TYToken", [ethers.parseEther("10000")], {});
  const bank = m.contract("TYTokenBank", [tyt]);

  return { tyt, bank };
});
