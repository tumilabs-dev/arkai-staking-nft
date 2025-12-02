import BrandLogoFill from "@/assets/brand/brand-filled.png";
import { useLoginWithWallet } from "@/hooks/authentication/useLoginWithWallet";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import InkButton from "../ui/InkButton";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/animate-ui/components/radix/alert-dialog";
import { Check, X } from "lucide-react";
import { useState } from "react";

const NAVIGATION_ITEMS = [
  {
    label: "Pool Overview",
    href: "/pool",
    match: "pool",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    match: "dashboard",
  },
  {
    label: "Activity Log & Rules",
    href: "/log",
    match: "log",
  },
  {
    label: "Notifications",
    href: "/notification",
    match: "notification",
  },
];

export default function Header() {
  const location = useLocation().pathname.split("/");
  const { storageData, logout } = useLoginWithWallet();

  // Alert Dialog State
  const [isOpen, setIsOpen] = useState(false);

  // Alert Dialog Functions
  const onConfirm = () => {
    setIsOpen(false);
    logout();
  };
  const onCancel = () => {
    setIsOpen(false);
  };
  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white">
        <div className="container mx-auto p-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              {/* Brand Logo */}
              <img
                src={BrandLogoFill}
                alt="Logo"
                className="size-[52px] object-contain"
              />
              {/* Navigation */}
              <div className="flex items-center gap-4">
                {NAVIGATION_ITEMS.map((item) => {
                  const isActive = location.includes(item.match);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "text-sm font-medium text-gray-500 hover:text-gray-700 transition-all duration-300",
                        isActive && "text-primary-400 font-bold",
                        " py-2"
                      )}
                    >
                      <span className="">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex gap-2 items-center">
              <InkButton className="text-sm font-medium text-primary hover:text-primary-700 transition-colors duration-300">
                Wellcome @{storageData?.discordUsername}
              </InkButton>

              <InkButton
                variant="icon"
                className="text-white hover:text-primary-200 transition-colors duration-300"
                fillColor="#cca289"
                onClick={() => setIsOpen(true)}
              >
                <div className="text-lg mt-0.5 ml-0.25">X</div>
              </InkButton>

              <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="sm:max-w-[425px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Wanna logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Wanna leave Arkai?
                    </AlertDialogDescription>
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
          </div>
        </div>
      </header>
    </>
  );
}
