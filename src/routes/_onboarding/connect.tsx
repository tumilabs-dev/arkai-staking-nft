import { createFileRoute, useNavigate } from "@tanstack/react-router";
import SplashInkTitle from "@/assets/objects/splash-ink.png";
import Banner from "@/assets/onboarding/banner.png";
import HighlightedNFT from "@/assets/onboarding/highlight-object.png";
import ActionBg from "@/assets/onboarding/action-bg.png";
import ConnectBg from "@/assets/onboarding/connect-bg.png";
import StartImg from "@/assets/onboarding/star.png";
import InkButton from "@/components/ui/InkButton";
import { DiscordIcon } from "@/components/icons/discord.icon";
import { useState } from "react";
import StampOverlay from "@/assets/onboarding/stamp-border.png";
import ScrollBg from "@/assets/onboarding/scroll.png";
import Logo from "@/assets/brand/brand-white.png";
import { ArrowIcon } from "@/components/icons/arrow.icon";

export const Route = createFileRoute("/_onboarding/connect")({
  component: RouteComponent,
});

const demoRoles = new Array(10).fill(0).map((_, index) => ({
  id: index,
  name: `Mariner Fleet Captain`,
}));

const demoNFTs = 20;

function RouteComponent() {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col justify-evenly pt-10 py-8 ">
      {/* Splash ink title */}
      <div className="relative w-fit mx-auto ">
        <img
          src={SplashInkTitle}
          alt="Slash Ink Title"
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-[45%] min-w-[140%] h-[120%] -z-10"
        />
        <span className="text-white text-4xl font-medium">
          Unlock Your Arkai Journey
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center">
        <div className=" flex flex-col justify-center w-full px-2">
          {/* Display Stats */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 p-2 gap-2 items-center bg-white">
            <div className="col-span-2 relative">
              <img src={Banner} alt="Banner" className="w-full object-cover" />
              {isConnected && (
                <div className="bg-primary-900/80 absolute top-0 left-0 w-full h-full px-[15%] py-[12%]">
                  <img
                    src={StampOverlay}
                    alt="Stamp Overlay"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[98%] h-[98%] object-contain"
                  />
                  {/* Roles */}
                  <div className="w-full h-[75%] overflow-y-scroll relative">
                    <div className="grid grid-cols-3 gap-4">
                      {demoRoles.map((role) => (
                        <div className="col-span-1 relative" key={role.id}>
                          <img
                            src={ScrollBg}
                            alt="Scroll BG"
                            className="w-full h-full object-contain "
                          />
                          <span className="text-accent-foreground text-sm font-medium absolute left-1/2 -translate-x-1/2 top-1/3 -translate-y-1/3 max-w-full w-[80%] text-center">
                            {role.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="@container h-[25%] text-center flex flex-col items-center justify-end w-2/3 mx-auto">
                    <span className="text-sm @sm:text-2xl text-white font-medium">
                      Your Detected Roles
                    </span>
                    <span className="text-xs @sm:text-sm text-white">
                      Pro Tip: Unlock more staking pools and rewards by
                      collecting unique Arkai roles!
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-span-1 h-full bg-primary-200 flex items-center justify-center relative">
              <img
                src={HighlightedNFT}
                alt="Highlighted NFT"
                className="aspect-square object-cover"
              />
              {isConnected && (
                <div className="bg-primary-700/80 absolute top-0 left-0 w-full h-full px-[15%] py-[12%]">
                  <img
                    src={StampOverlay}
                    alt="Stamp Overlay"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[98%] h-[98%] "
                  />
                  {/* Roles */}

                  <div className="h-full text-center flex flex-col items-center justify-center w-full mx-auto">
                    <span className="text-9xl text-white font-medium">
                      {demoNFTs}
                    </span>
                    <img
                      src={Logo}
                      className="size-[64px] object-contain -mt-6"
                    />
                    <span className="text-xl text-white mt-6">
                      Your Detected NFTs
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-span-1 h-full relative">
              <img
                src={ActionBg}
                alt="Action BG"
                className="w-full h-full object-cover"
              />
              {isConnected && (
                <div className=" absolute top-0 left-0 w-full h-full flex items-end justify-center px-[15%] py-[12%]">
                  <InkButton
                    className="text-white drop-shadow-2xl"
                    fillColor="#b8cbbd"
                    onClick={() => navigate({ to: "/pool" })}
                  >
                    <span className="flex items-center gap-2">
                      Continue to Pools
                      <ArrowIcon />
                    </span>
                  </InkButton>
                </div>
              )}
            </div>
          </div>
          {/* Display Stats */}
          <div className="w-full mt-1 relative py-6 px-8 flex flex-col items-center justify-center">
            <img
              src={ConnectBg}
              alt="Connect BG"
              className="absolute top-0 left-0 w-full h-full  -z-10"
            />
            <div className="flex gap-4 items-center">
              <img
                src={StartImg}
                alt="Start Img"
                className="h-8 object-cover"
              />
              <span className="text-white font-medium">
                Connect your Discord to access exclusive staking pools and claim
                your rewards.
              </span>
            </div>
            <InkButton
              className="mt-4 py-2 font-medium text-primary-500 hover:px-3 transition-all duration-300"
              onClick={() => setIsConnected((p) => !p)}
            >
              <span className="flex items-center gap-2">
                Connect Discord
                <DiscordIcon className="size-4 object-cover" />
              </span>
            </InkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
