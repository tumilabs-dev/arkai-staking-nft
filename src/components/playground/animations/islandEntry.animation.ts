import * as PIXI from "pixi.js";

export const islandEntryAnimation = (
  timeline: gsap.core.Timeline,
  sprite: PIXI.Sprite,
  onComplete?: () => void,
  delay?: number,
  y?: number
) => {
  console.log("y", y);
  console.log("sprite.y", sprite.y);
  timeline.fromTo(
    sprite,
    {
      pixi: {
        alpha: 0,
        y: sprite.y - 10,
      },
    },
    {
      pixi: {
        alpha: 1,
        y: sprite.y,
      },
      duration: 1,
      ease: "ease.inOut",
      onComplete: () => {
        onComplete?.();
      },
    },
    delay ?? 0
  );
};
