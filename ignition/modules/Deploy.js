require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const { ethers } = hre;  // Use ethers from hre (Hardhat Runtime Environment)
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  let stablecoinAddress = process.env.STABLECOIN_ADDRESS;
  console.log("Loaded STABLECOIN_ADDRESS from env:", stablecoinAddress);

  // Validate and checksum the address
  try {
    stablecoinAddress = ethers.utils.getAddress(stablecoinAddress); // converts to checksummed address
  } catch (err) {
    throw new Error("⚠️ STABLECOIN_ADDRESS is not a valid Ethereum address.");
  }

  if (!ethers.utils.isAddress(stablecoinAddress)) {
    throw new Error("⚠️ Invalid or missing STABLECOIN_ADDRESS in .env");
  }

  console.log("Using stablecoin address:", stablecoinAddress);

  const Delivery = await ethers.getContractFactory("DeliveryContract");
  const delivery = await Delivery.deploy(stablecoinAddress);
  await delivery.deployed();
  console.log("✅ DeliveryContract deployed to:", delivery.address);

  const NFT = await ethers.getContractFactory("ReputationNFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("✅ ReputationNFT deployed to:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
