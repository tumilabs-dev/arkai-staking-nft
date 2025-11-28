import Island_Image from "@/assets/pool/maps/pool-1/island/island-3/island.png";
import Island_Shadow from "@/assets/pool/maps/pool-1/island/island-3/shadow.png";
import Island_Trees from "@/assets/pool/maps/pool-1/shared/tree-1.png";
import Island_Trees_2 from "@/assets/pool/maps/pool-1/shared/tree-2.png";
import Island_Trees_3 from "@/assets/pool/maps/pool-1/shared/tree-3.png";
import Island_Lighthouse from "@/assets/pool/maps/pool-1/island/island-3/lighthouse.png";

import { LayerPositions } from "../../constants/LayerPosition.enum";
import { PixiSpriteWithTexture } from "../commons/PixiSpriteWithTexture";
import { islandIdleAnimation } from "../../animations/islandIdle.animation";
import { islandEntryAnimation } from "../../animations/islandEntry.animation";
import { particleEntryAnimation } from "../../animations/particleEntry.animation";

export default function Island_03() {
  return (
    <>
      {/* Base island */}
      <PixiSpriteWithTexture
        asset={Island_Image}
        x={82.64}
        y={457.44}
        zIndex={LayerPositions.GROUND}
        visible={true}
        initAnimation={(timeline, sprite, onComplete) =>
          islandEntryAnimation(timeline, sprite, onComplete)
        }
        isInteractable={false}
      />
      <PixiSpriteWithTexture
        x={75.51}
        y={454.17}
        zIndex={LayerPositions.UNDERWATER}
        asset={Island_Shadow}
        visible={true}
        initAnimation={(timeline, sprite, onComplete) =>
          islandEntryAnimation(timeline, sprite, onComplete)
        }
        idleAnimation={(timeline, sprite) =>
          islandIdleAnimation(timeline, sprite)
        }
        isInteractable={false}
      />

      {/* Trees */}
      <PixiSpriteWithTexture
        asset={Island_Trees}
        x={79.87}
        y={492.36}
        zIndex={LayerPositions.GROUND}
        visible={true}
        initAnimation={(timeline, sprite, onComplete) =>
          particleEntryAnimation(timeline, sprite, onComplete)
        }
      />
      <PixiSpriteWithTexture
        asset={Island_Trees_2}
        x={226.85}
        y={420.35}
        zIndex={LayerPositions.GROUND}
        visible={true}
        initAnimation={(timeline, sprite, onComplete) =>
          particleEntryAnimation(timeline, sprite, onComplete)
        }
      />
      <PixiSpriteWithTexture
        asset={Island_Trees_3}
        x={130.6}
        y={416.11}
        zIndex={LayerPositions.GROUND}
        visible={true}
        initAnimation={(timeline, sprite, onComplete) =>
          particleEntryAnimation(timeline, sprite, onComplete)
        }
      />

      {/* Lighthouse */}
      <PixiSpriteWithTexture
        asset={Island_Lighthouse}
        x={177.74}
        y={395.08}
        zIndex={LayerPositions.TOP}
        visible={true}
        initAnimation={(timeline, sprite, onComplete) =>
          particleEntryAnimation(timeline, sprite, onComplete, 1)
        }
      />
    </>
  );
}
