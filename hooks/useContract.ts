// hooks/useContract.ts
"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { contractABI, contractAddress } from "@/lib/contract"

export interface CardData {
  discount: string
  usesLeft: number
  active: boolean
}

export interface ContractData {
  myCard: CardData
  contractOwner: `0x${string}` | null
}

export interface ContractState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: `0x${string}` | undefined
  error: Error | null
}

export interface ContractActions {
  giveCard: (user: string, discount: number, uses: number) => Promise<void>
  removeCard: (user: string) => Promise<void>
  useMyCard: () => Promise<void>
}

export const useWillContract = () => {
  // Keeping the hook name `useWillContract` for compatibility with existing imports (sample.tsx)
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)

  // Read myCard (for connected wallet)
  const {
    data: myCardRaw,
    refetch: refetchMyCard,
  } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "myCard",
    query: {
      enabled: !!address,
    },
  })

  // Read contract owner
  const { data: owner, refetch: refetchOwner } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "owner",
  })

  const { writeContractAsync, data: writeData, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData as any,
  })

  useEffect(() => {
    if (isConfirmed) {
      refetchMyCard()
      refetchOwner()
    }
  }, [isConfirmed, refetchMyCard, refetchOwner])

  const giveCard = async (user: string, discount: number, uses: number) => {
    if (!user) return
    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "giveCard",
        args: [user as `0x${string}`, BigInt(discount), BigInt(uses)],
      })
    } catch (err) {
      console.error("Error giving card:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const removeCard = async (user: string) => {
    if (!user) return
    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "removeCard",
        args: [user as `0x${string}`],
      })
    } catch (err) {
      console.error("Error removing card:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const useMyCard = async () => {
    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "useMyCard",
        args: [],
      })
    } catch (err) {
      console.error("Error using card:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Normalize myCard data returned by the contract
  const myCard: CardData = myCardRaw
    ? {
        discount: (myCardRaw[0] ?? 0n).toString(),
        usesLeft: Number(myCardRaw[1] ?? 0n),
        active: Boolean(myCardRaw[2]),
      }
    : {
        discount: "0",
        usesLeft: 0,
        active: false,
      }

  const data: ContractData = {
    myCard,
    contractOwner: owner ? (owner as `0x${string}`) : null,
  }

  const actions: ContractActions = {
    giveCard,
    removeCard,
    useMyCard,
  }

  const state: ContractState = {
    isLoading: isLoading || isPending || isConfirming,
    isPending,
    isConfirming,
    isConfirmed,
    hash: writeData as `0x${string}` | undefined,
    error,
  }

  return {
    data,
    actions,
    state,
  }
}
