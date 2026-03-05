# API Reference

> Base URL: `https://api-arkai.tumilabs.dev`
> Version: 1.0
> Auth: Bearer JWT (`Authorization: Bearer <accessToken>`)

---

## Authentication

All protected endpoints require `Authorization: Bearer <accessToken>` header.
Access tokens expire in **1 hour**. Use `POST /auth/refresh` to renew.

---

## Health

### `GET /health`

Health check. No auth required.

**Response `200`**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Auth Endpoints

### `POST /auth/wallet-login`

Sign in with a signed wallet message. Returns JWT tokens if wallet is already linked to Discord.

**Used by:** `useLoginWithWallet`

**Request Body**
```json
{
  "walletAddress": "0x1234...abcd",
  "walletPublicKey": "0xabcd...1234",
  "signature": "0x1234...abcd",
  "message": "Login with wallet at 1700000000000"
}
```

| Field | Type | Notes |
|---|---|---|
| `walletAddress` | `string` | `0x` + 64 hex chars |
| `walletPublicKey` | `string` | Ed25519 public key |
| `signature` | `string` | Ed25519 signature of `message` |
| `message` | `string` | Must include timestamp (replay protection) |

**Response `201` — Wallet linked**
```json
{
  "linked": true,
  "accessToken": "eyJhbGci...",
  "refreshToken": "a1b2c3...",
  "discordId": "123456789012345678",
  "discordUsername": "username#1234",
  "walletAddress": "0x1234...abcd",
  "nftCount": 5,
  "roleTier": 3,
  "lastSyncedAt": "2024-01-01T00:00:00.000Z"
}
```

**Response `201` — Wallet not linked**
```json
{
  "linked": false,
  "message": "Wallet is not linked to any Discord account"
}
```

**Errors**
- `400` — Invalid signature or validation error

---

### `POST /auth/verify`

Link a wallet to a Discord account. Signs a message containing the Discord ID. Returns JWT tokens on success.

**Used by:** `useSignAndBindDiscord`

**Request Body**
```json
{
  "discordId": "123456789012345678",
  "walletAddress": "0x1234...abcd",
  "walletPublicKey": "0xabcd...1234",
  "signature": "0x1234...abcd",
  "message": "Verify wallet for Discord ID: 123456789012345678 at 1700000000000",
  "nonce": "abc123xyz"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `discordId` | `string` | ✅ | 17–20 digit Discord user ID |
| `walletAddress` | `string` | ✅ | |
| `walletPublicKey` | `string` | ✅ | |
| `signature` | `string` | ✅ | |
| `message` | `string` | ✅ | Must include Discord ID |
| `nonce` | `string` | ❌ | Optional extra security |

**Response `200`**
```json
{
  "discordId": "123456789012345678",
  "discordUsername": "username#1234",
  "walletAddress": "0x1234...abcd",
  "nftCount": 5,
  "roleTier": 3,
  "roleId": "1234567890123456789",
  "tokens": [{ "tokenId": "1", "collectionId": "0x..." }],
  "accessToken": "eyJhbGci...",
  "refreshToken": "a1b2c3..."
}
```

**Errors**
- `400` — Invalid signature
- `409` — Wallet or Discord account already linked

---

### `GET /auth/login`

Redirects to Discord OAuth authorization page. Triggers the Discord connect flow.

**Used by:** `useConnectDiscord.loginDiscord()`

**Response `302`** — Redirects to `discord.com/api/oauth2/authorize`

---

### `GET /auth/callback`

Discord OAuth callback. Handles the OAuth code exchange and redirects back to frontend with `?token=<discord_access_token>`.

**Query Params**
| Param | Required | Description |
|---|---|---|
| `code` | ✅ | OAuth authorization code |
| `state` | ❌ | CSRF state |
| `error` | ❌ | OAuth error code |
| `error_description` | ❌ | Human-readable error |

**Response `302`** — Redirects to frontend `/connect?token=<token>` (or error)

---

### `POST /auth/refresh`

Exchange a refresh token for new tokens. Old refresh token is revoked.

**Used by:** `useTokenManager.refreshNewToken()`

**Request Body**
```json
{
  "refreshToken": "a1b2c3d4..."
}
```

**Response `200`**
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "new_refresh_token..."
}
```

**Errors**
- `401` — Invalid or expired refresh token (redirects to login)

---

## Pool & Reward Endpoints

All pool/reward endpoints require JWT auth. The `/staking` path prefix is the product name. No NFT locking occurs — ownership is verified by reading the wallet at registration and at each reward check.

### `GET /staking/pools`

Get all available pools with user eligibility flags. Eligibility is based on NFT count currently in the user's wallet.

