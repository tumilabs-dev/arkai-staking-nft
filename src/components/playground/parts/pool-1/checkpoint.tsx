import { Container, Graphics, TextStyle } from "pixi.js";
import { LayerPositions } from "../../constants/LayerPosition.enum";
import { PixiSpriteWithTexture } from "../commons/PixiSpriteWithTexture";

import Checkpoint_Checked from "@/assets/pool/maps/pool-1/shared/checkpoint-checked.png";
import Checkpoint_Current from "@/assets/pool/maps/pool-1/shared/checkpoint-current.png";
import Checkpoint_Image from "@/assets/pool/maps/pool-1/shared/checkpoint.png";

import PaperScroll from "@/assets/objects/paper-scroll.png";
import Current_Point from "@/assets/pool/maps/pool-1/shared/current-point.png";
import { useGetCurrentPool } from "@/hooks/pools/useGetCurrentPool";
import {
  ERewardType,
  IPoolReward,
  useGetPoolRewards,
} from "@/hooks/pools/useGetPoolRewards";
import { parseValueToDisplay } from "@/lib/parseValue";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMemo, useRef, useState } from "react";
import { particleEntryAnimation } from "../../animations/particleEntry.animation";

import Treasure_Closed from "@/assets/objects/treasure-close.png";
import Treasure_Open from "@/assets/objects/treasure-open.png";

// First checkpoint position (manually provided)
const FIRST_CHECKPOINT_POSITION = {
  x: 900.61,
  y: 872.77,
  width: 62,
  height: 63,
};

// SVG path data from Checkpoint_Path - the main path (4th path element)
const Checkpoint_Path =
  "M555.052 641.556C566.718 593.889 570.051 498.056 490.051 496.056C390.051 493.556 366.551 514.556 309.051 562.056C251.551 609.556 195.051 631.556 120.051 611.056C45.0515 590.556 20.5515 536.556 29.5515 451.556C38.5515 366.556 178.552 356.056 209.052 363.556C233.452 369.556 355.552 377.056 413.552 380.056C450.218 381.056 531.452 361.056 563.052 273.056C602.552 163.056 429.552 28.0556 294.552 104.056C159.552 180.056 -17.9483 179.056 2.05167 0.055542";

/**
 * Parse SVG path and convert to points array
 * Handles M (move to) and C (cubic bezier) commands
 */
function parseSvgPath(
  pathData: string,
  segmentsPerCurve: number = 20
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const commands = pathData.match(/[MCL][^MCL]*/g) || [];

  let currentX = 0;
  let currentY = 0;

  for (const command of commands) {
    const type = command[0];
    const coords = command
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    if (type === "M") {
      // Move to
      currentX = coords[0];
      currentY = coords[1];
      points.push({ x: currentX, y: currentY });
    } else if (type === "C") {
      // Cubic Bezier curve: C x1 y1 x2 y2 x y
      // Each C command has 6 numbers (3 coordinate pairs)
      for (let i = 0; i < coords.length; i += 6) {
        const x1 = coords[i];
        const y1 = coords[i + 1];
        const x2 = coords[i + 2];
        const y2 = coords[i + 3];
        const x = coords[i + 4];
        const y = coords[i + 5];

        // Generate points along the bezier curve
        for (let j = 0; j <= segmentsPerCurve; j++) {
          const t = j / segmentsPerCurve;
          const point = bezierPoint(
            { x: currentX, y: currentY },
            { x: x1, y: y1 },
            { x: x2, y: y2 },
            { x, y },
            t
          );
          points.push(point);
        }

        currentX = x;
        currentY = y;
      }
    } else if (type === "L") {
      // Line to
      for (let i = 0; i < coords.length; i += 2) {
        currentX = coords[i];
        currentY = coords[i + 1];
        points.push({ x: currentX, y: currentY });
      }
    }
  }

  return points;
}

/**
 * Calculate a point on a cubic Bezier curve
 */
function bezierPoint(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
  };
}

/**
 * Get point and tangent at a specific distance along the path
 */
function getPointAtDistance(
  points: { x: number; y: number }[],
  distance: number
): { x: number; y: number; angle: number } | null {
  let accumulatedDistance = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    if (segmentLength === 0) continue;

    if (accumulatedDistance + segmentLength >= distance) {
      const t = (distance - accumulatedDistance) / segmentLength;
      const angle = Math.atan2(dy, dx);
      return {
        x: start.x + dx * t,
        y: start.y + dy * t,
        angle,
      };
    }

    accumulatedDistance += segmentLength;
  }

  return null;
}

