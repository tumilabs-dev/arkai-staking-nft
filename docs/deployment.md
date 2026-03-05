# Deployment Guide

This guide covers deploying the Arkai NFT Staking Platform to production using **Vercel** (recommended) or **Netlify**. ("Staking" is the product name — no on-chain locking occurs; users hold NFTs in their wallets.)

---

## Prerequisites

- Node.js v18+
- pnpm v10.20.0+
- A production backend API endpoint
- A Movement network RPC and Indexer URL
- The Arkai NFT collection contract address

---

## Environment Variables

Both platforms require the following environment variables to be configured in their respective dashboards:

| Variable | Description | Example |
|---|---|---|
| `VITE_MAINNET_RPC` | Movement network RPC endpoint | `https://mainnet.movementnetwork.xyz/v1` |
| `VITE_MAINNET_CHAINID` | Movement network chain ID | `126` |
| `VITE_MAINNET_INDEXER` | Movement network indexer URL | `https://indexer.mainnet.movementnetwork.xyz/v1/graphql` |
| `VITE_API_URL` | Backend API base URL | `https://api-arkai.tumilabs.dev` |
| `VITE_ASSETS_BASE_URL` | CDN base URL for static assets | `https://cdn.arkai.io` |
| `VITE_NFT_COLLECTION_ADDRESS` | Arkai NFT collection contract address | `0xabc...` |

> **Note**: All variables are prefixed with `VITE_` so Vite exposes them to the client bundle at build time. Never put server-side secrets here.

---

## Build

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build
```

Output is written to `dist/`. The build produces a static SPA — all routing is handled client-side by TanStack Router.

To preview the production build locally:

```bash
pnpm serve
```

---

## Vercel (Recommended)

### Why Vercel

The repo includes a `vercel.json` that handles SPA routing out of the box. No additional configuration needed beyond environment variables.

### Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your Git repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`
4. Add all environment variables under **Settings → Environment Variables**
5. Click **Deploy**

### SPA Routing (vercel.json)

The `vercel.json` at the project root rewrites all paths to `/index.html`, enabling client-side routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures deep links (e.g. `/app/staking`) work correctly after page reload.

---

## Netlify

### Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Build and deploy (draft)
netlify deploy --build

# Deploy to production
netlify deploy --build --prod
```

### Deploy via Netlify Dashboard

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
2. Connect your Git provider and select the repository
3. Configure build settings:
   - **Base directory**: *(leave blank)*
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
4. Add all environment variables under **Site Configuration → Environment Variables**
5. Click **Deploy site**

### SPA Routing (netlify.toml)

The `netlify.toml` at the project root configures Netlify's redirect rule for SPA routing:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Status `200` serves `/index.html` for all routes without issuing an HTTP redirect, preserving the URL in the browser.

---

## Post-Deployment Checklist

After deploying, verify the following:

- [ ] Home page loads correctly
- [ ] Wallet connect flow works (RazorKit)
- [ ] Discord OAuth redirect URL is updated to your production domain in the Discord Developer Portal
- [ ] API requests reach the backend (`VITE_API_URL` is correct)
- [ ] Deep links (e.g. `/app/staking`) load without 404 errors
- [ ] NFT assets load from `VITE_ASSETS_BASE_URL`
- [ ] Environment variables are set for the correct environment (preview vs. production)

---

## Environment-Specific Deployments

### Staging

Both Vercel and Netlify support preview deployments per branch. Use branch-specific environment variables to point staging deployments at a staging API:

- **Vercel**: Set env vars scoped to **Preview** environment only
- **Netlify**: Use **branch deploy contexts** in `netlify.toml`:

```toml
[context.staging]
  environment = { VITE_API_URL = "https://api-staging.tumilabs.dev" }
```

### Production

Always set environment variables scoped to the **Production** environment only to avoid accidentally exposing production credentials to preview builds.

---

## Troubleshooting

### Blank page after deploy

- Confirm `dist/index.html` exists in the build output
- Verify the **Publish directory** is set to `dist`
- Check browser console for missing env var errors

### 404 on page refresh

- Confirm the SPA rewrite/redirect rule is active (`vercel.json` or `netlify.toml`)
- For Netlify: ensure `status = 200` (not `301`/`302`)

### Environment variable not found

- All variables must be prefixed with `VITE_`
- Variables added after the last deploy require a **redeploy** to take effect
- Check that variables are set for the correct scope (Production / Preview / Branch)

### Discord OAuth redirect mismatch

- Update the **Redirect URI** in the [Discord Developer Portal](https://discord.com/developers/applications) to include your production domain
- Format: `https://your-domain.com/auth/discord/callback`
