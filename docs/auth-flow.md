# Authentication Flow

> Deep-dive into how users connect their wallet and Discord account to access the Arkai NFT holding program.

---

## Overview

Arkai uses a **two-step authentication**:

1. **Wallet Login** — for users who already have wallet + Discord linked (returning users)
2. **Wallet Verify** — for first-time users linking wallet to Discord

Both flows produce a JWT `accessToken` (1h) and `refreshToken` (7d).

---

## Full Auth Sequence (New User)

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend
    participant RazorKit as RazorKit Wallet
    participant Discord as Discord OAuth
    participant API as Arkai Backend API

    Note over User,API: Step 1 — Connect Wallet

    User->>UI: Click "Connect Wallet"
    UI->>RazorKit: Connect (RazorKit modal)
    RazorKit-->>UI: { address, publicKey, connected }
    UI-->>User: Wallet connected ✓

    Note over User,API: Step 2 — Connect Discord

    User->>UI: Click "Connect Discord"
    UI->>API: Redirect to GET /auth/login
    API-->>Discord: Redirect to Discord OAuth
    Discord-->>User: Discord login prompt
    User->>Discord: Authorize Arkai app
    Discord-->>API: GET /auth/callback?code=xxx
    API-->>UI: Redirect to /connect?token=<discord_bearer>
    UI->>UI: Save token to localStorage\n(arkai_token_redirect)

    UI->>Discord: GET discord.com/api/users/@me\n(Bearer discord_token)
    Discord-->>UI: { id, username, global_name }
    UI-->>User: Discord connected ✓

    Note over User,API: Step 3 — Sign & Bind (First-time link)

    User->>UI: Click "Verify & Continue"
    UI->>RazorKit: signMessage("Verify wallet for Discord ID: xxx at timestamp")
    RazorKit-->>User: Wallet sign prompt
    User->>RazorKit: Approve
    RazorKit-->>UI: { signature, fullMessage, status: "Approved" }

    UI->>API: POST /auth/verify\n{ discordId, walletAddress, walletPublicKey,\n  signature, message, nonce }
    API->>API: Verify Ed25519 signature
    API->>API: Fetch NFTs from indexer
    API->>Discord: Assign Discord role based on NFT tier
    API-->>UI: { accessToken, refreshToken, nftCount, roleTier, ... }

    UI->>UI: Save to localStorage (arkai-wallet-login)\nSave tokens to sessionStorage/localStorage
    UI-->>User: Enter dashboard ✓
```

---

## Returning User Login

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend
    participant RazorKit as RazorKit Wallet
    participant API as Arkai Backend API

    User->>UI: Click "Connect Wallet"
    UI->>RazorKit: Connect
    RazorKit-->>UI: { address, publicKey }

    User->>UI: Click "Login with Wallet"
    UI->>UI: message = "Login with wallet at <timestamp>"
    UI->>RazorKit: signMessage(message)
    User->>RazorKit: Approve
    RazorKit-->>UI: { signature, fullMessage }

    UI->>API: POST /auth/wallet-login\n{ walletAddress, walletPublicKey, signature, message }
    API->>API: Verify signature\nLookup user by wallet

    alt Wallet linked to Discord
        API-->>UI: { linked: true, accessToken, refreshToken, nftCount, ... }
        UI->>UI: Save tokens + user data
        UI-->>User: Enter dashboard ✓
    else Wallet not linked
        API-->>UI: { linked: false }
        UI-->>User: "Please link Discord first"
    end
```

---

## Token Refresh Flow

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant API as Arkai Backend API

    UI->>API: Any protected request (GET /staking/pools)
    API-->>UI: 401 Unauthorized (access token expired)

    UI->>UI: useTokenManager.AuthenticationErrorHandler
    UI->>API: POST /auth/refresh\n{ refreshToken }

    alt Refresh token valid
        API-->>UI: { accessToken, refreshToken }
        UI->>UI: Update sessionStorage (access)\nUpdate localStorage (refresh)
        UI->>API: Retry original request
        API-->>UI: 200 OK
    else Refresh token expired
        API-->>UI: 401 Unauthorized
        UI->>UI: clearToken()\nnavigate to /
    end
```

---

## Local Storage Keys

| Key | Storage | Value | Purpose |
|---|---|---|---|
| `arkai-wallet-login` | `localStorage` | `WalletLoginResponse` | Cached user data (address, discord, tier) |
| `arkai_token_manager_refresh_token` | `localStorage` | JWT refresh token | Auto-login across sessions |
| `arkai_token_manager_access_token` | `sessionStorage` | JWT access token | Per-session auth header |
| `arkai_token_redirect` | `localStorage` | Discord bearer token | Temporary, used during OAuth callback |

---

## Hook Responsibilities

| Hook | File | Responsibility |
|---|---|---|
| `useLoginWithWallet` | `authentication/useLoginWithWallet.tsx` | Wallet sign → POST /auth/wallet-login → store JWT |
| `useConnectDiscord` | `authentication/useConnectDiscord.tsx` | Discord OAuth redirect → fetch Discord user via `@me` |
| `useSignAndBindDiscord` | `authentication/useSignAndBindDiscord.tsx` | Sign + bind Discord to wallet → POST /auth/verify |
| `useTokenManager` | `authentication/useTokenManager.tsx` | Token CRUD, auto-refresh, auth header builder |

---

## Route Guards

- `_app.tsx` — wraps all `/dashboard`, `/pool`, etc. routes. Redirects to `/` if no valid session.
- `_onboarding.tsx` — landing and connect flow. Accessible without auth.

---

## Security Notes

- **Replay attack prevention**: login messages include `Date.now()` timestamp
- **Ed25519 signatures**: wallet public key verified server-side against signature
- **Refresh token rotation**: old refresh token revoked on each refresh
- **Access token in sessionStorage**: cleared on tab close, not accessible cross-origin
