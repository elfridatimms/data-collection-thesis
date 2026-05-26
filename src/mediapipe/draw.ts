import {
  DrawingUtils,
  HandLandmarker,
  PoseLandmarker,
  type HandLandmarkerResult,
  type PoseLandmarkerResult,
} from '@mediapipe/tasks-vision';

const POSE_CONNECTOR_STYLE = { color: '#60a5fa', lineWidth: 3 };
const POSE_LANDMARK_STYLE = { color: '#a78bfa', lineWidth: 1, radius: 4 };
const HAND_CONNECTOR_STYLE = { color: '#60a5fa', lineWidth: 2 };
const HAND_LANDMARK_STYLE = { color: '#a78bfa', lineWidth: 1, radius: 3 };

export function drawPose(
  ctx: CanvasRenderingContext2D,
  result: PoseLandmarkerResult,
): number {
  const utils = new DrawingUtils(ctx);
  let count = 0;
  for (const lms of result.landmarks) {
    utils.drawConnectors(lms, PoseLandmarker.POSE_CONNECTIONS, POSE_CONNECTOR_STYLE);
    utils.drawLandmarks(lms, POSE_LANDMARK_STYLE);
    count += lms.length;
  }
  return count;
}

export function drawHands(
  ctx: CanvasRenderingContext2D,
  result: HandLandmarkerResult,
): number {
  const utils = new DrawingUtils(ctx);
  let count = 0;
  for (const lms of result.landmarks) {
    utils.drawConnectors(lms, HandLandmarker.HAND_CONNECTIONS, HAND_CONNECTOR_STYLE);
    utils.drawLandmarks(lms, HAND_LANDMARK_STYLE);
    count += lms.length;
  }
  return count;
}
