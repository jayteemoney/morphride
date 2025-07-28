require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Deploy Mock Stablecoin
  const MockStablecoin = await ethers.getContractFactory("MockStablecoin");
  const mockStablecoin = await MockStablecoin.deploy();
  console.log("Waiting for MockStablecoin to deploy...");
  await mockStablecoin.waitForDeployment(); // ⬅ Correct method for newer ethers versions

  const stablecoinAddress = await mockStablecoin.getAddress(); // ⬅ New way to get address
  console.log("✅ MockStablecoin deployed at:", stablecoinAddress);

  // Deploy DeliveryContract using the mock token
  const Delivery = await ethers.getContractFactory("DeliveryContract");
  const delivery = await Delivery.deploy(stablecoinAddress);
  console.log("Waiting for DeliveryContract to deploy...");
  await delivery.waitForDeployment();
  console.log("✅ DeliveryContract deployed to:", await delivery.getAddress());

  // Deploy ReputationNFT
  const NFT = await ethers.getContractFactory("ReputationNFT");
  const nft = await NFT.deploy();
  console.log("Waiting for ReputationNFT to deploy...");
  await nft.waitForDeployment();
  console.log("✅ ReputationNFT deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
