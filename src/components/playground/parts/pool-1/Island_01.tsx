import Island_Image from "@/assets/pool/maps/pool-1/island/island-1/island.png";
import Island_Shadow_1 from "@/assets/pool/maps/pool-1/island/island-1/shadow-1.png";
import Island_Shadow_2 from "@/assets/pool/maps/pool-1/island/island-1/shadow-2.png";
import Island_Tree_1 from "@/assets/pool/maps/pool-1/shared/tree-1.png";
import Island_Tree_3 from "@/assets/pool/maps/pool-1/shared/tree-3.png";
import Island_Tree_Root from "@/assets/pool/maps/pool-1/shared/tree-root.png";

import Mountain_1 from "@/assets/pool/maps/pool-1/island/island-1/mountain-1.png";
import Mountain_2 from "@/assets/pool/maps/pool-1/island/island-1/mountain-2.png";
import Mountain_3 from "@/assets/pool/maps/pool-1/island/island-1/mountain-3.png";
import Pond_1 from "@/assets/pool/maps/pool-1/island/island-1/pond-1.png";
import Pond_2 from "@/assets/pool/maps/pool-1/island/island-1/pond-2.png";
import Pond_3 from "@/assets/pool/maps/pool-1/island/island-1/pond-3.png";
import Tend from "@/assets/pool/maps/pool-1/island/island-1/tend.png";
import Tend_Tree_1 from "@/assets/pool/maps/pool-1/island/island-1/tend-tree-1.png";
import Tend_Tree_2 from "@/assets/pool/maps/pool-1/island/island-1/tend-tree-2.png";
import Tend_Tree_3 from "@/assets/pool/maps/pool-1/island/island-1/tend-tree-3.png";
import FishRack from "@/assets/pool/maps/pool-1/island/island-1/fish-rack.png";
import Bone from "@/assets/pool/maps/pool-1/island/island-1/bone.png";
import Bush_1 from "@/assets/pool/maps/pool-1/island/island-1/bush-1.png";
import Bush_2 from "@/assets/pool/maps/pool-1/island/island-1/bush-2.png";
import Bush_3 from "@/assets/pool/maps/pool-1/island/island-1/bush-3.png";
import Bush_4 from "@/assets/pool/maps/pool-1/island/island-1/bush-4.png";
import Bush_5 from "@/assets/pool/maps/pool-1/island/island-1/bush-5.png";
import Bush_6 from "@/assets/pool/maps/pool-1/island/island-1/bush-6.png";
import Bush_7 from "@/assets/pool/maps/pool-1/island/island-1/bush-7.png";
import Bush_8 from "@/assets/pool/maps/pool-1/island/island-1/bush-8.png";
import Bush_9 from "@/assets/pool/maps/pool-1/island/island-1/bush-9.png";
import Bush_10 from "@/assets/pool/maps/pool-1/island/island-1/bush-10.png";
import Bush_11 from "@/assets/pool/maps/pool-1/island/island-1/bush-11.png";
import Bush_12 from "@/assets/pool/maps/pool-1/island/island-1/bush-12.png";
import Bush_13 from "@/assets/pool/maps/pool-1/island/island-1/bush-13.png";

import Temple from "@/assets/pool/maps/pool-1/island/island-1/temple.png";
import Statue_1 from "@/assets/pool/maps/pool-1/island/island-1/statue-1.png";
import Statue_2 from "@/assets/pool/maps/pool-1/island/island-1/statue-2.png";
import Statue_3 from "@/assets/pool/maps/pool-1/island/island-1/statue-3.png";
import Statue_4 from "@/assets/pool/maps/pool-1/island/island-1/statue-4.png";
import Statue_5 from "@/assets/pool/maps/pool-1/island/island-1/statue-5.png";

import Voodoo_1 from "@/assets/pool/maps/pool-1/island/island-1/voodoo-1.png";
import Voodoo_2 from "@/assets/pool/maps/pool-1/island/island-1/voodoo-2.png";

import Arkai_Statue from "@/assets/pool/maps/pool-1/island/island-1/arkai-statue.png";
import Cart from "@/assets/pool/maps/pool-1/island/island-1/cart.png";

