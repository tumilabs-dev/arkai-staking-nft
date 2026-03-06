import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/animate-ui/components/radix/accordion";
import SpiralPadPattern from "@/components/ui/SpiralPadPattern";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/rules/")({
  component: RouteComponent,
});

const RULES = [
  {
    id: "holding",
    title: "Holding Arkai NFTs",
    content: `To participate in any staking pool, you must hold at least one Arkai NFT in your connected wallet at all times. Your NFT must remain in the wallet for the entire duration of your staking period — removing or transferring it will immediately disqualify you from ongoing rewards and may result in forfeiture of unclaimed tokens. The longer you hold, the more weeks you accumulate, which directly increases your reward tier. Holding multiple NFTs may qualify you for exclusive high-tier pools with greater reward multipliers.`,
  },
  {
    id: "switch-pool",
    title: "Switch Pool",
    content: `You may switch between available staking pools at any time, provided you meet the NFT count requirement for the target pool. Switching pools resets your weekly hold counter for that pool — your accumulated weeks in the previous pool are not carried over. Any unclaimed rewards from your current pool must be claimed before switching; unclaimed rewards are not automatically transferred. Pool switches take effect at the start of the next reward cycle. Frequent switching is allowed but not recommended, as consistent holding in a single pool maximises your reward multiplier.`,
  },
  {
    id: "reward-method",
    title: "Reward Method",
    content: `Rewards are distributed weekly based on the number of weeks you have continuously held your NFT inside an active pool. Each pool defines its own reward schedule — token amounts, NFT drops, or access perks — which are listed on the Pool Overview page. Rewards accumulate automatically and can be claimed at any time from the Dashboard. Unclaimed rewards do not expire but must be claimed before leaving or switching a pool. Token rewards are sent directly to your connected wallet address upon claiming. Special event rewards (limited drops, bonus tokens) are distributed at the discretion of the Arkai team and announced via Discord.`,
  },
];

function RouteComponent() {
  return (
    <div className="bg-background min-h-[calc(100vh-10rem)]">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center py-8 text-muted-foreground">
          Rules
        </h1>

        <div className="w-full">
          <SpiralPadPattern />

          <div className="bg-white px-8 py-2">
            <Accordion type="single" collapsible defaultValue="holding">
              {RULES.map((rule) => (
                <AccordionItem key={rule.id} value={rule.id}>
                  <AccordionTrigger className="text-base font-semibold">
                    {rule.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {rule.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <SpiralPadPattern />
        </div>
      </div>
    </div>
  );
}