/**
 * Get total length of the path
 */
function getPathLength(points: { x: number; y: number }[]): number {
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }
  return totalLength;
}

/**
 * Find the closest point on the path to a target coordinate
 * Returns the distance along the path to the closest point
 */
function findClosestPointOnPath(
  points: { x: number; y: number }[],
  targetPoint: { x: number; y: number }
): { distance: number; point: { x: number; y: number } } {
  let minDistance = Infinity;
  let closestDistanceAlongPath = 0;
  let closestPoint = points[0];
  let accumulatedDistance = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    if (segmentLength === 0) continue;

    // Find the closest point on this segment to the target
    const toStart = {
      x: targetPoint.x - start.x,
      y: targetPoint.y - start.y,
    };
    const segmentDir = { x: dx, y: dy };
    const segmentLengthSq = segmentLength * segmentLength;
    const t = Math.max(
      0,
      Math.min(
        1,
        (toStart.x * segmentDir.x + toStart.y * segmentDir.y) / segmentLengthSq
      )
    );

    const pointOnSegment = {
      x: start.x + dx * t,
      y: start.y + dy * t,
    };

    const distanceToTarget = Math.sqrt(
      Math.pow(targetPoint.x - pointOnSegment.x, 2) +
        Math.pow(targetPoint.y - pointOnSegment.y, 2)
    );

    if (distanceToTarget < minDistance) {
      minDistance = distanceToTarget;
      closestDistanceAlongPath = accumulatedDistance + segmentLength * t;
      closestPoint = pointOnSegment;
    }

    accumulatedDistance += segmentLength;
  }

  return {
    distance: closestDistanceAlongPath,
    point: closestPoint,
  };
}

/**
 * Calculate evenly spaced checkpoint positions along the path
 * First checkpoint is at the closest point to firstPoint, remaining checkpoints
 * are evenly spaced from that point to the end of the path
 */
function calculateCheckpointPositions(
  pathPoints: { x: number; y: number }[],
  firstPoint: { x: number; y: number },
  totalCheckpoints: number,
  width: number = 62,
  height: number = 63
): { x: number; y: number; width: number; height: number }[] {
  if (pathPoints.length < 2) {
    return [];
  }

  // Find the closest point on the path to the first checkpoint position
  const { distance: firstCheckpointDistance } = findClosestPointOnPath(
    pathPoints,
    firstPoint
  );

  // Get the total path length
  const totalPathLength = getPathLength(pathPoints);

  // Calculate the remaining path length from first checkpoint to end
  const remainingPathLength = totalPathLength - firstCheckpointDistance;

  // Handle edge case: if path is too short or first point is at/near the end
  if (remainingPathLength <= 0 || totalCheckpoints < 1) {
    // Return just the first checkpoint
    const firstPointOnPath = getPointAtDistance(
      pathPoints,
      firstCheckpointDistance
    );
    if (!firstPointOnPath) {
      return [];
    }
    return [
      {
        x: firstPointOnPath.x - width / 2,
        y: firstPointOnPath.y - height / 2,
        width,
        height,
      },
    ];
  }

  const positions: { x: number; y: number; width: number; height: number }[] =
    [];

  // Calculate positions for all checkpoints
  for (let i = 0; i < totalCheckpoints; i++) {
    let distanceAlongPath: number;

    if (i === 0) {
      // First checkpoint at the closest point to the provided position
      distanceAlongPath = firstCheckpointDistance;
    } else if (i === totalCheckpoints - 1) {
      // Last checkpoint exactly at the end of the path
      distanceAlongPath = totalPathLength;
    } else {
      // Evenly spaced checkpoints between first and last
      const segmentLength = remainingPathLength / (totalCheckpoints - 1);
      distanceAlongPath = firstCheckpointDistance + segmentLength * i;
    }

    const point = getPointAtDistance(pathPoints, distanceAlongPath);
    if (point) {
      positions.push({
        x: point.x - width / 2,
        y: point.y - height / 2,
        width,
        height,
      });
    }
  }

  return positions;
}

/**
 * Draw a dashed line through points
 */
