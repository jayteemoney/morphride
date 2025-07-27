const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeliveryContract", function () {
  let FakeUSDC, fakeUSDC, DeliveryContract, delivery, owner, driver;

  beforeEach(async () => {
    [owner, driver] = await ethers.getSigners();

    // Deploy fake USDC
    FakeUSDC = await ethers.getContractFactory("FakeUSDC");
    fakeUSDC = await FakeUSDC.deploy();
    await fakeUSDC.waitForDeployment();

    // Deploy delivery contract
    DeliveryContract = await ethers.getContractFactory("DeliveryContract");
    delivery = await DeliveryContract.deploy(await fakeUSDC.getAddress());
    await delivery.waitForDeployment();

    // Mint tokens to driver so they can create a request
    await fakeUSDC.mint(driver.address, 1000);

    // Approve delivery contract to spend tokens
    await fakeUSDC.connect(driver).approve(await delivery.getAddress(), 1000);
  });

  it("Should create a request and pay the driver", async () => {
    await delivery.connect(driver).createRequest(100, driver.address);
    await delivery.connect(driver).completeRequest(0);

    const balance = await fakeUSDC.balanceOf(driver.address);
    expect(balance).to.equal(1000); // All transferred back
  });
});
