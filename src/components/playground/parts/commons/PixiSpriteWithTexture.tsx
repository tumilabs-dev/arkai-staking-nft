import { PixiReactElementProps } from "@pixi/react";
import * as PIXI from "pixi.js";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { SpriteAnimation } from "../../constants/SpriteAnimation.enum";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { PixiPlugin } from "gsap/PixiPlugin";
import { particleInteractAnimation } from "../../animations/particleInteract.animation";

gsap.registerPlugin(useGSAP, PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export type PixiCustomAnimation = (
  timeline: gsap.core.Timeline,
  sprite: PIXI.Sprite,
  onComplete?: () => void,
  delay?: number,
  y?: number
) => void;

interface PixiSpriteWithTextureProps
  extends PixiReactElementProps<typeof PIXI.Sprite> {
  asset: string;
  zIndex: number;
  isInteractable?: boolean;
  initAnimation?: PixiCustomAnimation;
  idleAnimation?: PixiCustomAnimation;
  endAnimation?: PixiCustomAnimation;
}

export const PixiSpriteWithTexture = ({
  asset,
  initAnimation,
  idleAnimation,
  endAnimation,
  isInteractable = true,
  ...props
}: PixiSpriteWithTextureProps) => {
  // Texture
  const [texture, setTexture] = useState<PIXI.Texture | undefined>(undefined);
  const [textureSize, setTextureSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const spriteRef = useRef<PIXI.Sprite>(null);

  useEffect(() => {
    if (texture) return;
    if (!asset) return;
    PIXI.Assets.load(asset).then((result: PIXI.Texture) => {
      setTexture(result);
      if (textureSize.width === 0 && textureSize.height === 0) {
        setTextureSize({ width: result.width, height: result.height });
      }
    });
  }, [asset, textureSize, texture, props]);

  // Set anchor to center after texture is loaded and sprite has dimensions
  useGSAP(() => {
    if (
      !spriteRef.current ||
      !texture ||
      textureSize.width === 0 ||
      textureSize.height === 0
    )
      return;

    if (
      spriteRef.current.anchor._x === 0.5 &&
      spriteRef.current.anchor._y === 0.5
    )
      return;

    const currentX = spriteRef.current.x ?? 0;
    const currentY = spriteRef.current.y ?? 0;

    spriteRef.current.anchor.set(0.5, 0.5);
    spriteRef.current.position.set(
      currentX + textureSize.width / 2,
      currentY + textureSize.height / 2
    );
  }, [texture, textureSize]);

  // Animation
  const [animation, setAnimation] = useState<SpriteAnimation>(
    SpriteAnimation.START
  );

  // Handle Start Animation
  const { contextSafe } = useGSAP(() => {
    if (
      !spriteRef.current ||
      !texture ||
      !props.x ||
      !props.y ||
      !spriteRef.current.width ||
      !spriteRef.current.height ||
      animation !== SpriteAnimation.START
    )
      return;

    const timeline = gsap.timeline();
    console.log("initAnimation", initAnimation);

    initAnimation?.(timeline, spriteRef.current, () => {
      setAnimation(SpriteAnimation.IDLE);
    });
  }, [animation, props]);

  // Handle Idle Animation
  useGSAP(() => {
    if (
      !spriteRef.current ||
      !texture ||
      !props.x ||
      !props.y ||
      !idleAnimation ||
      animation !== SpriteAnimation.IDLE
    )
      return;

    const timeline = gsap.timeline();
    idleAnimation?.(timeline, spriteRef.current);
  }, [animation, props, texture, idleAnimation]);

  // Handle End Animation
  useGSAP(() => {
    if (!spriteRef.current || !texture || !props.x || !props.y || !endAnimation)
      return;

    const timeline = gsap.timeline();
    endAnimation?.(timeline, spriteRef.current);
  }, [animation, props, texture, endAnimation]);

  // Handle Interact Animation
  const handleInteract = contextSafe(() => {
    if (!isInteractable) return;
    if (!spriteRef.current || !texture) return;

    const timeline = gsap.timeline();
    particleInteractAnimation?.(timeline, spriteRef.current);
    if (props.width && props.height) {
      timeline.to(spriteRef.current, {
        pixi: {
          width: props.width,
          height: props.height,
        },
        duration: 0.1,
      });
    }
  });

  return (
    <pixiSprite
      {...props}
      interactive={isInteractable}
      texture={texture}
      visible={!!texture}
      ref={spriteRef}
      onClick={handleInteract}
    />
  );
};
