import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite } from "pixi.js";
import Island_01 from "./parts/pool-1/Island_01";
import Island_02 from "./parts/pool-1/Island_02";
import Island_03 from "./parts/pool-1/Island_03";
import Checkpoint from "./parts/pool-1/checkpoint";

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
});

const CANVAS_WIDTH = 1099;
const CANVAS_HEIGHT = 1036;

export function PixiPlayground() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8 bg-background">
      <div className="relative">
        <Application
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          backgroundColor={0xf0e4d2}
          antialias
        >
          <pixiContainer interactive>
            <Island_02 />
            <Island_03 />
            <Island_01 />
            <Checkpoint />
          </pixiContainer>
        </Application>
      </div>
    </div>
  );
}
