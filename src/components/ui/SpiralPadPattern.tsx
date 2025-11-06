import SpiralPng from "@/assets/objects/spiral.png";
import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

type PatternSize = "sm" | "md" | "lg" | "xl" | number;

interface SpiralPadPatternProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  color?: string;
  size?: number;
  opacity?: number;
  className?: string;
}

/**
 * Component that applies a repeating spiral pad pattern background
 *
 * @example
 * ```tsx
 * // Basic usage with default color
 * <SpiralPadPattern className="p-8">
 *   <div>Content with pattern background</div>
 * </SpiralPadPattern>
 *
 * // Custom color and size
 * <SpiralPadPattern color="#839C8C" size="lg" opacity={0.3}>
 *   <div>Content</div>
 * </SpiralPadPattern>
 * ```
 */
export default function SpiralPadPattern({
  children,
  size = 47,
  className,
  style,
  ...props
}: SpiralPadPatternProps) {
  const ratio = size / 47;
  return (
    <div
      {...props}
      className={cn("spiral-pad-pattern", className)}
      style={{
        backgroundImage: `url(${SpiralPng})`,
        backgroundRepeat: "repeat",

        backgroundSize: `${47 * ratio}px ${30 * ratio}px`,
        height: `${30 * ratio}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