**Used by:** `useGetPools`

**Response `200`**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Whispering Woods",
    "description": "...",
    "requiredNftCount": 3,
    "isActive": true,
    "canJoin": true,
    "isJoined": false
  }
]
```

| Field | Description |
|---|---|
| `canJoin` | User meets NFT holding requirement AND is not registered in another pool |
| `isJoined` | User is already registered in this pool |

**Errors**
- `401` — Missing/invalid JWT

---

### `GET /staking/pools/my-pool`

Get the pool the user is currently participating in.

**Used by:** `useGetCurrentPool`

**Response `200` — In a pool**
```json
{
  "id": "uuid",
  "poolId": "uuid",
  "startedAt": "2024-01-01T00:00:00.000Z",
  "lastCheckedAt": "2024-01-01T00:00:00.000Z",
  "isActive": true,
  "pool": { ... }
}
```

**Response `200` — Not in any pool**
```json
null
```

---

### `POST /staking/pools/join`

Register for a pool. The backend verifies NFT ownership via the Movement Indexer at registration time. **NFTs are not transferred or locked — they stay in the user's wallet.**

**Used by:** `useJoinPool`

**Request Body**
```json
{
  "poolId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response `200`**
```json
{
  "id": "uuid",
  "poolId": "uuid",
  "startedAt": "2024-01-01T00:00:00.000Z",
  "lastCheckedAt": "2024-01-01T00:00:00.000Z",
  "isActive": true
}
```

**Errors**
- `400` — User doesn't meet requirements or already in a pool
- `401` — Unauthorized

---

### `GET /staking/rewards/available`

Get rewards unlocked based on weeks the user has continuously held the required NFTs. The backend re-checks wallet NFT count before returning `canClaim`.

**Used by:** `useGetPoolRewards`

**Query Params**
| Param | Required | Description |
|---|---|---|
| `poolId` | ❌ | UUID — filter by pool |

**Response `200`**
```json
{
  "poolId": "uuid",
  "poolName": "Whispering Woods",
  "weekHeld": 3,
  "rewards": [
    {
      "id": "uuid",
      "poolId": "uuid",
      "weekNumber": 1,
      "rewardType": "TOKEN",
      "rewardValue": { "amount": 100 },
      "description": "Week 1 reward",
      "startedAt": "2024-01-01T00:00:00.000Z",
      "canClaim": true,
      "requiredWeeks": 1
    }
  ]
}
```

**Reward Types:** `TOKEN` | `NFT` | `ROLE` | `CUSTOM`

---

### `GET /staking/rewards/claimed`

Get all rewards the user has already claimed.

**Query Params**
| Param | Required | Description |
|---|---|---|
| `poolId` | ❌ | UUID — filter by pool |

**Response `200`**
```json
[
  {
    "poolId": "uuid",
    "poolName": "Whispering Woods",
    "weekNumber": 1,
    "reward": { ... },
    "claimedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### `GET /staking/rewards/status`

Comprehensive reward status: available + claimed + summary counts.

**Query Params**
| Param | Required | Description |
|---|---|---|
| `poolId` | ❌ | UUID — filter by pool |

**Response `200`**
```json
{
  "poolId": "uuid",
  "poolName": "Whispering Woods",
  "weekHeld": 3,
  "availableRewards": [...],
  "claimedRewards": [...],
  "summary": {
    "available": 2,
    "pending": 0,
    "processing": 0,
    "completed": 5,
    "failed": 0
  }
}
```

---

### `POST /staking/rewards/claim`

Claim all unlocked milestone rewards for a pool. User must still hold the required NFTs at time of claim.

**Used by:** `useClaimRewards`

**Request Body**
```json
{
  "poolId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response `200`**
```json
{
  "claimed": [
    {
      "id": "uuid",
      "userId": "user-id",
      "poolId": "uuid",
      "weekNumber": 1,
      "claimedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalClaimed": 1
}
```

**Errors**
- `401` — Unauthorized

---

## Error Response Format

```json
{
  "statusCode": 400,
  "message": "Invalid signature or validation error",
  "error": "Bad Request"
}
```

---

## Frontend Endpoint Map

```
src/integrations/axios/endpoint.ts

auth.walletLogin         → POST /auth/wallet-login
auth.verify              → POST /auth/verify
auth.discordLogin        → GET  /auth/login
auth.refreshToken        → POST /auth/refresh

staking.getStakingPools  → GET  /staking/pools
staking.getCurrentPool   → GET  /staking/pools/my-pool
staking.joinPool         → POST /staking/pools/join
staking.rewards.getAvailableRewards → GET /staking/rewards/available
staking.rewards.claimReward         → POST /staking/rewards/claim
```
