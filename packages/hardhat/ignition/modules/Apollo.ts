import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Apollo", (m) => {
  const apollo = m.contract("Faucet", ["0x8FFcC6f1947d8d76a27Be78eCF6740d274b290Ab"]);

  m.call(apollo, "launch", []);

  return { apollo };
});
