# Architecture

> Arkai NFT Staking Platform — system architecture reference. **"Staking" is the product name; users hold NFTs in their wallet — no on-chain locking occurs.**

---

## High-Level System Diagram

```mermaid
graph TB
    subgraph Client["Browser (React 19 + Vite)"]
        direction TB
        UI["UI Layer\n(Tailwind, Radix UI, Base UI)"]
        Router["TanStack Router\n(File-based routing)"]
        State["State Management\n(TanStack Query + Store + Zustand)"]
        Pixi["Pixi.js Game Layer\n(WebGL 2D renderer)"]
        Hooks["Custom Hooks"]
    end

    subgraph External["External Services"]
        API["Arkai Backend API\n(api-arkai.tumilabs.dev)"]
        Discord["Discord OAuth\n(discord.com/api)"]
        Chain["Movement Network\n(Aptos blockchain)"]
        Indexer["Movement Indexer"]
    end

    subgraph Wallet["Wallet Layer"]
        RazorKit["RazorKit\n(@razorlabs/razorkit)"]
        AptosSDK["@aptos-labs/ts-sdk"]
    end

    Router --> UI
    UI --> Hooks
    Hooks --> State
    State -->|"HTTP (axios)"| API
    Hooks -->|"Direct fetch"| Discord
    Hooks --> RazorKit
    RazorKit --> Chain
    AptosSDK --> Indexer
    Pixi --> UI
```

---

## Frontend Layer Architecture

```mermaid
graph LR
    subgraph routes["Routes (src/routes/)"]
        R1["/_onboarding\n index, connect"]
        R2["/_app\n dashboard, pool,\n my-pool, rules,\n notification"]
        R3["/_common\n shared routes"]
    end

    subgraph components["Components (src/components/)"]
        CL["layouts/\nHeader, Footer, Notification"]
        CUI["ui/\nbutton, dialog, dropdown,\nInkButton, loader, sonner"]
        CPG["playground/\nPixiPlayground + gameUI"]
        CW3["web3/\nWalletConnectButton"]
        CAI["animate-ui/"]
        CI["icons/"]
    end

    subgraph hooks["Hooks (src/hooks/)"]
        HA["authentication/\nuseLoginWithWallet\nuseConnectDiscord\nuseSignAndBindDiscord\nuseTokenManager"]
        HN["nfts/"]
        HP["pools/\nuseGetPools\nuseGetCurrentPool\nuseJoinPool\nuseGetPoolRewards\nuseClaimRewards"]
        HPG["playground/"]
    end

    routes --> components
    routes --> hooks
    components --> hooks
```

---

## Route Tree

```mermaid
graph TD
    Root["__root.tsx\n(App shell, providers)"]
    Root --> Onboarding["_onboarding.tsx"]
    Root --> App["_app.tsx\n(Auth guard)"]
    Root --> Common["_common.tsx"]

    Onboarding --> OIndex["/ (index)\nLanding / wallet connect"]
    Onboarding --> OConnect["/connect\nDiscord connect + verify"]

    App --> Dashboard["/dashboard"]
    App --> Pool["/pool\nAll pools list"]
    App --> MyPool["/pool/my-pool\nUser's active pool"]
    App --> Rules["/rules"]
    App --> Notification["/notification"]
```

---

## Authentication & State Flow

```mermaid
stateDiagram-v2
    [*] --> Disconnected

    Disconnected --> WalletConnected : Connect wallet\n(RazorKit)
    WalletConnected --> DiscordLinked : Link Discord (OAuth)
    DiscordLinked --> Verified : Sign & bind wallet\nPOST /auth/verify
    Verified --> LoggedIn : POST /auth/wallet-login\n→ JWT issued

    LoggedIn --> TokenExpired : 1h access token expiry
    TokenExpired --> LoggedIn : POST /auth/refresh\n(7d refresh token)
    TokenExpired --> Disconnected : Refresh token expired

    LoggedIn --> Disconnected : Logout / disconnect
```

---

## Data Flow: Holding & Claiming Rewards

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Backend API
    participant Chain as Movement Chain
    FE->>API: GET /staking/pools (JWT)
    API-->>FE: Pool list (canJoin, isJoined flags)
    FE-->>U: Show pools with NFT requirements
    U->>FE: Click "Join Pool"
    FE->>API: POST /staking/pools/join { poolId }
    API->>Chain: Verify NFT ownership via indexer (no transfer)
    Chain-->>API: NFT count confirmed — NFTs stay in wallet
    API-->>FE: { id, poolId, startedAt, isActive }
    FE-->>U: Registered! Redirect to /pool/my-pool

    loop Each week milestone
        U->>FE: Check /pool/my-pool
        FE->>API: GET /staking/rewards/available
        API->>Chain: Re-verify NFTs still held in wallet
        Chain-->>API: NFT count confirmed
        API-->>FE: { weekHeld, rewards[] with canClaim }
        FE-->>U: Show claimable milestone rewards
        U->>FE: Claim rewards
        FE->>API: POST /staking/rewards/claim { poolId }
        API-->>FE: { claimed[], totalClaimed }
    end
```

---

## Token Storage Strategy

| Token | Storage | Expiry |
|---|---|---|
| `accessToken` | `sessionStorage` | 1 hour |
| `refreshToken` | `localStorage` | 7 days |
| `arkai-wallet-login` | `localStorage` | Persisted |
| `arkai_token_redirect` | `localStorage` | OAuth flow |

- `sessionStorage` for access token — cleared on tab close, prevents XSS leakage across sessions
- `localStorage` for refresh token — persists across sessions for auto-login
