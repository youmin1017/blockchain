import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import "hardhat-gas-reporter";
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      accounts: {
        mnemonic: process.env.SEED_PHRASE,
      },
      chainId: 1337,
    },
  },
  gasReporter: {
    enabled: false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
};

export default config;
