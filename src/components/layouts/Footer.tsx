import BrandLogoFill from "@/assets/brand/brand-filled.png";
import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="mx-auto flex items-center justify-between container w-full bg-white py-2 px-4">
      {/* Brand  */}
      <div className="flex items-center gap-4">
        <img
          src={BrandLogoFill}
          alt="Logo"
          className="size-[64px] object-contain"
        />
        {/* Copyright */}
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Arkai NFT Stacking. All rights
          reserved.
        </p>
      </div>
      {/* Navigation */}
      <div className="flex items-center text-sm gap-4">
        <Link to="/policy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
        <Link to="/support">Support</Link>
      </div>
    </footer>
  );
}
