import BrandLogoFill from "@/assets/brand/brand-filled.png";
import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="sticky bottom-0 bg-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Brand  */}
        <div className="flex items-center gap-4">
          <img
            src={BrandLogoFill}
            alt="Logo"
            className="size-[64px] object-contain"
          />
          {/* Copyright */}
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Arkai NFT Staking. All rights
            reserved.
          </p>
        </div>
        {/* Navigation */}
        <div className="flex items-center text-sm gap-4">
          <Link to="/policy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/support">Support</Link>
        </div>
      </div>
    </footer>
  );
}