import Cactus_1 from "@/assets/pool/maps/pool-1/island/island-1/cactus-1.png";
import Cactus_2 from "@/assets/pool/maps/pool-1/island/island-1/cactus-2.png";
import Cactus_3 from "@/assets/pool/maps/pool-1/island/island-1/cactus-3.png";
import Cactus_4 from "@/assets/pool/maps/pool-1/island/island-1/cactus-4.png";

import Cave from "@/assets/pool/maps/pool-1/island/island-1/cave.png";
import Cave_Rock from "@/assets/pool/maps/pool-1/island/island-1/rock.png";

import Bridge from "@/assets/pool/maps/pool-1/island/island-1/bridge.png";
import { LayerPositions } from "../../constants/LayerPosition.enum";
import { PixiSpriteWithTexture } from "../commons/PixiSpriteWithTexture";
import { particleEntryAnimation } from "../../animations/particleEntry.animation";
import { islandEntryAnimation } from "../../animations/islandEntry.animation";
import { islandIdleAnimation } from "../../animations/islandIdle.animation";

const mainObjectDelay = {
  tend: 0.3,
  bone: 0.5,
  temple: 0.7,
  statue: 0.9,
  voodoo: 1.1,
  arkaiStatue: 1.3,
  cart: 1.5,
  cave: 1.7,
  bridge: 0,
};
export default function Island_01() {
  return (
    <>
      {/* Island base */}
      <>
        <PixiSpriteWithTexture
          x={147.14}
          y={197.41}
          zIndex={LayerPositions.GROUND}
          asset={Island_Image}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            islandEntryAnimation(timeline, sprite, onComplete)
          }
          isInteractable={false}
        />
        <PixiSpriteWithTexture
          asset={Island_Shadow_1}
          x={127.43}
          y={185.79}
          zIndex={LayerPositions.UNDERGROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            islandEntryAnimation(timeline, sprite, onComplete, 1)
          }
          idleAnimation={(timeline, sprite) =>
            islandIdleAnimation(timeline, sprite)
          }
          isInteractable={false}
        />
        <PixiSpriteWithTexture
          asset={Island_Shadow_2}
          x={121.18}
          y={178.34}
          zIndex={LayerPositions.UNDERWATER}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            islandEntryAnimation(timeline, sprite, onComplete, 2)
          }
          idleAnimation={(timeline, sprite) =>
            islandIdleAnimation(timeline, sprite)
          }
          isInteractable={false}
        />
      </>
      {/* Mountain */}
      <>
        <PixiSpriteWithTexture
          asset={Mountain_1}
          x={365.67}
          y={176.2}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            islandEntryAnimation(timeline, sprite, onComplete)
          }
        />
        <PixiSpriteWithTexture
          asset={Mountain_2}
          x={644.84}
          y={286.71}
          zIndex={LayerPositions.GROUND}
          initAnimation={(timeline, sprite, onComplete) =>
            islandEntryAnimation(timeline, sprite, onComplete)
          }
          visible={true}
        />
        <PixiSpriteWithTexture
          asset={Mountain_2}
          x={676.5}
          y={391.16}
          width={88.63}
          height={38.75}
          zIndex={LayerPositions.GROUND}
          initAnimation={(timeline, sprite, onComplete) =>
            islandEntryAnimation(timeline, sprite, onComplete)
          }
          visible={true}
        />
        <PixiSpriteWithTexture
          asset={Mountain_3}
          x={612.64}
          y={528.16}
          zIndex={LayerPositions.GROUND}
          initAnimation={(timeline, sprite, onComplete) =>
            islandEntryAnimation(timeline, sprite, onComplete)
          }
          visible={true}
        />
      </>
      {/* Free Trees */}
      <>
        <PixiSpriteWithTexture
          asset={Island_Tree_1}
          x={345.5}
          y={195.81}
          width={34.34}
          height={42.54}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(timeline, sprite, onComplete)
          }
        />
        <PixiSpriteWithTexture
          asset={Island_Tree_3}
          x={929.04}
          y={340.18}
          width={42.9}
          height={62.75}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(timeline, sprite, onComplete, 0.1)
          }
        />
        <PixiSpriteWithTexture
          asset={Island_Tree_1}
          x={403.98}
          y={508.7}
          width={40.95}
          height={50.68}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(timeline, sprite, onComplete, 0.2)
          }
        />
        <PixiSpriteWithTexture
          asset={Island_Tree_1}
          x={589.65}
          y={576.41}
          width={35.3}
          height={44.52}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={particleEntryAnimation}
        />
        <PixiSpriteWithTexture
          asset={Island_Tree_Root}
          x={900.85}
          y={409.9}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(timeline, sprite, onComplete, 0.3)
          }
        />
      </>

      {/* Free bushes */}
      <>
        <PixiSpriteWithTexture
          asset={Bush_12}
          x={332.87}
          y={613.11}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(timeline, sprite, onComplete, 0.4)
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_13}
          x={308.29}
          y={621.7}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(timeline, sprite, onComplete, 0.5)
          }
        />
      </>

      {/* Pond */}
      <>
        {/* Pond 1 */}
        <PixiSpriteWithTexture
          asset={Pond_1}
          x={605.31}
          y={233}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            islandEntryAnimation(timeline, sprite, onComplete)
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_3}
          x={654.77}
          y={259.11}
          width={30.52}
          height={17.45}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(timeline, sprite, onComplete, 0.6)
          }
        />

        {/* Pond 2 */}
        <PixiSpriteWithTexture
          asset={Pond_2}
          x={450.25}
          y={769.7}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            islandEntryAnimation(timeline, sprite, onComplete)
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_4}
          x={557.98}
          y={729.96}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            islandEntryAnimation(timeline, sprite, onComplete)
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_3}
          x={463.03}
          y={807.92}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            islandEntryAnimation(timeline, sprite, onComplete)
          }
        />

        {/* Pond 3 */}
        <PixiSpriteWithTexture
          asset={Pond_3}
          x={590.33}
          y={872.71}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            islandEntryAnimation(timeline, sprite, onComplete)
          }
        />
      </>

      {/* Main group object */}
      {/* Tend */}
      <>
        {/* Tree */}
        <PixiSpriteWithTexture
          asset={Tend_Tree_1}
          x={475}
          y={166.28}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.tend
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Tend_Tree_2}
          x={495.58}
          y={117}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.tend + 0.1
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Tend_Tree_3}
          x={605.67}
          y={154.62}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.tend + 0.2
            )
          }
        />
        {/* Bush */}
        <PixiSpriteWithTexture
          asset={Bush_1}
          x={485.63}
          y={180.24}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.tend + 0.3
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_2}
          x={575.57}
          y={178.64}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.tend + 0.4
            )
          }
        />
        {/* Tent */}
        <PixiSpriteWithTexture
          asset={Tend}
          x={498}
          y={161}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.tend
            )
          }
        />
        {/* Foreground of the tend */}
        <PixiSpriteWithTexture
          asset={Bush_3}
          x={484.2}
          y={243.73}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.tend + 0.5
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_4}
          x={567.89}
          y={244.24}
          width={35.59}
          height={22.34}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.tend + 0.6
            )
          }
        />
        {/* Fish Rack */}
        <PixiSpriteWithTexture
          asset={FishRack}
          x={555.32}
          y={262.25}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.tend + 0.7
            )
          }
        />
      </>

      {/* Bone */}
      <>
        {/* Bush */}
        <PixiSpriteWithTexture
          asset={Bush_5}
          x={400.71}
          y={258.75}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.bone + 0.1
            )
          }
        />

        <PixiSpriteWithTexture
          asset={Bush_8}
          x={450.49}
          y={277.08}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.bone + 0.2
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_6}
          x={400.848}
          y={279.78}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.bone + 0.3
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_7}
          x={498.6}
          y={278.13}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.bone + 0.4
            )
          }
        />

        <PixiSpriteWithTexture
          asset={Bush_8}
          x={400.53}
          y={321.9}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.bone + 0.5
            )
          }
        />

        <PixiSpriteWithTexture
          asset={Bone}
          x={425.23}
          y={296.62}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.bone
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_9}
          x={450.71}
          y={332.32}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.bone + 0.1
            )
          }
        />
      </>

      {/* Temple */}
      <>
        {/* Tree */}
        <PixiSpriteWithTexture
          asset={Island_Tree_1}
          x={468.7}
          y={423.57}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.temple + 0.1
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Island_Tree_3}
          x={616.77}
          y={434.18}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.temple + 0.2
            )
          }
        />
        {/* Bush */}
        <PixiSpriteWithTexture
          asset={Bush_1}
          x={445.7}
          y={461.32}
          width={62.83}
          height={42.41}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.temple + 0.3
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_3}
          x={627.38}
          y={473.81}
          width={57.99}
          height={42.95}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.temple + 0.4
            )
          }
        />
        {/* Temple */}
        <PixiSpriteWithTexture
          asset={Temple}
          x={452}
          y={409}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.temple
            )
          }
        />
        {/* Tree Root */}
        <PixiSpriteWithTexture
          asset={Island_Tree_Root}
          x={483.68}
          y={564.78}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.temple + 0.1
            )
          }
        />
      </>

      {/* Statue */}
      <>
        {/* Statue Group */}
        <PixiSpriteWithTexture
          asset={Bush_11}
          x={688.8}
          y={439.23}
          width={93.2}
          height={58.44}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.statue + 0.1
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Statue_1}
          x={740.24}
          y={456.32}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.statue
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Statue_2}
          x={790.87}
          y={413}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.statue + 0.1
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_3}
          x={819.97}
          y={464.02}
          width={30.04}
          height={17.68}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.statue + 0.2
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Statue_3}
          x={781.77}
          y={476.52}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.statue + 0.3
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Statue_4}
          x={782.61}
          y={520.77}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.statue + 0.4
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Statue_5}
          x={825.66}
          y={513.48}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.statue + 0.5
            )
          }
        />
      </>

      {/* Voodoo */}
      <>
        {/* Bush */}
        <PixiSpriteWithTexture
          asset={Bush_10}
          x={455.77}
          y={652.5}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.voodoo + 0.1
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_11}
          x={391.73}
          y={684.56}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.voodoo + 0.2
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_11}
          x={503.92}
          y={688.04}
          width={82.48}
          height={51.79}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.voodoo + 0.3
            )
          }
        />
        {/* Voodoo  */}
        <PixiSpriteWithTexture
          asset={Voodoo_1}
          x={454.77}
          y={667.24}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.voodoo + 0.1
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Voodoo_2}
          x={443.59}
          y={719.78}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.voodoo
            )
          }
        />
      </>

      {/* Arkai Statue */}
      <>
        <PixiSpriteWithTexture
          asset={Arkai_Statue}
          x={846.87}
          y={533.96}
          zIndex={LayerPositions.TOP}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.arkaiStatue
            )
          }
        />
      </>

      {/* Cart */}
      <>
        <PixiSpriteWithTexture
          asset={Cart}
          x={208.85}
          y={680.79}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.cart
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Cactus_1}
          x={226.29}
          y={772.62}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.cart + 0.1
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Cactus_2}
          x={238.28}
          y={759.41}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.cart + 0.2
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Cactus_3}
          x={194.17}
          y={802.65}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.cart + 0.3
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Cactus_4}
          x={257.32}
          y={822.38}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.cart + 0.4
            )
          }
        />
      </>

      {/* Cave */}
      <>
        {/* Bush */}
        <PixiSpriteWithTexture
          asset={Bush_11}
          x={681.2}
          y={804.23}
          width={72.27}
          height={45.37}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.cave + 0.1
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_11}
          x={755.08}
          y={787.12}
          width={94.9}
          height={50.67}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.cave + 0.2
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Bush_11}
          x={780.35}
          y={870.79}
          width={56.02}
          height={35.12}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.cave + 0.3
            )
          }
        />
        {/* Cave */}
        <PixiSpriteWithTexture
          asset={Cave}
          x={719.32}
          y={783.51}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.cave
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Cave_Rock}
          x={784.74}
          y={878.18}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.cave + 0.1
            )
          }
        />
        <PixiSpriteWithTexture
          asset={Cave_Rock}
          x={677.99}
          y={848.01}
          width={26.5}
          height={15.47}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.cave + 0.2
            )
          }
        />
      </>

      {/* Bridge */}
      <>
        <PixiSpriteWithTexture
          asset={Bridge}
          x={966.15}
          y={703.98}
          zIndex={LayerPositions.GROUND}
          visible={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(
              timeline,
              sprite,
              onComplete,
              mainObjectDelay.bridge
            )
          }
        />
      </>
    </>
  );
}
