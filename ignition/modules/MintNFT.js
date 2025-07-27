const { ethers } = require("hardhat");

async function main() {
  const [deployer, driver] = await ethers.getSigners();

  const nftAddress = "0xYour_ReputationNFT_Contract_Address";
  const nft = await ethers.getContractAt("ReputationNFT", nftAddress);

  console.log("Minting badge to driver:", driver.address);
  const tx = await nft.recordDeliveryAndMaybeMint(driver.address);
  await tx.wait();

  console.log("NFT badge minted (if threshold met).");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
