import { random } from "gsap/all";
import * as PIXI from "pixi.js";

export const islandIdleAnimation = (
  timeline: gsap.core.Timeline,
  sprite: PIXI.Sprite
) => {
  timeline.delay(random(0, 2)).to(sprite, {
    pixi: {
      x: sprite.x + 5,
      y: sprite.y + 2,
    },
    duration: 1,
    ease: "ease.inOut",
    repeat: -1,
    yoyo: true,
  });
};
