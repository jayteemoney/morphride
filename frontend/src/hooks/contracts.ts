import { parseEther } from "viem"
import { useWatchContractEvent } from "wagmi"
import { useWaitForTransactionReceipt } from "wagmi"
import { useReadContract, useWriteContract } from "wagmi"
import { CONTRACT_ADDRESSES, DELIVERY_CONTRACT_ABI as ABI} from "@/config/contracts"

const CONTRACT_ADDRESS = CONTRACT_ADDRESSES.DELIVERY_CONTRACT as `0x${string}`

// Read Hooks
export function useAdmin() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'admin',
  })
}

export function useRequestCounter() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'requestCounter',
  })
}

export function useStablecoin() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'stablecoin',
  })
}

export function useRequest(requestId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'requests',
    args: [requestId],
  })
}

// Write Hooks
export function useCreateRequest() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  const createRequest = (amount: bigint, driver: `0x${string}`) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'createRequest',
      args: [amount, driver],
    } as any)
  }

  return {
    createRequest,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useCompleteRequest() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  const completeRequest = (requestId: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'completeRequest',
      args: [requestId],
    } as any)
  }

  return {
    completeRequest,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

// Event Hooks
export function useWatchRequestCreated() {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'RequestCreated',
  })
}

export function useWatchRequestCompleted() {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'RequestCompleted',
  })
}

// Helper Functions
export const formatAmount = (amount: string | number) => parseEther(amount.toString())
export const formatAddress = (address: string) => address as `0x${string}`