# 🎟️ Discount Card — On-Chain Discount Management

A lightweight and fully on-chain discount card system that allows merchants or dApps to **issue, manage, and redeem discount cards** tied directly to a user’s wallet address.

---

## 📍 Contract Address  
**`0xCD62eCF30ed073F01997f092639b4e4eC0C7aCae`**  
Explorer: https://coston2-explorer.flare.network/address/0xCD62eCF30ed073F01997f092639b4e4eC0C7aCae
<img width="2018" height="839" alt="image" src="https://github.com/user-attachments/assets/b2b08fb5-487c-422c-b197-86bbe0e4f0e6" />


---

## 📝 Project Description

**Discount Card** is a smart contract system that grants per-wallet discount cards with controlled usage limits.  
Each card contains:

- **`discount`** — numeric discount value (e.g., percentage)  
- **`usesLeft`** — how many times it can be redeemed  
- **`active`** — status flag  

The contract ensures **tamper-proof issuance**, **secure redemption**, and **transparent event logs** (`CardGiven`, `CardRemoved`, `CardUsed`).  
A frontend (React + wagmi/viem) can be used for owner and user interactions.

---

## 🚀 Features

- 🔒 **Owner-only issuance** of discount cards  
- ❌ **Owner-only revocation** of existing cards  
- 🧾 **User redemption** via `useMyCard` (decrements `usesLeft`)  
- 👤 **`myCard` view** to fetch discount details for the connected wallet  
- 📡 **Event emissions** for actions:  
  - `CardGiven`  
  - `CardRemoved`  
  - `CardUsed`  
- 🔍 Fully on-chain & auditable state

---

## 💡 Why This Solves a Real Problem

### ⚠️ Traditional Discount Codes Are Broken
- Easily shared  
- Unlimited reuse  
- Hard to track  
- No per-user control  
- No audit logs  

### ✅ On-Chain Discount Cards Fix This
- **Per-wallet binding** ensures discounts belong only to the intended user  
- **Usage limits enforced by the contract**  
- **100% tamper-proof issuance and redemption**  
- **Transparent audit trails through events**  
- **Wallet-based UX** for seamless integration in dApps or POS systems  

---

## 🧩 Use Cases

- VIP or loyalty discounts for merchants  
- Giveaway campaigns for wallet-based users  
- Per-wallet non-transferable benefits in dApps  
- Limited-use coupon systems  
- On-chain access passes with redeemable perks  

---

## 🔗 Integration Notes

A typical frontend stack:  
- **React**  
- **wagmi + viem**  

Capabilities:  
- Read card data with `myCard`  
- Issue cards with `giveCard` (owner-only)  
- Revoke via `removeCard`  
- Let users redeem via `useMyCard`  

Events (`CardGiven`, `CardRemoved`, `CardUsed`) can be indexed using:  
- Custom backend  
- The Graph  
- Flare indexing tools  

---

## 📚 Recommended Enhancements

- 📈 Build admin dashboards using event indexers  
- 🛒 Checkout integration to auto-apply discounts  
- 🕒 Add expiration timestamps  
- 🏷️ Add categorized discounts or multi-tier benefits  
- 🪪 Add off-chain metadata for additional card attributes  

---

## 🧾 License

MIT License  

---

## 🏷️ Repository Name  
**`Discount_Card`**

---

