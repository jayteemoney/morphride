const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReputationNFT", function () {
  let ReputationNFT, nft, owner, addr1;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    ReputationNFT = await ethers.getContractFactory("ReputationNFT");
    nft = await ReputationNFT.deploy();
    await nft.waitForDeployment();
  });

  it("Should mint NFT manually and emit BadgeMinted event", async () => {
    const tx = await nft.mintBadge(addr1.address);
    await expect(tx).to.emit(nft, "BadgeMinted").withArgs(addr1.address, 0);
  });

  it("Should mint NFT after 5 deliveries and emit BadgeMinted event", async () => {
    for (let i = 0; i < 4; i++) {
      await nft.recordDeliveryAndMaybeMint(addr1.address);
    }
    const tx = await nft.recordDeliveryAndMaybeMint(addr1.address);
    await expect(tx).to.emit(nft, "BadgeMinted").withArgs(addr1.address, 0);
  });

  it("Should not mint NFT before 5 deliveries", async () => {
    await nft.recordDeliveryAndMaybeMint(addr1.address);
    await expect(nft.ownerOf(0)).to.be.reverted;
  });

  it("Should revert if mintBadge is called with zero address", async () => {
    await expect(nft.mintBadge(ethers.ZeroAddress)).to.be.revertedWith("Invalid driver address");
  });

  it("Should revert if recordDeliveryAndMaybeMint is called with zero address", async () => {
    await expect(nft.recordDeliveryAndMaybeMint(ethers.ZeroAddress)).to.be.revertedWith("Invalid driver address");
  });

  it("Should only allow owner to mint badges", async () => {
    await expect(nft.connect(addr1).mintBadge(addr1.address)).to.be.reverted;
  });
});
