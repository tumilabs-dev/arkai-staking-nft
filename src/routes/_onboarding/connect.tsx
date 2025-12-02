import Logo from "@/assets/brand/brand-white.png";
import SplashInkTitle from "@/assets/objects/splash-ink.png";
import ActionBg from "@/assets/onboarding/action-bg.png";
import Banner from "@/assets/onboarding/banner.png";
import ConnectBg from "@/assets/onboarding/connect-bg.png";
import HighlightedNFT from "@/assets/onboarding/highlight-object.png";
import ScrollBg from "@/assets/onboarding/scroll.png";
import StampOverlay from "@/assets/onboarding/stamp-border.png";
import StartImg from "@/assets/onboarding/star.png";
import { ArrowIcon } from "@/components/icons/arrow.icon";
import { DiscordIcon } from "@/components/icons/discord.icon";
import InkButton from "@/components/ui/InkButton";
import { WalletConnectButton } from "@/components/web3/WalletConnectButton";
import { getAvailableRoles, rolesMap } from "@/constants/rolesMap";
import { useConnectDiscord } from "@/hooks/authentication/useConnectDiscord";
import { useLoginWithWallet } from "@/hooks/authentication/useLoginWithWallet";
import { useSignAndBindDiscord } from "@/hooks/authentication/useSignAndBindDiscord";
import { useGetNFTBalance } from "@/hooks/nfts/useGetNFTBalance";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import { useWallet } from "@razorlabs/razorkit";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/animate-ui/components/radix/alert-dialog";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/_onboarding/connect")({
  component: RouteComponent,
  validateSearch: zodValidator(
    z.object({
      token: z.string().optional(),
    })
  ),
});