async function drawDashedLine(
  graphics: Graphics,
  points: { x: number; y: number }[],
  dashLength: number = 15,
  gapLength: number = 8,
  lineWidth: number = 8
) {
  if (points.length < 2) return;

  // graphics.clear();
  // graphics.lineStyle(lineWidth, 0xffffff, 1);

  const totalLength = getPathLength(points);
  let currentDistance = 0;
  let isDrawing = true;

  while (currentDistance < totalLength) {
    if (isDrawing) {
      const dashEndDistance = Math.min(
        currentDistance + dashLength,
        totalLength
      );

      // Sample points along the dash segment for smoothness
      const dashPoints: { x: number; y: number; angle: number }[] = [];
      const numSamples = Math.max(
        5,
        Math.ceil((dashEndDistance - currentDistance) / 2)
      );

      for (let i = 0; i <= numSamples; i++) {
        const t = i / numSamples;
        const dist = currentDistance + (dashEndDistance - currentDistance) * t;
        const point = getPointAtDistance(points, dist);
        if (point) {
          dashPoints.push(point);
        }
      }

      if (dashPoints.length >= 2) {
        // Draw the dash
        graphics.moveTo(dashPoints[0].x, dashPoints[0].y);
        for (let i = 1; i < dashPoints.length; i++) {
          graphics.lineTo(dashPoints[i].x, dashPoints[i].y);
        }
      }

      currentDistance += dashLength;
      isDrawing = false;
    } else {
      // Skip the gap
      currentDistance += gapLength;
      isDrawing = true;
      // graphics.closePath();
    }
  }
  graphics.fill("#ffffff").stroke({
    color: "#ffffff",
    width: lineWidth,
    cap: "round",
  });
  // .setSize(585.52, 669.99);
}

export default function Checkpoint() {
  // Parse the SVG path from Checkpoint_Path
  const pathPoints = parseSvgPath(Checkpoint_Path, 20);

  // Get All the rewards for the current pool
  const { data: currentPool, isLoading: isCurrentPoolLoading } =
    useGetCurrentPool();
  const { data: poolReward, isLoading: isPoolRewardsLoading } =
    useGetPoolRewards({
      poolId: currentPool?.poolId,
    });

  // Calculate checkpoint positions dynamically based on the path
  const allWeeks = Array.from(
    new Set(poolReward?.rewards?.map((reward) => reward.weekNumber))
  );

  const checkpoint_positions = calculateCheckpointPositions(
    pathPoints,
    FIRST_CHECKPOINT_POSITION,
    allWeeks.length ?? 0
  );

  // Ensure currentPoint is within valid bounds
  const safeCurrentPoint = useMemo(() => {
    if ((poolReward?.weekHeld ?? 0) === 0) return 0;
    for (let i = 0; i < allWeeks.length; i++) {
      if (allWeeks[i] === poolReward?.weekHeld) return i;
      if (allWeeks[i] < (poolReward?.weekHeld ?? 0)) continue;
    }
    return allWeeks.length - 1;
  }, [poolReward, allWeeks]);

  const lastCheckpoint = checkpoint_positions.at(-1);

  const graphicsRef = useRef<Graphics>(null);

  useGSAP(
    () => {
      if (isCurrentPoolLoading || isPoolRewardsLoading) return;
      if (!graphicsRef.current) return;
      if (!poolReward?.rewards?.length) return;
      if (!lastCheckpoint) return;
      gsap.context(() => {
        gsap.fromTo(
          graphicsRef.current,
          {
            pixi: {
              alpha: 0,
              y: lastCheckpoint.y + lastCheckpoint.height / 2 - 15,
            },
            duration: 1.5,
            ease: "power2.out",
          },
          {
            pixi: {
              alpha: 1,
              y: lastCheckpoint.y + lastCheckpoint.height / 2 + 15,
            },
            duration: 5,
            ease: "power2.out",
          }
        );
      });
    },
    {
      scope: graphicsRef,
      dependencies: [
        pathPoints,
        poolReward?.rewards?.length,
        lastCheckpoint,
        isCurrentPoolLoading,
        isPoolRewardsLoading,
      ],
    }
  );

  if (
    isCurrentPoolLoading ||
    isPoolRewardsLoading ||
    !checkpoint_positions.length ||
    safeCurrentPoint === -1
  )
    return null;

  return (
    <pixiContainer
      zIndex={LayerPositions.GROUND}
      visible={true}
      x={300.61 + 62 / 2}
      y={234.77 + 63 / 2}
    >
      <pixiGraphics
        draw={(g: Graphics) => {
          drawDashedLine(g, pathPoints, 45, 45);
        }}
        ref={graphicsRef}
      />
      {checkpoint_positions.map((position, index) => (
        <CheckpointItem
          key={`Position-${index}`}
          canClaim={safeCurrentPoint >= index}
          position={position}
          isCurrentPoint={index === safeCurrentPoint}
          rewards={
            poolReward?.rewards?.filter(
              (reward) => allWeeks[index] === reward.weekNumber
            ) ?? []
          }
        />
      ))}
    </pixiContainer>
  );
}

