import { SVGProps } from "react";

export function SpiralPad({
  width = 20,
  height = 20,
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Square spiral with decreasing stroke width from outside to inside */}
      {/* Outer layers - thickest strokes */}
      <path
        d="M 0 0 L 20 0"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M 20 0 L 20 20"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M 20 20 L 0 20"
        stroke="currentColor"
        strokeWidth="2.0"
        strokeLinecap="round"
      />
      <path
        d="M 0 20 L 0 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Middle-outer layers */}
      <path
        d="M 0 2 L 18 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M 18 2 L 18 18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M 18 18 L 2 18"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 2 18 L 2 4"
        stroke="currentColor"
        strokeWidth="1.0"
        strokeLinecap="round"
      />

      {/* Middle layers */}
      <path
        d="M 2 4 L 16 4"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
      />
      <path
        d="M 16 4 L 16 16"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <path
        d="M 16 16 L 4 16"
        stroke="currentColor"
        strokeWidth="0.55"
        strokeLinecap="round"
      />
      <path
        d="M 4 16 L 4 6"
        stroke="currentColor"
        strokeWidth="0.45"
        strokeLinecap="round"
      />

      {/* Middle-inner layers */}
      <path
        d="M 4 6 L 14 6"
        stroke="currentColor"
        strokeWidth="0.35"
        strokeLinecap="round"
      />
      <path
        d="M 14 6 L 14 14"
        stroke="currentColor"
        strokeWidth="0.28"
        strokeLinecap="round"
      />
      <path
        d="M 14 14 L 6 14"
        stroke="currentColor"
        strokeWidth="0.22"
        strokeLinecap="round"
      />
      <path
        d="M 6 14 L 6 8"
        stroke="currentColor"
        strokeWidth="0.18"
        strokeLinecap="round"
      />

      {/* Inner layers - thinnest strokes */}
      <path
        d="M 6 8 L 12 8"
        stroke="currentColor"
        strokeWidth="0.14"
        strokeLinecap="round"
      />
      <path
        d="M 12 8 L 12 12"
        stroke="currentColor"
        strokeWidth="0.11"
        strokeLinecap="round"
      />
      <path
        d="M 12 12 L 8 12"
        stroke="currentColor"
        strokeWidth="0.09"
        strokeLinecap="round"
      />
      <path
        d="M 8 12 L 8 10"
        stroke="currentColor"
        strokeWidth="0.07"
        strokeLinecap="round"
      />
      <path
        d="M 8 10 L 10 10"
        stroke="currentColor"
        strokeWidth="0.05"
        strokeLinecap="round"
      />
    </svg>
  );
}