function RouteComponent() {
  // Connect Discord State

  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  // Connect wallet function
  const { connected } = useWallet();
  const { loginDiscord, discord, disconnectDiscord } = useConnectDiscord();
  // Check if wallet is connected and discord is linked
  const { storageData, isPending: isLoadingWallet } = useLoginWithWallet();
  const {
    signAndBindDiscord,
    data: bindingData,
    isPending: isLoadingBinding,
  } = useSignAndBindDiscord();

  // Handle GSAP animations for discord and wallet connection
  useGSAP(
    () => {
      const timeline = gsap.timeline();

      // If wallet is not linked and discord is not connected
      if (
        (!storageData?.linked && !discord) ||
        !connected ||
        isLoadingWallet ||
        isLoadingBinding
      ) {
        timeline.to(".waitingToLink", {
          opacity: 0,
          duration: 1,
          display: "none",
        });
        timeline.to(".linkedDiscord", {
          opacity: 0,
          duration: 1,
          display: "none",
        });

        return;
      }

      // If wallet is linked
      if (storageData?.linked) {
        timeline.to(".waitingToLink", {
          opacity: 0,
          duration: 1,
          display: "none",
        });
        timeline.to(".linkedDiscord", {
          opacity: 1,
          duration: 1,
          display: "block",
        });

        return;
      }

      // If wallet is not linked and discord is connected
      if (!storageData?.linked && discord) {
        timeline.to(".waitingToLink", {
          opacity: 1,
          duration: 1,
          display: "block",
        });
        timeline.to(".linkedDiscord", {
          opacity: 0,
          duration: 1,
          display: "none",
        });

        return;
      }
    },
    {
      scope: pageRef,
      dependencies: [
        discord,
        storageData,
        bindingData,
        isLoadingWallet,
        isLoadingBinding,
      ],
    }
  );

  // Render Discord Button if discord is connected
  const DiscordButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const onConfirm = () => {
      setIsOpen(false);
      disconnectDiscord();
    };

    const onCancel = () => {
      setIsOpen(false);
    };

    if (!discord && !storageData?.linked)
      return (
        <InkButton
          className="mt-4 py-2 font-medium text-primary-500 hover:px-3 transition-all duration-300"
          onClick={loginDiscord}
        >
          <span className="flex items-center gap-2">
            Connect Discord
            <DiscordIcon className="size-4 object-cover" />
          </span>
        </InkButton>
      );
    return (
      <div className="flex items-center gap-2">
        <InkButton className="mt-4 py-2 font-medium text-primary-500 hover:px-3 transition-all duration-300">
          <span className="flex items-center gap-2">
            Welcome @{storageData?.discordUsername || discord?.username}
            <DiscordIcon className="size-4 object-cover" />
          </span>
        </InkButton>
        {discord?.username && (
          <>
            <InkButton
              variant="icon"
              className={cn(
                "text-white hover:text-primary-200 transition-colors duration-300 mt-4"
              )}
              fillColor="#cca289"
              onClick={() => setIsOpen(true)}
            >
              <div className="text-lg mt-0.5 ml-0.25">X</div>
            </InkButton>
          </>
        )}
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Wanna disconnect?</AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="px-12">
              <InkButton
                fillColor="#A4C3AF"
                variant="icon"
                className="size-12"
                onClick={onConfirm}
              >
                <Check className="size-10 text-white" />
              </InkButton>

              <InkButton
                fillColor="#E49C85"
                variant="icon"
                className="size-12"
                onClick={onCancel}
              >
                <X className="size-10 text-white" />
              </InkButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  // Detected NFTs Balance
  const { data: balance, isLoading } = useGetNFTBalance();

  useGSAP(
    () => {
      const timeline = gsap.timeline();
      if (connected && !isLoading) {
        timeline.to(".detectedNFTs", { opacity: 1, duration: 1 });
      } else {
        timeline.to(".detectedNFTs", { opacity: 0, duration: 1 });
      }
    },
    {
      scope: pageRef,
      dependencies: [balance, connected],
    }
  );

  useGSAP(
    () => {
      const timeline = gsap.timeline();
      if (connected && !isLoading && storageData?.linked) {
        timeline.to(".allowToContinue", { opacity: 1, duration: 1 });
      } else {
        timeline.to(".allowToContinue", { opacity: 0, duration: 1 });
      }
    },
    {
      scope: pageRef,
      dependencies: [connected, isLoading, storageData?.linked],
    }
  );

  return (
    <div
      ref={pageRef}
      className="h-full flex flex-col justify-evenly pt-10 py-8 page-content"
    >
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

              <div className="linkedDiscord opacity-0 bg-primary-900/80 absolute top-0 left-0 w-full h-full px-[15%] py-[12%]">
                <img
                  src={StampOverlay}
                  alt="Stamp Overlay"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[98%] h-[98%] object-contain"
                />
                {/* Roles */}
                <div className="w-full h-[75%] overflow-y-scroll relative">
                  <div className="grid grid-cols-3 gap-4">
                    {balance &&
                      getAvailableRoles(balance).map((role) => (
                        <div className="col-span-1 relative" key={role}>
                          <img
                            src={ScrollBg}
                            alt="Scroll BG"
                            className="w-full h-full object-contain "
                          />
                          <span className="text-accent-foreground text-sm font-medium absolute left-1/2 -translate-x-1/2 top-1/3 -translate-y-1/3 max-w-full w-[80%] text-center">
                            {role}
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
                    Pro Tip: Unlock more staking pools and rewards by collecting
                    unique Arkai roles!
                  </span>
                </div>
              </div>
              <div className="waitingToLink opacity-0 bg-primary-900/80 absolute top-0 left-0 w-full h-full px-[15%] py-[12%]">
                <img
                  src={StampOverlay}
                  alt="Stamp Overlay"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[98%] h-[98%] object-contain"
                />
                {/* Link actions */}
                <div className="w-full h-full flex items-center justify-center">
                  <InkButton
                    className="text-white drop-shadow-2xl"
                    fillColor="#b8cbbd"
                    onClick={() => signAndBindDiscord()}
                  >
                    <span className="flex items-center gap-2">
                      Link Discord
                    </span>
                  </InkButton>
                </div>
              </div>
            </div>
            <div className="col-span-1 h-full bg-primary-200 flex items-center justify-center relative">
              <img
                src={HighlightedNFT}
                alt="Highlighted NFT"
                className="aspect-square object-cover"
              />

              <div className="detectedNFTs opacity-0 bg-primary-700/80 absolute top-0 left-0 w-full h-full px-[15%] py-[12%]">
                <img
                  src={StampOverlay}
                  alt="Stamp Overlay"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[98%] h-[98%] "
                />
                {/* Roles */}

                <div className="h-full text-center flex flex-col items-center justify-center w-full mx-auto">
                  <span className="text-9xl text-white font-medium">
                    {balance}
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
            </div>
            <div className="col-span-1 h-full relative">
              <img
                src={ActionBg}
                alt="Action BG"
                className="w-full h-full object-cover"
              />

              <div className="allowToContinue bg-primary-700/30 opacity-0 absolute top-0 left-0 w-full h-full flex items-end justify-center px-[15%] py-[12%]">
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
            <div className="flex gap-4 items-center">
              {connected ? <DiscordButton /> : null}
              <WalletConnectButton
                classNames={{
                  wrapper: "mt-4",
                  button:
                    "py-2 font-medium text-primary-500 hover:px-3 transition-all duration-300",
                  icon: "text-white hover:text-primary-200 transition-colors duration-300",
                }}
                buttonText="Connect Wallet"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
