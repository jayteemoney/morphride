require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    morph: {
      url: process.env.MORPH_RPC,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
