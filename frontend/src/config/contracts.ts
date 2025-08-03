import deliveryAbi from "@/lib/DeliveryAbi.json";
import mockCoinAbi from "@/lib/MockStableCoinAbi.json";
import reputationAbi from "@/lib/ReputationNftAbi.json";
import exp from "constants";

// Smart contract addresses and ABIs
export const CONTRACT_ADDRESSES = {
  DELIVERY_CONTRACT: "0x7F3974B5503c99A184122a6a4C1CF884F5c64Fb6",
  REPUTATION_NFT: "0x029dF2c1C69CEFe9Ce762B6a8d3D04b309Fc07D8",
  MOCK_STABLECOIN: "0x8B1fbcB9268BB5Ad85c6026C848A5d8Bf7D7888D",
};

export const DELIVERY_CONTRACT_ABI = deliveryAbi;

export const REPUTATION_NFT_ABI = reputationAbi;

export const MOCK_STABLECOIN_ABI = mockCoinAbi;
