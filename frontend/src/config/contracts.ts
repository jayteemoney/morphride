import deliveryAbi from "@/lib/DeliveryAbi.json";
import mockCoinAbi from "@/lib/MockStableCoinAbi.json";
import reputationAbi from "@/lib/ReputationNftAbi.json";
import exp from "constants";

// Smart contract addresses and ABIs
export const CONTRACT_ADDRESSES = {
  DELIVERY_CONTRACT: "0x1106661FB7104CFbd35E8477796D8CD9fB3806f2",
  REPUTATION_NFT: "0x3f63c1AC1EBFf0babdb41fA1a6b7261D23bDC552",
  MOCK_STABLECOIN: "0x350ef55087B8aBc14B2458232EC7d9d49B0CC6f7",
};

export const DELIVERY_CONTRACT_ABI = deliveryAbi;

export const REPUTATION_NFT_ABI = reputationAbi;

export const MOCK_STABLECOIN_ABI = mockCoinAbi;
