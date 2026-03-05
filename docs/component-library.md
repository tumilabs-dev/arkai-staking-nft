# Component Library

> Catalog of reusable components in `src/components/`.

---

## UI Primitives (`src/components/ui/`)

### `Button`

Standard button built with **CVA** + **Radix Slot**. Supports `asChild` pattern.

```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="default">Click me</Button>
<Button variant="outline" size="sm">Small</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
<Button asChild><a href="/path">Link Button</a></Button>
```

**Variants**
| Variant | Description |
|---|---|
| `default` | Primary filled button |
| `destructive` | Red destructive action |
| `outline` | Bordered, transparent bg |
| `secondary` | Secondary color bg |
| `ghost` | No background, hover only |
| `link` | Underlined text |

**Sizes**
| Size | Height | Notes |
|---|---|---|
| `default` | `h-9` | Standard |
| `sm` | `h-8` | Compact |
| `lg` | `h-10` | Large |
| `icon` | `size-9` | Square icon button |
| `icon-sm` | `size-8` | Small icon |
| `icon-lg` | `size-10` | Large icon |

**Props:** All native `<button>` props + `variant?` + `size?` + `asChild?: boolean`

---

### `InkButton`

Custom game-themed button with **hand-drawn SVG background**. Designed to match the Arkai fantasy aesthetic.

```tsx
import InkButton from "@/components/ui/InkButton"

<InkButton>Join Pool</InkButton>
<InkButton variant="icon" fillColor="#E49C85"><Icon /></InkButton>
<InkButton variant="outlined">View Rules</InkButton>
<InkButton variant="icon-outlined"><Icon /></InkButton>
```

**Variants**
| Variant | Shape | Default Fill | Use Case |
|---|---|---|---|
| `default` | Horizontal blob | `#F5E0CD` | Primary action buttons |
| `icon` | Square blob | `#E49C85` | Icon-only actions |
| `outlined` | Top + bottom ink line | `white` | Secondary / text buttons |
| `icon-outlined` | Oval hover ring | custom | Icon with hover effect |

**Props**
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Button content |
| `variant` | `"default" \| "icon" \| "outlined" \| "icon-outlined"` | `"default"` | Visual style |
| `fillColor` | `string` | variant-dependent | SVG fill color |
| `className` | `string` | `""` | Additional CSS classes |
| + all native `<button>` props | | | |

---

### `Dialog`

Radix UI Dialog wrapper. Used for modals across the app.

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>
```

---

### `DropdownMenu`

Radix UI Dropdown. Used in header navigation and pool actions.

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
```

---

### `Collapsible`

Radix UI Collapsible. Used for expandable sections (rules, FAQ).

```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
```

---

### `Loader`

Animated loading spinner. CSS module-based animation.

```tsx
import { Loader } from "@/components/ui/loader"

<Loader /> // Full-page or inline spinner
```

---

### `customToast`

Wrapper around `sonner` with branded styling.

```tsx
import { customToast } from "@/components/ui/customToast"

customToast("Reward claimed!", "success")
customToast("Something went wrong", "error")
```

---

### `SpiralPadPattern`

Decorative SVG background pattern. Used as page/section backgrounds.

```tsx
import { SpiralPadPattern } from "@/components/ui/SpiralPadPattern"

<SpiralPadPattern className="absolute inset-0 opacity-10" />
```

---

## Layout Components (`src/components/layouts/`)

### `Header`

Top navigation bar. Contains:
- Arkai logo / brand
- Wallet connect button (`WalletConnectButton`)
- Navigation links (Dashboard, Pool, Rules)
- Notification bell

```tsx
// Auto-included in _app layout, not used directly
```

---

### `Footer`

Bottom footer bar with links and branding.

---

### `Notification`

Notification panel/drawer. Displays holding events and milestone reward updates.

```tsx
// Rendered inside Header or as overlay
```

---

## Web3 Components (`src/components/web3/`)

### `WalletConnectButton`

Full wallet connect UX: shows RazorKit `ConnectModal` when disconnected, shows compressed address + disconnect button when connected. Auto-triggers `useLoginWithWallet` on connect.

```tsx
import { WalletConnectButton } from "@/components/web3/WalletConnectButton"

<WalletConnectButton
  buttonText="Connect Wallet"
  classNames={{
    wrapper: "gap-3",
    button: "text-white",
    icon: "text-primary-200"
  }}
/>
```

**Props**
| Prop | Type | Default | Description |
|---|---|---|---|
| `buttonText` | `string` | `"Wallet Connect"` | Text when disconnected |
| `classNames.wrapper` | `string` | — | Wrapper div classes |
| `classNames.button` | `string` | — | Main button classes |
| `classNames.icon` | `string` | — | Disconnect icon classes |

**Behavior:**
- Disconnected → shows `buttonText`, click opens RazorKit modal
- Connected → shows compressed address (e.g. `0x1234...abcd`), plus disconnect `X` button
- On connect → auto-calls `useLoginWithWallet` to exchange for JWT

---

## Animate UI Components (`src/components/animate-ui/`)

Animated wrappers over Radix UI primitives. Uses `motion` library.

| Component | Wraps | Location |
|---|---|---|
| `Accordion` | Radix Accordion | `radix/accordion.tsx` |
| `Popover` | Radix Popover | `radix/popover.tsx` |
| `AlertDialog` | Radix AlertDialog | `radix/alert-dialog.tsx` |
| `Button` | Custom | `buttons/button.tsx` |
| `Progress` | Base UI Progress | `base/progress.tsx` |
| `CountingNumber` | — (text) | `texts/counting-number.tsx` |
| `AnimateSlot` | Radix Slot | `animate/slot.tsx` |

---

## Icon Components (`src/components/icons/`)

All icons are SVG React components. Available icons:

| Component | Usage |
|---|---|
| `ArrowIcon` | Navigation arrows |
| `BellIcon` | Notification bell |
| `DiscordIcon` | Discord branding |
| `ForwardIcon` | Forward/next navigation |
| `SpiralPad` | Decorative spiral |
| `TimerIcon` | Holding milestone timer |
| `StarIcon` | Ratings / rewards |
| `ScrollIcon` | Rules / lore |
| `DiamondIcon` | Premium tier |
| `SwordIcon` | Combat / action |
| `ShieldIcon` | Defense / security |
| `RewardIcon` | Rewards |
| `UserIcon` | Profile / user |

```tsx
import { DiscordIcon } from "@/components/icons/discord.icon"

<DiscordIcon className="size-5" />
```

---

## Playground Components (`src/components/playground/`)

The interactive game layer powered by **Pixi.js** (WebGL).

### `PixiPlayground`

Main entry point for the game canvas. Renders the pool world map where users can visualize their holding progress.

```tsx
import { PixiPlayground } from "@/components/playground/PixiPlayground"

<PixiPlayground /> // Full-screen game canvas
```

**Internals:**
- `gameUI/GameUI.tsx` — HUD overlays (rewards panel, weeks-held counter)
- `parts/pool-1/` — Pool 1 island assets (`Island_01`, `Island_02`, `Island_03`, checkpoints)
- `parts/commons/` — `PixiSpriteWithTexture`, `PixiSpriteResolver`
- `store/reward.store.tsx` — Zustand store for game state
- `animations/` — GSAP timeline animations
- `constants/` — Game configuration constants
