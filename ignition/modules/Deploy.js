const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Deploy", (m) => {
  const mockStablecoin = m.contract("MockStablecoin");
  const deliveryContract = m.contract("DeliveryContract", [mockStablecoin]);
  const reputationNFT = m.contract("ReputationNFT");

  return { mockStablecoin, deliveryContract, reputationNFT };
});