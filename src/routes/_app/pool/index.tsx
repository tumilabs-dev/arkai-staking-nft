import { createFileRoute } from "@tanstack/react-router";
import SplashInkTitle from "@/assets/objects/splash-ink.png";
import Pool1 from "@/assets/pool/pool-1.png";
import Pool2 from "@/assets/pool/pool-2.png";
import Pool3 from "@/assets/pool/pool-3.png";
import Pool4 from "@/assets/pool/pool-4.png";
import Pool5 from "@/assets/pool/pool-5.png";
import SpiralPadPattern from "@/components/ui/SpiralPadPattern";
import { UserIcon } from "@/components/icons/user.icon";
import { RewardIcon } from "@/components/icons/reward.icon";
import InkButton from "@/components/ui/InkButton";

export const Route = createFileRoute("/_app/pool/")({
  component: RouteComponent,
});

const demoPools = [
  {
    id: 1,
    name: "Whispering Woods",
    description:
      "Stake Arkai Rangers to unlock enchanted rewards and exclusive forest missions.",
    requiredRole: "Ranger Guild Member",
    reward: "Exclusive Ranger NFT, Daily ARK Coins",
    image: Pool1,
  },
  {
    id: 2,
    name: "Crimson Caverns",
    description:
      "Only the bravest Arkai Knights can venture into the caverns for legendary treasures.",
    requiredRole: "Knight Order Initiate",
    reward: "Legendary Weapon NFT, Boosted ARK APR",
    image: Pool2,
  },
  {
    id: 3,
    name: "Golden Fields",
    description:
      "Ascend to the spires with Arkai Mages for cosmic rewards and arcane knowledge.",
    requiredRole: "Archmage Council",
    reward: "Rare Spellbook NFT, Access to Alpha Quests",
    image: Pool3,
  },
  {
    id: 4,
    name: "Sunken City",
    description:
      "Dive deep with Arkai Mariners to reclaim ancient relics from the lost city.",
    requiredRole: "Mariner Fleet Captain",
    reward: "Unique Ocean Relic NFT, Tidal Surge Bonuses",
    image: Pool4,
  },
  {
    id: 5,
    name: "Shadowfell Peaks",
    description:
      "Conquer the daunting peaks alongside Arkai Rogues to claim elusive shadow gems.",
    requiredRole: "Shadow Rogue Initiate",
    reward: "Legendary Weapon NFT, Boosted ARK APR",
    image: Pool5,
  },
];

function RouteComponent() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 relative py-6 space-y-6">
        {/* Title */}
        <div className="relative w-fit mx-auto z-10">
          <img
            src={SplashInkTitle}
            alt="Slash Ink Title"
            className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-[45%] min-w-[140%] h-[120%] -z-10"
          />
          <span className="text-white text-4xl font-medium">
            Arkai NFT Rewards Pools
          </span>
        </div>
        {/* Pools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoPools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PoolCard({ pool }: { pool: (typeof demoPools)[0] }) {
  return (
    <div className="relative">
      {/* Decord */}
      <SpiralPadPattern color="#A46A37" size={30} className="w-full mb-1" />
      {/* Image */}
      <img src={pool.image} alt={pool.name} />

      {/* Content */}
      <div className="bg-white w-full p-6 space-y-6">
        <h3 className="text-primary text-2xl font-medium text-center">
          {pool.name}
        </h3>
        <p className="text-muted-foreground text-sm text-center">
          {pool.description}
        </p>
        {/* Required Role */}
        <div className="flex items-center justify-between">
          <span className=" flex items-center gap-2">
            <UserIcon />
            Required Role:
          </span>
          <span className="text-muted-foreground max-w-[60%] text-right">
            {pool.requiredRole}
          </span>
        </div>

        {/* Reward */}
        <div className="flex items-start justify-between">
          <span className=" flex items-center gap-2">
            <RewardIcon />
            Reward:
          </span>
          <span className="text-muted-foreground max-w-[60%] text-right">
            {pool.reward}
          </span>
        </div>

        {/* Join pool */}

        <InkButton
          className="w-full text-white hover:text-primary-900 transition-all duration-300"
          fillColor="#afc1b1"
        >
          Join Pool
        </InkButton>
      </div>
      <SpiralPadPattern color="#A46A37" size={30} className="w-full mt-1" />
    </div>
  );
}
