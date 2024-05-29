// context/Web3Modal.tsx

"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

// Your WalletConnect Cloud project ID
// TODO: Use process.env.PROJECT_ID
export const projectId = "";
if (!projectId) {
  throw new Error("PROJECT_ID is not set");
}

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

const sepolia = {
  chainId: 11155111,
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://api-sepolia.etherscan.io",
  rpcUrl: "https://sepolia.infura.io/v3/bf64846306f345b3a9f5b637c4036da7",
};

// 3. Create a metadata object
const metadata = {
  name: "Blockchain HW",
  description: "Web3Modal Example",
  url: "http://localhost", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [sepolia],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return children;
}
