// components/sample.tsx
"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useWillContract } from "@/hooks/useContract"
import { isAddress } from "viem"

const SampleIntregation = () => {
  const { isConnected, address } = useAccount()
  const [recipientAddress, setRecipientAddress] = useState("")
  const [discountValue, setDiscountValue] = useState("")
  const [usesValue, setUsesValue] = useState("")
  const [targetRemoveAddress, setTargetRemoveAddress] = useState("")

  const { data, actions, state } = useWillContract()

  const isOwner = data.contractOwner?.toLowerCase() === (address ?? "").toLowerCase()

  const handleGiveCard = async () => {
    if (!recipientAddress || !discountValue || !usesValue) return
    if (!isAddress(recipientAddress)) return
    try {
      const discount = Number(discountValue)
      const uses = Number(usesValue)
      await actions.giveCard(recipientAddress, discount, uses)
      setRecipientAddress("")
      setDiscountValue("")
      setUsesValue("")
    } catch (err) {
      console.error("Error:", err)
    }
  }

  const handleRemoveCard = async () => {
    if (!targetRemoveAddress || !isAddress(targetRemoveAddress)) return
    try {
      await actions.removeCard(targetRemoveAddress)
      setTargetRemoveAddress("")
    } catch (err) {
      console.error("Error:", err)
    }
  }

  const handleUseMyCard = async () => {
    try {
      await actions.useMyCard()
    } catch (err) {
      console.error("Error using card:", err)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-foreground mb-3">Discount Card</h2>
          <p className="text-muted-foreground">Please connect your wallet to interact with the Discount Card contract.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Discount Card</h1>
          <p className="text-muted-foreground text-sm mt-1">View, give, remove, and use discount cards</p>
        </div>

        {/* Card Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Your Card</p>
            <p className="text-lg font-semibold text-foreground">Discount: {data.myCard.discount}%</p>
            <p className="text-sm text-foreground">Uses Left: {data.myCard.usesLeft}</p>
            <p className="text-sm text-foreground">Active: {data.myCard.active ? "Yes" : "No"}</p>
            <div className="mt-3">
              <button
                onClick={handleUseMyCard}
                disabled={state.isLoading || !data.myCard.active || data.myCard.usesLeft <= 0}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {state.isLoading ? "Processing..." : "Use My Card"}
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Contract Owner</p>
            <p className="text-sm font-mono text-foreground break-all">{data.contractOwner ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-2">Only the contract owner can give or remove cards.</p>
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="mb-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                <label className="block text-sm font-medium text-foreground">Give Card</label>
              </div>
              <input
                type="text"
                placeholder="Recipient address 0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all mb-2"
              />
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Discount %"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  min="0"
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <input
                  type="number"
                  placeholder="Uses"
                  value={usesValue}
                  onChange={(e) => setUsesValue(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={handleGiveCard}
                disabled={state.isLoading || !recipientAddress || !discountValue || !usesValue || !isAddress(recipientAddress)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {state.isLoading ? "Sending..." : "Give Card"}
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">2</span>
                <label className="block text-sm font-medium text-foreground">Remove Card</label>
              </div>
              <input
                type="text"
                placeholder="Address to remove (0x...)"
                value={targetRemoveAddress}
                onChange={(e) => setTargetRemoveAddress(e.target.value)}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all mb-2"
              />
              <button
                onClick={handleRemoveCard}
                disabled={state.isLoading || !targetRemoveAddress || !isAddress(targetRemoveAddress)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {state.isLoading ? "Removing..." : "Remove Card"}
              </button>
            </div>
          </div>
        )}

        {/* Non-owner info */}
        {!isOwner && (
          <div className="mb-6 p-4 bg-card border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">You are not the contract owner. Only the owner can give or remove cards.</p>
          </div>
        )}

        {/* Status Messages */}
        {state.hash && (
          <div className="mt-6 p-4 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Transaction Hash</p>
            <p className="text-sm font-mono text-foreground break-all mb-3">{state.hash}</p>
            {state.isConfirming && <p className="text-sm text-primary">Waiting for confirmation...</p>}
            {state.isConfirmed && <p className="text-sm text-green-500">Transaction confirmed!</p>}
          </div>
        )}

        {state.error && (
          <div className="mt-6 p-4 bg-card border border-destructive rounded-lg">
            <p className="text-sm text-destructive-foreground">Error: {state.error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SampleIntregation
