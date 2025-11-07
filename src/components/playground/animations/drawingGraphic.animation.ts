import * as PIXI from "pixi.js";

export const drawingGraphicAnimation = (
  timeline: gsap.core.Timeline,
  graphics: PIXI.Graphics,
  onComplete?: () => void,
  delay?: number
) => {
  timeline
    .set(graphics, {
      pixi: {
        alpha: 0,
      },
    })
    .to(graphics, {
      pixi: {
        alpha: 1,
      },
      duration: 1.5,
      ease: "power2.out",
      delay: delay ?? 0,
      onComplete: () => {
        onComplete?.();
      },
    });
};
