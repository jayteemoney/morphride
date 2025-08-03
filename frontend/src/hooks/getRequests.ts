import { useReadContract,  } from "wagmi";
import { DELIVERY_CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/config/contracts";

const getRequests = async () => {
  const { data, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESSES.DELIVERY_CONTRACT as `0x${string}`,
    abi: DELIVERY_CONTRACT_ABI,
    functionName: "getRequests",
  });

  if (isLoading) {
    console.log("Loading...");
    return [];
  }

  if (isError) {
    console.error("Error fetching requests:", isError);
    return [];
  }

  return data || [];
};
