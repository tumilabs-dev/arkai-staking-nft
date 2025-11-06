import { createFileRoute } from "@tanstack/react-router";
import BrandLogoWhite from "@/assets/brand/brand-white.png";
import { ArrowIcon } from "@/components/icons/arrow.icon";
import InkButton from "@/components/ui/InkButton";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/_onboarding/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  return (
    <div className="mx-auto container z-10 h-full flex flex-col justify-between py-4">
      {/* Temp Navigation */}
      <div className="flex items-center justify-between">
        {/* Branding */}
        <div className="flex items-center gap-6 hover:gap-4 transition-all duration-300">
          <img
            src={BrandLogoWhite}
            alt="Logo"
            className="size-[64px] object-contain"
          />
          <span className="text-lg uppercase font-medium text-white">
            Arkai NFT Stacking
          </span>
        </div>
        {/* Navigation */}
        <div className="flex items-center gap-2 cursor-pointer hover:gap-1 transition-all duration-300">
          <span className="text-white">Stacking Rules</span>
          <ArrowIcon className="text-white mb-1.5" />
        </div>
      </div>

      {/* Contents */}
      <div className="flex-1 flex items-center justify-center grow">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-medium text-white max-w-full w-[500px] text-center">
            Stake Your arkai NFTs Get <br /> Access, Win Rewards
          </h1>
          <p className="text-white  max-w-full w-[600px] text-center mt-4">
            Welcome to the arkai staking dapp. Connect your wallet to start your
            journey and unlock pools and NFT rewards
          </p>
          <InkButton
            variant="outlined"
            className="mt-8 py-2 font-medium text-white hover:px-3 transition-all duration-300"
            onClick={() => router.navigate({ to: "/connect" })}
          >
            Getting Start!!!
          </InkButton>
        </div>
      </div>

      {/* Temp footer */}
      <div />
    </div>
  );
}
