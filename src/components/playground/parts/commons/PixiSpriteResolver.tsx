import { MapDefineElement } from "@/hooks/playground/useGetMap";
import { resolveAsset } from "@/lib/resolveAsset";
import { islandEntryAnimation } from "../../animations/islandEntry.animation";
import { particleEntryAnimation } from "../../animations/particleEntry.animation";
import {
  PixiCustomAnimation,
  PixiSpriteWithTexture,
} from "./PixiSpriteWithTexture";
import { islandIdleAnimation } from "../../animations/islandIdle.animation";

export function PixiSpriteResolver({
  mapElement,
}: {
  mapElement: MapDefineElement;
}) {
  const initAnimationHandler: PixiCustomAnimation = (
    timeline,
    sprite,
    onComplete,
    delay,
    y
  ) => {
    if (mapElement.initAnimation === "particleEntryAnimation") {
      particleEntryAnimation(timeline, sprite, onComplete, delay, y);
    } else if (mapElement.initAnimation === "islandEntryAnimation") {
      islandEntryAnimation(timeline, sprite, onComplete, delay, y);
    }
  };

  const idleAnimationHandler: PixiCustomAnimation = (timeline, sprite) => {
    if (mapElement.idleAnimation === "islandIdleAnimation") {
      islandIdleAnimation(timeline, sprite);
    }
  };

  return (
    <PixiSpriteWithTexture
      asset={resolveAsset(mapElement.asset)}
      x={mapElement.x}
      y={mapElement.y}
      zIndex={mapElement.index}
      visible={true}
      initAnimation={initAnimationHandler}
      idleAnimation={idleAnimationHandler}
      isInteractable={true}
      scale={mapElement.scale ?? 1}
    />
  );
}
