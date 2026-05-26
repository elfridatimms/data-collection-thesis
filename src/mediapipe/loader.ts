import { FilesetResolver, HandLandmarker, PoseLandmarker } from '@mediapipe/tasks-vision';
import { HAND_MODEL_URL, POSE_MODEL_URL, WASM_BASE } from './config';

type Vision = Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>;

let visionPromise: Promise<Vision> | null = null;

function getVision(): Promise<Vision> {
  if (!visionPromise) {
    visionPromise = FilesetResolver.forVisionTasks(WASM_BASE);
  }
  return visionPromise;
}

export async function createPoseLandmarker(): Promise<PoseLandmarker> {
  const vision = await getVision();
  return PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: POSE_MODEL_URL,
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numPoses: 1,
  });
}

export async function createHandLandmarker(): Promise<HandLandmarker> {
  const vision = await getVision();
  return HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: HAND_MODEL_URL,
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numHands: 2,
  });
}
