import { useGetMap } from "@/hooks/playground/useGetMap";
import { useGSAP } from "@gsap/react";
import { Application, extend } from "@pixi/react";
import { useWindowSize } from "@uidotdev/usehooks";
import gsap from "gsap";
import { BitmapText, Container, Graphics, Sprite, Text } from "pixi.js";
import { useRef } from "react";
import { PixiSpriteResolver } from "./parts/commons/PixiSpriteResolver";
import Checkpoint from "./parts/pool-1/checkpoint";
// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
  Text,
  BitmapText,
});

// Canvas was a 1099x1099px square

export function PixiPlayground({ poolId }: { poolId: string }) {
  const { data: mapData, isLoading } = useGetMap(poolId);
  const mapDefines = mapData?.mapDefines ?? [];
  const mapSizes = mapData?.mapSizes ?? { width: 0, height: 0 };
  const { height, width } = useWindowSize();

  // Multiplied by 2 because of the header and footer
  const realHeight = (height ?? 0) - 18 * 8 * 2;
  const edge = Math.min(realHeight, width ?? 0);
  const scale = edge / mapSizes.width;
  const canvasHeight = mapSizes.height * scale;
  const canvasWidth = mapSizes.width * scale;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isLoading) return;
      if (!containerRef.current) return;
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
        }
      );
    },
    {
      scope: containerRef,
      dependencies: [isLoading],
    }
  );

  if (isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="relative " ref={containerRef}>
        {height && width && mapDefines && (
          <Application
            width={canvasWidth}
            height={canvasHeight}
            antialias
            bezierSmoothness={0.5}
            backgroundAlpha={0}
            resizeTo={containerRef}
            resolution={window.devicePixelRatio}
            autoDensity
            powerPreference="high-performance"
            eventMode="dynamic"
          >
            <pixiContainer
              scale={scale}
              x={-canvasWidth / 20}
              y={-canvasHeight / 10}
            >
              {mapDefines.map((element, index) => (
                <PixiSpriteResolver
                  key={`${element.asset}-${index}`}
                  mapElement={element}
                />
              ))}

              <Checkpoint poolId={poolId} />
            </pixiContainer>
          </Application>
        )}
      </div>
    </div>
  );
}
