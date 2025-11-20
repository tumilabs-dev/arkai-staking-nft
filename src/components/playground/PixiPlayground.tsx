import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite } from "pixi.js";
import Island_01 from "./parts/pool-1/Island_01";
import Island_02 from "./parts/pool-1/Island_02";
import Island_03 from "./parts/pool-1/Island_03";
import Checkpoint from "./parts/pool-1/checkpoint";
import { useWindowSize } from "@uidotdev/usehooks";
import { useRef } from "react";

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
});

// Canvas was a 1099x1099px square
const CANVAS_DESIGNED_EDGE = 1099;

export function PixiPlayground() {
  const { height, width } = useWindowSize();
  // Multiplied by 2 because of the header and footer
  const realHeight = (height ?? 0) - 18 * 8 * 2;
  const edge = Math.min(realHeight, width ?? 0);
  const scale = edge / 1099;
  const canvasHeight = CANVAS_DESIGNED_EDGE * scale;
  const canvasWidth = CANVAS_DESIGNED_EDGE * scale;
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8 bg-background">
      <div className="relative" ref={containerRef}>
        {height && width && (
          <Application
            width={canvasWidth}
            height={canvasHeight}
            backgroundColor={0xf0e4d2}
            antialias
            bezierSmoothness={0.5}
            autoDensity
          >
            <pixiContainer
              interactive
              scale={scale}
              x={-canvasWidth / 20}
              y={-canvasHeight / 20}
            >
              <Island_02 />
              <Island_03 />
              <Island_01 />
              <Checkpoint />
            </pixiContainer>
          </Application>
        )}
      </div>
    </div>
  );
}
