# Arkai NFT Staking — Project Overview

> Last updated: Feb 24, 2026

## What It Is

A decentralized application (dApp) on the **Movement (Aptos)** network where users **hold Arkai NFTs in their wallet** to participate in milestone-based reward pools. No locking or on-chain deposit is required — eligibility is determined by the NFTs already in your wallet. Reward tiers are gated by Discord role and NFT count.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Routing | TanStack Router (file-based) |
| Server State | TanStack React Query |
| Client State | TanStack Store + Zustand |
| Blockchain | Movement (Aptos) via RazorKit |
| Animations | GSAP, Motion |
| Graphics | Pixi.js (WebGL) |
| UI | Tailwind CSS, Radix UI, Base UI |
| Build | Vite + TypeScript |
| Package Manager | pnpm |

---

## Project Structure

```
arkai-nft-stacking/
├── docs/                   # Project documentation (this folder)
├── public/                 # Static public assets
├── scripts/                # Utility scripts
├── src/
│   ├── assets/             # Images, static files
│   ├── components/
│   │   ├── animate-ui/     # Animation wrapper components
│   │   ├── icons/          # SVG icon components
│   │   ├── layouts/        # Header, Footer, page layouts
│   │   ├── playground/     # Pixi.js game UI (PixiPlayground.tsx + store/gameUI/parts/animations)
│   │   ├── ui/             # UI primitives (buttons, dialogs, etc.)
│   │   └── web3/           # Wallet/blockchain UI components
│   ├── constants/
│   │   ├── appConfig.ts    # Env var config (RPC, API, NFT collection)
│   │   └── rolesMap.ts     # Tier/role mapping logic
│   ├── hooks/
│   │   ├── authentication/ # Wallet login, Discord connect, token management
│   │   ├── nfts/           # NFT fetching hooks
│   │   ├── playground/     # Pixi.js game state hooks
│   │   └── pools/          # Pool join, claim rewards, fetch pools hooks
│   ├── integrations/
│   │   ├── axios/          # HTTP client setup
│   │   └── tanstack-query/ # React Query client setup
│   ├── lib/                # Shared utilities
│   ├── routes/
│   │   ├── __root.tsx      # Root layout
│   │   ├── _app/           # Authenticated routes: dashboard, pool, my-pool, rules, notification
│   │   ├── _common/        # Shared/public routes
│   │   └── _onboarding/    # Wallet + Discord connect flow (index, connect)
│   ├── routeTree.gen.ts    # Auto-generated TanStack Router tree
│   ├── main.tsx            # App entry point
│   └── styles.css          # Global styles
├── .env.example            # Environment variable template
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── netlify.toml
└── vercel.json
```

---

## Authentication Flow

```
1. User opens app
2. Connect wallet via RazorKit (Movement/Aptos)
3. Connect Discord account (OAuth)
4. Backend generates nonce + message
5. User signs message with wallet
6. Backend verifies signature + checks Discord role + counts NFTs in wallet
7. Token stored locally → user enters app
```

Hooks involved:
- `useLoginWithWallet` — initiates wallet sign-in
- `useConnectDiscord` — Discord OAuth redirect
- `useSignAndBindDiscord` — signs & binds Discord to wallet
- `useTokenManager` — manages session tokens

---

## Holding Pools & Tiers

Users register for a pool matching their NFT count. The backend periodically verifies the required NFTs are still in the wallet. Rewards unlock at weekly milestones as long as the user continues to hold.


| Tier | NFTs Required | Pool Name |
|---|---|---|
| Tier 1 | 3 | Whispering Woods |
| Tier 2 | 6 | Crimson Caverns |
| Tier 3 | 9 | Golden Fields |
| Tier 4 | 12 | Sunken City |
| Tier 5 | 15 | Shadowfell Peaks |

Pool hooks:
- `useGetPools` — fetch available pools
- `useGetCurrentPool` — user's active pool
- `useJoinPool` — register for a pool
- `useGetPoolRewards` — fetch milestone reward data
- `useClaimRewards` — claim unlocked milestone rewards

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_MAINNET_RPC` | Movement network RPC endpoint |
| `VITE_MAINNET_CHAINID` | Chain ID |
| `VITE_MAINNET_INDEXER` | Indexer URL |
| `VITE_API_URL` | Backend API base URL |
| `VITE_ASSETS_BASE_URL` | CDN / assets base URL |
| `VITE_NFT_COLLECTION_ADDRESS` | Arkai NFT collection address |

---

## Key Scripts

```bash
pnpm dev      # Dev server on :3000
pnpm build    # Production build → dist/
pnpm serve    # Preview production build
pnpm test     # Vitest test suite
```

---

## Deployment

Configured for both **Vercel** (`vercel.json`) and **Netlify** (`netlify.toml`).
