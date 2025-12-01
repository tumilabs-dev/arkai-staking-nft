import * as PIXI from "pixi.js";

export const particleEntryAnimation = (
  timeline: gsap.core.Timeline,
  sprite: PIXI.Sprite,
  onComplete?: () => void,
  delay?: number,
  y?: number
) => {
  timeline
    .set(sprite, {
      pixi: {
        alpha: 0,
      },
    })

    .to(sprite, {
      pixi: {
        alpha: 1,
      },
      duration: 0.5,
      delay: delay ? delay + 1 : 1,
    })
    .from(
      sprite,

      {
        duration: 0.8,
        pixi: {
          y: sprite.y - 5,
        },
        onComplete: () => {
          onComplete?.();
        },
        ease: "bounce.out",
      },
      "<0.1"
    );
};
