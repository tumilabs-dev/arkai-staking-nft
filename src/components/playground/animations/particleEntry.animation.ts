import * as PIXI from "pixi.js";

export const particleEntryAnimation = (
  timeline: gsap.core.Timeline,
  sprite: PIXI.Sprite,
  onComplete?: () => void,
  delay?: number
) => {
  const y = sprite.y;

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
      duration: 0.3,
      delay: delay ? delay + 1 : 1,
    })
    .from(
      sprite,

      {
        duration: 0.5,
        pixi: {
          y: y - 50,
        },
        onComplete: () => {
          onComplete?.();
        },
        ease: "bounce.out",
      },
      "<0.1"
    );
};
