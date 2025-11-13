import {
  useLoginWithWallet,
  WalletLoginResponse,
} from "@/hooks/authentication/useLoginWithWallet";
import { addressCompress } from "@/lib/addressCompress";
import { cn } from "@/lib/utils";
import { ConnectModal, useWallet } from "@razorlabs/razorkit";
import { useEffect, useState } from "react";
import InkButton from "../ui/InkButton";
import { useLocalStorage } from "@uidotdev/usehooks";

interface WalletConnectButtonProps {
  classNames?: {
    wrapper?: string;
    button?: string;
    icon?: string;
  };
  buttonText?: string;
}

export const WalletConnectButton = ({
  classNames,
  buttonText = "Wallet Connect",
}: WalletConnectButtonProps) => {
  const { connected, disconnect, address } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: loginWithWallet, data, reset } = useLoginWithWallet();

  const [_, setLoginData] = useLocalStorage<WalletLoginResponse | null>(
    "arkai-wallet-login",
    null
  );

  useEffect(() => {
    if (connected && address && !data) {
      loginWithWallet();
    }
  }, [connected, address, data]);

  return (
    <>
      <div className={cn("relative flex gap-2", classNames?.wrapper)}>
        <InkButton
          className={cn(
            "py-2 font-medium text-primary-500 hover:px-3 transition-all duration-300",
            classNames?.button
          )}
          onClick={() => !connected && setIsOpen((p) => !p)}
        >
          <span className="flex items-center gap-2">
            {connected && address ? addressCompress(address) : buttonText}
          </span>
        </InkButton>
        {connected && (
          <InkButton
            variant="icon"
            className={cn(
              "text-white hover:text-primary-200 transition-colors duration-300",
              classNames?.icon
            )}
            fillColor="#cca289"
            onClick={() => {
              disconnect();
              setLoginData(null);
            }}
          >
            <div className="text-lg mt-0.5 ml-0.25">X</div>
          </InkButton>
        )}
      </div>
      <ConnectModal
        open={isOpen}
        onOpenChange={setIsOpen}
        onConnectSuccess={async () => {
          setIsOpen(false);
          reset();
        }}
      />
      ,
    </>
  );
};
