import * as PIXI from "pixi.js";

export const islandEntryAnimation = (
  timeline: gsap.core.Timeline,
  sprite: PIXI.Sprite,
  onComplete?: () => void,
  delay?: number
) => {
  const y = sprite.y;

  timeline.from(sprite, {
    pixi: {
      alpha: 0,
      y: y + 10,
    },
    duration: 1,
    ease: "fade.in",
    delay: delay ?? 0,
    onComplete: () => {
      onComplete?.();
    },
  });
};
