# Arkai NFT Staking Platform

A decentralized application (dApp) for staking Arkai NFTs on the Movement (Aptos) network. Earn rewards based on your Discord role tier and unlock exclusive staking pools.

## 🌟 Features

- **NFT Staking**: Stake your Arkai NFTs to earn rewards
- **Discord Role Integration**: Rewards are determined by your Discord role tier
- **Tiered Rewards System**: 5 reward tiers based on NFT holdings (3, 6, 9, 12, 15 NFTs)
- **Multiple Staking Pools**: Access different pools with unique requirements and rewards
- **Wallet Integration**: Seamless connection with Movement/Aptos wallets via RazorKit
- **Real-time Tracking**: Monitor your staking progress and rewards
- **Interactive UI**: Beautiful, game-inspired interface built with Pixi.js and GSAP animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.20.0 or higher)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd arkai-nft-stacking
```

1. Install dependencies:

```bash
pnpm install
```

1. Set up environment variables: Create a `.env` file in the root directory with the following variables:

```env
VITE_MAINNET_RPC=your_movement_rpc_url
VITE_MAINNET_CHAINID=your_chain_id
VITE_MAINNET_INDEXER=your_indexer_url
VITE_API_URL=your_api_url
VITE_NFT_COLLECTION_ADDRESS=your_nft_collection_address
```

1. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📦 Building for Production

To build the application for production:

```bash
pnpm build
```

The production build will be generated in the `dist` directory.

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

## 🏗️ Tech Stack

- **Frontend Framework**: React 19
- **Routing**: TanStack Router (file-based routing)
- **State Management**: TanStack Store & React Query
- **Styling**: Tailwind CSS
- **Blockchain**: Movement (Aptos) via RazorKit
- **Animations**: GSAP & Motion
- **Graphics**: Pixi.js for interactive game elements
- **UI Components**: Radix UI, Base UI
- **Build Tool**: Vite
- **Type Safety**: TypeScript

## 📁 Project Structure

```
src/
├── assets/           # Images and static assets
├── components/       # Reusable React components
│   ├── animate-ui/  # Animation components
│   ├── icons/       # Icon components
│   ├── layouts/     # Layout components (Header, Footer)
│   ├── playground/  # Game UI components
│   ├── ui/          # UI primitives
│   └── web3/        # Web3-related components
├── constants/       # App configuration and constants
├── hooks/           # Custom React hooks
│   ├── authentication/  # Auth-related hooks
│   └── nfts/        # NFT-related hooks
├── integrations/    # Third-party integrations
│   ├── axios/       # HTTP client setup
│   └── tanstack-query/  # React Query setup
├── lib/             # Utility functions
├── routes/          # TanStack Router routes
│   ├── _app/        # Protected app routes
│   ├── _common/     # Common routes
│   └── _onboarding/ # Onboarding flow
└── styles.css       # Global styles
```

## 🎮 How It Works

### 1\. Connect Wallet & Discord

- Connect your Movement/Aptos wallet using RazorKit
- Link your Discord account to verify your role
- Sign a message to verify wallet ownership

### 2\. NFT Verification

- The system checks your wallet for Arkai NFTs
- Your NFT count determines your reward tier:
  - **Tier 1**: 3 NFTs
  - **Tier 2**: 6 NFTs
  - **Tier 3**: 9 NFTs
  - **Tier 4**: 12 NFTs
  - **Tier 5**: 15 NFTs

### 3\. Staking Pools

Access different staking pools based on your Discord role:

- **Whispering Woods**: For Ranger Guild Members
- **Crimson Caverns**: For Knight Order Initiates
- **Golden Fields**: For Archmage Council
- **Sunken City**: For Mariner Fleet Captains
- **Shadowfell Peaks**: For Shadow Rogue Initiates

### 4\. Earn Rewards

- Stake your NFTs to start earning rewards
- Rewards are calculated based on your tier and pool
- Track your progress through the dashboard

## 🔐 Authentication Flow

1. User connects wallet via RazorKit
2. User connects Discord account
3. System generates a nonce and message for signing
4. User signs the message with their wallet
5. Backend verifies signature and Discord role
6. User data is stored locally and synced with backend

## 🌐 Environment Variables

| Variable | Description |
| --- | --- |
| `VITE_MAINNET_RPC` | Movement network RPC endpoint |
| `VITE_MAINNET_CHAINID` | Movement network chain ID |
| `VITE_MAINNET_INDEXER` | Movement network indexer URL |
| `VITE_API_URL` | Backend API URL |
| `VITE_NFT_COLLECTION_ADDRESS` | Arkai NFT collection address |

## 📚 Key Dependencies

- `@razorlabs/razorkit` - Movement/Aptos wallet integration
- `@aptos-labs/ts-sdk` - Aptos SDK for blockchain interactions
- `@tanstack/react-router` - File-based routing
- `@tanstack/react-query` - Server state management
- `@tanstack/react-store` - Client state management
- `pixi.js` - 2D WebGL renderer for game graphics
- `gsap` - Animation library
- `axios` - HTTP client

## 🎨 Styling

This project uses Tailwind CSS for styling. The design system includes:

- Custom color palette (primary, secondary, accent)
- Responsive layouts
- Custom animations and transitions
- Game-inspired UI elements

## 🔄 Routing

This project uses TanStack Router with file-based routing. Routes are automatically generated from files in the `src/routes` directory:

- `_onboarding/` - Onboarding and connection flow
- `_app/` - Main application routes (protected)
- `_common/` - Common/shared routes

## 📝 Scripts

- `pnpm dev` - Start development server (port 3000)
- `pnpm build` - Build for production
- `pnpm serve` - Preview production build
- `pnpm test` - Run test suite

## 🔗 Links

- [Movement Network](https://movement.network)
- [Aptos Documentation](https://aptos.dev)
- [TanStack Router](https://tanstack.com/router)
- [RazorKit](https://razorlabs.com)

## 💬 Support

For support, join our Discord server or open an issue on GitHub.

---

Built with ❤️ for the Arkai community