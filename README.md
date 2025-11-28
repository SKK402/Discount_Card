# Discount Card — On-chain Discount Management

## Project Title
**Discount Card** — A simple on-chain discount card system to issue, manage, and redeem discount cards tied to user addresses.

## Contract Address
`0x54db90E627d60Ab3220FB6685762771B1582c64F`  
Explorer: https://coston2-explorer.flare.network//tx/0xf5fe5a42e1a7e0422c763215f73c782e411dd42ce73319c01510abf43c6fce75

## Description
Discount Card is a lightweight smart contract system that allows a contract owner to grant discount cards to user addresses, revoke them, and enables users to redeem their cards. Each card stores three key pieces of data:

- `discount` — numeric discount value (e.g., percentage points)
- `usesLeft` — remaining times the card can be redeemed
- `active` — whether the card is active

The on-chain design ensures tamper-resistant issuance and redemption of discounts and provides transparent auditing via emitted events (`CardGiven`, `CardRemoved`, `CardUsed`). Frontend integrations (React + wagmi/viem) enable wallet-gated interactions for owners and users: owners can give/remove cards, and users can view and use their own cards.

## Features
- Owner-only issuance of discount cards to arbitrary addresses.
- Owner-only removal/revocation of cards.
- User-facing "use" action to consume a use from their own card (decrements `usesLeft`).
- Readable `myCard` view to fetch the connected wallet's card details (discount, uses left, active).
- Events emitted for issuance (`CardGiven`), removal (`CardRemoved`), and usage (`CardUsed`) for off-chain indexing and monitoring.

## How It Solves
### Problem
Traditional discount codes are often fragile: they can be copied, reused beyond intended limits, or lack precise user-binding and audit trails. Merchants or dApp operators need a secure, auditable way to grant limited-use discounts directly to user wallets.

### Solution
The Discount Card contract binds discounts directly to wallet addresses on-chain and enforces usage limits via contract logic. Key benefits include:

- **Security & Ownership**: Only the contract owner can create or revoke cards, preventing unauthorized issuance.
- **Transparency & Auditability**: On-chain events and public storage make all card actions auditable and traceable.
- **Limited Usage**: `usesLeft` enforces how many times a discount can be used, preventing abuse.
- **Wallet-Gated UX**: Users interact using their wallets, enabling seamless redemption flows in dApps and point-of-sale integrations.

### Typical Use Cases
- Merchant portals that want to grant VIP discounts to selected customers.
- Promotional campaigns where discounts are issued directly to participant wallets.
- Loyalty programs where discounts are consumed at checkout and limited by usage.
- dApps integrating per-wallet benefits that are non-transferable and auditable.

## Integration Notes
- Frontend sample uses React + wagmi + viem to: read `myCard`, call `giveCard`, `removeCard`, and `useMyCard`.
- Wallet gating ensures only connected users can view and act on their cards; owner-only actions are protected by the smart contract owner check.
- Events emitted by the contract (`CardGiven`, `CardRemoved`, `CardUsed`) can be indexed via an off-chain service or The Graph to build dashboards and audit logs.

## Links & References
- Contract Address: `0xCD62eCF30ed073F01997f092639b4e4eC0C7aCae`
- Explorer: https://coston2-explorer.flare.network/address/0xCD62eCF30ed073F01997f092639b4e4eC0C7aCae

## Recommended Next Steps
- Add off-chain indexing (events) to power admin dashboards.
- Add integrations with merchant checkout to apply discounts automatically when `useMyCard` is called or validated.
- Implement richer metadata (off-chain pointers) for cards if needed, or extend the contract with expiration timestamps and category-specific discounts.


