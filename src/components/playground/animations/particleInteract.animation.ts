import * as PIXI from "pixi.js";

export const particleInteractAnimation = (
  timeline: gsap.core.Timeline,
  sprite: PIXI.Sprite,
  size?: {
    width: number;
    height: number;
  },
  onComplete?: () => void
) => {
  const currentSize = size ?? {
    width: sprite.width,
    height: sprite.height,
  };

  timeline
    .set(sprite, {
      pixi: {
        anchorX: 0.5,
        anchorY: 0.5,
        width: currentSize.width,
        height: currentSize.height,
      },
    })
    .to(sprite, {
      pixi: {
        scaleX: 1.1,
        scaleY: 0.95,

        width: currentSize.width,
        height: currentSize.height,
      },
      duration: 0.1,
    })
    .to(sprite, {
      pixi: {
        scaleX: 1,
        scaleY: 1,

        anchorY: 0.5,
        width: currentSize.width,
        height: currentSize.height,
      },
      duration: 0.2,
      ease: "bounce.out",
      onComplete: () => {
        onComplete?.();
      },
    });
};
