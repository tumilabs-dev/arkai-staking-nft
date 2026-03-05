# Contributing Guide

Thank you for contributing to the Arkai NFT Staking Platform. This guide covers setting up a local development environment, project conventions, and the process for submitting changes. ("Staking" is the product name — no on-chain locking occurs; users hold NFTs in their wallets to earn milestone rewards.)

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | v18+ | [nodejs.org](https://nodejs.org) |
| pnpm | v10.20.0+ | `npm i -g pnpm` |
| Git | any | [git-scm.com](https://git-scm.com) |

---

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd arkai-nft-stacking
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file at the project root:

```env
VITE_MAINNET_RPC=<movement-rpc-url>
VITE_MAINNET_CHAINID=<chain-id>
VITE_MAINNET_INDEXER=<indexer-url>
VITE_API_URL=https://api-arkai.tumilabs.dev
VITE_ASSETS_BASE_URL=<assets-cdn-url>
VITE_NFT_COLLECTION_ADDRESS=<nft-collection-address>
```

See [deployment.md](./deployment.md) for a full description of each variable.

### 4. Start the development server

```bash
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server on port 3000 with HMR |
| `pnpm build` | Compile TypeScript + bundle for production |
| `pnpm serve` | Preview the production build locally |
| `pnpm test` | Run the Vitest test suite (single run) |

---

## Project Structure

```
src/
├── assets/           # Static images and media
├── components/       # Reusable React components
│   ├── animate-ui/  # Animation wrappers
│   ├── icons/       # SVG icon components
│   ├── layouts/     # Header, Footer, shell layouts
│   ├── playground/  # Game-UI canvas components (Pixi.js)
│   ├── ui/          # Primitive UI components (Button, Dialog, etc.)
│   └── web3/        # Wallet & blockchain components
├── constants/       # App-wide config, role maps, static data
├── hooks/           # Custom React hooks
│   ├── authentication/  # Auth hooks (login, token refresh, Discord)
│   └── nfts/            # NFT fetching and staking hooks
├── integrations/    # Third-party client setup
│   ├── axios/       # Axios instance + endpoint constants
│   └── tanstack-query/  # React Query client config
├── lib/             # Shared utility functions
├── routes/          # TanStack Router file-based routes
│   ├── _app/        # Authenticated app routes
│   ├── _common/     # Public / shared routes
│   └── _onboarding/ # Onboarding & wallet connect flow
└── styles.css       # Global Tailwind CSS styles
```

---

## Routing

This project uses **TanStack Router** with file-based routing. Routes are defined as files under `src/routes/`. The router plugin auto-generates `src/routeTree.gen.ts` during `pnpm dev` or `pnpm build`.

**Do not edit `routeTree.gen.ts` manually.** Add or rename route files and let the plugin regenerate it.

### Route conventions

| Prefix | Purpose |
|---|---|
| `_app/` | Authenticated routes (guarded by auth check) |
| `_onboarding/` | Wallet connect + Discord link flow |
| `_common/` | Shared routes accessible at any auth state |
| `$param` | Dynamic route segment |
| `index.tsx` | Default route for a directory |

---

## Code Conventions

### TypeScript

- Strict mode is enabled. Do not use `any`, `@ts-ignore`, or `@ts-expect-error`.
- Prefer explicit return types on exported functions.
- Use `unknown` for truly unknown shapes and narrow with type guards.

### Component structure

```tsx
// 1. Imports
import { useState } from 'react'
import { cn } from '@/lib/utils'

// 2. Types
interface MyComponentProps {
  label: string
  onClick?: () => void
}

// 3. Component
export function MyComponent({ label, onClick }: MyComponentProps) {
  return (
    <button onClick={onClick} className={cn('btn')}>
      {label}
    </button>
  )
}
```

### Styling

- Use **Tailwind CSS** utility classes.
- Use `cn()` from `src/lib/utils.ts` to conditionally join class names.
- Custom game-themed variants belong in `src/components/ui/InkButton.tsx` — do not duplicate elsewhere.

### State management

- **Server state** (API data): TanStack Query (`useQuery`, `useMutation`)
- **Client/UI state**: TanStack Store or `useState` for local component state
- **Wallet state**: managed by RazorKit — do not duplicate in custom stores

### HTTP requests

- All API calls go through the Axios instance in `src/integrations/axios/`.
- Endpoint paths are defined as constants in `src/integrations/axios/endpoint.ts` — add new paths there.
- Never hardcode URLs in components or hooks.

---

## Testing

Tests are written with **Vitest** and **Testing Library**.

```bash
# Run all tests once
pnpm test
```

- Place test files adjacent to the source file: `MyComponent.test.tsx`
- Test file naming: `*.test.ts` or `*.test.tsx`
- Mock external dependencies (axios, wallet adapter) — do not make real network calls in tests

---

## Branch & Commit Conventions

### Branches

```
feat/<short-description>     # New feature
fix/<short-description>      # Bug fix
chore/<short-description>    # Tooling, dependency updates, config changes
docs/<short-description>     # Documentation only
refactor/<short-description> # Refactoring without behaviour change
```

Examples: `feat/stake-pool-ui`, `fix/token-refresh-race`, `docs/api-reference`

### Commit messages

Follow the **Conventional Commits** format:

```
<type>(<scope>): <short summary>

[optional body]
```

| Type | Use for |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Build, tooling, deps |
| `docs` | Documentation |
| `refactor` | Code restructure, no behaviour change |
| `test` | Adding or fixing tests |
| `style` | Formatting only |

Example: `feat(auth): add Discord role verification on wallet login`

---

## Pull Request Process

1. **Branch off `main`** (or the current development branch)
2. **Make your changes** — keep PRs focused on a single concern
3. **Run the test suite** and ensure it passes: `pnpm test`
4. **Build the project** to catch TypeScript and bundler errors: `pnpm build`
5. **Open a PR** with:
   - A clear title following commit conventions
   - Description of what changed and why
   - Screenshots or recordings for UI changes
6. **Address review comments** — resolve all threads before merging
7. **Do not squash commits** unless specifically asked by the reviewer

---

## Common Pitfalls

- **`routeTree.gen.ts` conflicts**: If you see merge conflicts in this file, accept the incoming change and run `pnpm dev` to regenerate it cleanly.
- **Env vars not picked up**: Variables added to `.env` require a server restart (`pnpm dev`). Variables added to a deployment platform require a redeploy.
- **Wallet adapter errors in tests**: Mock `@razorlabs/razorkit` at the test level — the adapter requires a browser environment.
- **Pixi.js in tests**: Components using `@pixi/react` must be tested in a jsdom environment with WebGL mocked.

---

## Getting Help

- Open a GitHub issue for bugs or feature requests
- Reach out in the project Discord for questions
- Tag a maintainer in your PR if it's been open for more than 2 business days without a review