export function CheckpointItem({
  canClaim,
  position,
  isCurrentPoint = false,
  rewards,
}: {
  canClaim: boolean;
  position: { x: number; y: number; width: number; height: number };
  isCurrentPoint?: boolean;
  rewards?: IPoolReward["rewards"];
}) {
  console.log(rewards);
  const containerRef = useRef<Container>(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);

  const handleClickDetail = () => {
    gsap.context(() => {
      if (isOpenDetail) {
        gsap.to(containerRef.current, {
          pixi: {
            alpha: 0,
          },
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            setIsOpenDetail(false);
          },
        });
      } else {
        setIsOpenDetail(true);
        gsap.set(containerRef.current, {
          pixi: {
            alpha: 0,
          },
          ease: "power2.out",
        });
        gsap.to(containerRef.current, {
          pixi: {
            alpha: 1,
          },
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }, containerRef);
  };

  const handleHover = (isHover: boolean) => {
    if (isHover) {
      gsap.to(containerRef.current, {
        pixi: {
          scale: 1.1,
        },
        duration: 0.2,
        ease: "power2.in",
      });
    } else {
      gsap.to(containerRef.current, {
        pixi: {
          scale: 1,
        },
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  return (
    <>
      <PixiSpriteWithTexture
        asset={
          isCurrentPoint
            ? Checkpoint_Current
            : canClaim
            ? Checkpoint_Checked
            : Checkpoint_Image
        }
        x={position.x}
        y={position.y}
        zIndex={LayerPositions.GROUND}
        onClick={handleClickDetail}
        initAnimation={(timeline, sprite, onComplete) =>
          particleEntryAnimation(timeline, sprite, onComplete)
        }
      />

      {isCurrentPoint && (
        <PixiSpriteWithTexture
          asset={Current_Point}
          x={position.x + position.width / 2 - 3}
          y={position.y + 5}
          zIndex={LayerPositions.GROUND}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(timeline, sprite, onComplete)
          }
          anchor={{ x: 0.5, y: 0.5 }}
          onClick={handleClickDetail}
        />
      )}

      <pixiContainer
        x={position.x + 150}
        y={position.y + 20}
        ref={containerRef}
        visible={isOpenDetail}
        interactive={true}
        onMouseEnter={() => handleHover(true)}
        onMouseLeave={() => handleHover(false)}
      >
        <PixiSpriteWithTexture
          asset={PaperScroll}
          x={0}
          y={0}
          width={200}
          height={130}
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={LayerPositions.GROUND}
          isInteractable={false}
        />
        {rewards?.map((reward, index, arr) => (
          <pixiBitmapText
            key={`Reward-${reward.id}`}
            text={getRewardText(reward)}
            x={0}
            y={(arr.length === 1 ? 1 : index) * 20 - 40.5}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={LayerPositions.GROUND + 1}
            style={
              new TextStyle({
                fontSize: 16,
                fill: 0x50352c,
                fontFamily: "Crayon",
              })
            }
          />
        ))}
        <PixiSpriteWithTexture
          asset={canClaim ? Treasure_Open : Treasure_Closed}
          x={80}
          y={-65}
          width={64}
          height={64}
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={LayerPositions.GROUND + 1}
          isInteractable={false}
        />

        {/* <pixiBitmapText
          text={canClaim ? "Claim" : ""}
          x={0}
          y={20}
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={LayerPositions.GROUND + 1}
          style={
            new TextStyle({
              fontSize: 16,
              fill: canClaim ? 0xffffff : 0x50352c,
              fontFamily: "Crayon",
            })
          }
        /> */}
      </pixiContainer>
    </>
  );
}

function getRewardText(reward: IPoolReward["rewards"][0]) {
  switch (reward.rewardType) {
    case ERewardType.TOKEN:
      return `${parseValueToDisplay(reward.rewardValue)} $MOVE`;
    case ERewardType.NFT:
      return `${reward.rewardValue} Arkai NFT`;
    case ERewardType.ROLE:
      return `${reward.rewardValue}`;
    default:
      return reward.rewardType;
  }
}
