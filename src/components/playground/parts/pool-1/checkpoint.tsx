import { Graphics } from "pixi.js";
import { LayerPositions } from "../../constants/LayerPosition.enum";
import { PixiSpriteWithTexture } from "../commons/PixiSpriteWithTexture";

import Checkpoint_Image from "@/assets/pool/maps/pool-1/shared/checkpoint.png";
import { particleEntryAnimation } from "../../animations/particleEntry.animation";

import gsap from "gsap";

const checkpoint_positions = [
  { x: 880, y: 872.63, width: 62, height: 63 },
  { x: 783.5, y: 728.89, width: 62, height: 63 },
  { x: 604.58, y: 793.59, width: 62, height: 63 },
  { x: 417.74, y: 840.34, width: 62, height: 63 },
  { x: 324.74, y: 684.07, width: 62, height: 63 },
  { x: 504.28, y: 595.32, width: 62, height: 63 },
  { x: 709.65, y: 613.04, width: 62, height: 63 },
  { x: 856.33, y: 513.39, width: 62, height: 63 },
  { x: 773.03, y: 343.65, width: 62, height: 63 },
  { x: 589.64, y: 340.62, width: 62, height: 63 },
  { x: 394.21, y: 378.83, width: 62, height: 63 },
  { x: 300.61, y: 234.77, width: 62, height: 63 },
];

/**
 * Catmull-Rom spline interpolation
 * @param p0 First control point
 * @param p1 Second control point (start)
 * @param p2 Third control point (end)
 * @param p3 Fourth control point
 * @param t Interpolation parameter (0 to 1)
 * @returns Interpolated point
 */
function catmullRom(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

/**
 * Generate smooth curve points using Catmull-Rom spline
 */
function generateSplinePoints(
  points: { x: number; y: number }[],
  segmentsPerCurve: number = 20
): { x: number; y: number }[] {
  if (points.length < 2) return points;
  if (points.length === 2) return points;

  const splinePoints: { x: number; y: number }[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    // Get control points for Catmull-Rom
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : points[i + 1];

    // Generate points along the curve
    // For all segments except the last, exclude the final point (t=1) to avoid duplicates
    const isLastSegment = i === points.length - 2;
    const maxJ = isLastSegment ? segmentsPerCurve : segmentsPerCurve - 1;

    for (let j = 0; j <= maxJ; j++) {
      const t = j / segmentsPerCurve;
      const point = catmullRom(p0, p1, p2, p3, t);
      splinePoints.push(point);
    }
  }

  return splinePoints;
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
 * Draw a dashed line with rounded dashes through points
 */
async function drawDashedLine(
  graphics: Graphics,
  points: { x: number; y: number }[],
  dashLength: number = 15,
  gapLength: number = 8,
  lineWidth: number = 8
) {
  if (points.length < 2) return;

  graphics.clear();

  const totalLength = getPathLength(points);
  let currentDistance = 0;
  let isDrawing = true;
  const radius = lineWidth / 2;

  await new Promise((resolve) => setTimeout(resolve, 1000));

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
        // Draw the dash as a rounded path following the curve
        const startPoint = dashPoints[0];
        const endPoint = dashPoints[dashPoints.length - 1];
        const startAngle = startPoint.angle;
        const endAngle = endPoint.angle;

        // Calculate perpendicular angles for the caps
        const startPerpTop = startAngle + Math.PI;
        const startPerpBottom = startAngle - Math.PI;
        const endPerpTop = endAngle + Math.PI / 2;
        const endPerpBottom = endAngle - Math.PI / 2;

        // Start at the top of the start cap
        const startTopX = startPoint.x + Math.cos(startPerpTop) * radius;
        const startTopY = startPoint.y + Math.sin(startPerpTop) * radius;
        graphics.moveTo(startTopX, startTopY);

        // Draw rounded start cap (top half)
        graphics.arc(
          startPoint.x,
          startPoint.y,
          radius,
          startPerpTop,
          startPerpBottom,
          true
        );

        // Draw the top side following the curve
        for (let i = 1; i < dashPoints.length; i++) {
          const p = dashPoints[i];
          const perp = p.angle + Math.PI / 2;
          const topX = p.x + Math.cos(perp) * radius;
          const topY = p.y + Math.sin(perp) * radius;
          graphics.lineTo(topX, topY);
        }

        // Draw rounded end cap (top half)
        graphics.arc(
          endPoint.x,
          endPoint.y,
          radius,
          endPerpTop,
          endPerpBottom,
          true
        );

        // Draw the bottom side back following the curve
        for (let i = dashPoints.length - 2; i >= 0; i--) {
          const p = dashPoints[i];
          const perp = p.angle - Math.PI / 2;
          const bottomX = p.x + Math.cos(perp) * radius;
          const bottomY = p.y + Math.sin(perp) * radius;
          graphics.lineTo(bottomX, bottomY);
        }

        graphics.closePath();
      }

      currentDistance += dashLength;

      await gsap.to(graphics, {
        fill: "#ffffff",
        duration: 0.02,
        ease: "power2.out",
      });

      isDrawing = false;
    } else {
      // Skip the gap
      currentDistance += gapLength;
      isDrawing = true;
    }
  }
}

export default function Checkpoint() {
  // Center the points before generating spline
  const centeredPoints = checkpoint_positions.map((pos) => ({
    x: pos.x + pos.width / 2,
    y: pos.y + pos.height / 2,
  }));
  const splinePoints = generateSplinePoints(centeredPoints, 120);

  return (
    <>
      <pixiGraphics
        zIndex={LayerPositions.GROUND}
        draw={(g: Graphics) => {
          drawDashedLine(g, splinePoints, 20, 16);
        }}
      />
      {checkpoint_positions.map((position, index, arr) => (
        <PixiSpriteWithTexture
          key={`Position-${position.x}-${position.y}`}
          asset={Checkpoint_Image}
          x={position.x}
          y={position.y}
          zIndex={LayerPositions.GROUND}
          visible={true}
          interactive={true}
          initAnimation={(timeline, sprite, onComplete) =>
            particleEntryAnimation(timeline, sprite, onComplete, index * 0.1)
          }
        />
      ))}
    </>
  );
}
