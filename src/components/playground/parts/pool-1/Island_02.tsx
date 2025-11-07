import Island_Image from "@/assets/pool/maps/pool-1/island/island-2/island.png";
import Island_Shadow from "@/assets/pool/maps/pool-1/island/island-2/shadow.png";
import Island_Tree from "@/assets/pool/maps/pool-1/shared/tree-3.png";
import { LayerPositions } from "../../constants/LayerPosition.enum";
import { PixiSpriteWithTexture } from "../commons/PixiSpriteWithTexture";
import { islandEntryAnimation } from "../../animations/islandEntry.animation";
import { islandIdleAnimation } from "../../animations/islandIdle.animation";
import { particleEntryAnimation } from "../../animations/particleEntry.animation";

export default function Island_02() {
  return (
    <>
      {/* Island base */}
      <PixiSpriteWithTexture
        asset={Island_Image}
        x={974.2}
        y={754.39}
        zIndex={LayerPositions.GROUND}
        visible={true}
        initAnimation={(timeline, sprite, onComplete) =>
          islandEntryAnimation(timeline, sprite, onComplete)
        }
        isInteractable={false}
      />
      <PixiSpriteWithTexture
        asset={Island_Shadow}
        x={967.94}
        y={751.59}
        zIndex={LayerPositions.UNDERWATER}
        visible={true}
        initAnimation={(timeline, sprite, onComplete) =>
          islandEntryAnimation(timeline, sprite, onComplete)
        }
        idleAnimation={(timeline, sprite) =>
          islandIdleAnimation(timeline, sprite)
        }
        isInteractable={false}
      />

      {/* Tree */}
      <PixiSpriteWithTexture
        asset={Island_Tree}
        x={1046.74}
        y={706.44}
        width={52.26}
        height={76.62}
        zIndex={LayerPositions.GROUND}
        visible={true}
        initAnimation={(timeline, sprite, onComplete) =>
          particleEntryAnimation(timeline, sprite, onComplete)
        }
      />
    </>
  );
}
