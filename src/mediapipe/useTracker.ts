import { useEffect, useRef, useState, type RefObject } from 'react';
import { HandLandmarker, PoseLandmarker } from '@mediapipe/tasks-vision';
import type { Mode } from '../i18n/translations';
import type { TrackerKind } from './config';
import { createHandLandmarker, createPoseLandmarker } from './loader';
import { drawHands, drawPose } from './draw';

type Tracker =
  | { kind: 'pose'; instance: PoseLandmarker }
  | { kind: 'hands'; instance: HandLandmarker };

function trackerKindFor(mode: Mode): TrackerKind {
  return mode === 'elbow' ? 'pose' : 'hands';
}

type Options = {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  mode: Mode;
  enabled: boolean;
};

export type UseTrackerResult = {
  kind: TrackerKind;
  landmarkCount: number;
  ready: boolean;
};

export function useTracker({ videoRef, canvasRef, mode, enabled }: Options): UseTrackerResult {
  const desiredKind = trackerKindFor(mode);
  const trackerRef = useRef<Tracker | null>(null);
  const [ready, setReady] = useState(false);
  const [landmarkCount, setLandmarkCount] = useState(0);

  // (Re)create tracker when desired kind changes or when enabled flips on.
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setReady(false);
    setLandmarkCount(0);

    (async () => {
      // close prior tracker before swapping
      const prev = trackerRef.current;
      if (prev) {
        prev.instance.close();
        trackerRef.current = null;
      }

      try {
        if (desiredKind === 'pose') {
          const instance = await createPoseLandmarker();
          if (cancelled) {
            instance.close();
            return;
          }
          trackerRef.current = { kind: 'pose', instance };
        } else {
          const instance = await createHandLandmarker();
          if (cancelled) {
            instance.close();
            return;
          }
          trackerRef.current = { kind: 'hands', instance };
        }
        setReady(true);
      } catch (err) {
        console.error('[mediapipe] failed to create tracker', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [desiredKind, enabled]);

  // Detection loop. Runs while enabled; reads videoRef/canvasRef each frame
  // so callers don't need to retrigger on ref changes.
  useEffect(() => {
    if (!enabled) return;

    let active = true;
    let rafId = 0;
    let lastTs = -1;

    const tick = () => {
      if (!active) return;
      rafId = requestAnimationFrame(tick);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const tracker = trackerRef.current;
      if (!video || !canvas || !tracker) return;
      if (video.readyState < 2 || video.videoWidth === 0) return;

      if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
      if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const ts = performance.now();
      if (ts === lastTs) return;
      lastTs = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let count = 0;
      if (tracker.kind === 'pose') {
        const res = tracker.instance.detectForVideo(video, ts);
        count = drawPose(ctx, res);
      } else {
        const res = tracker.instance.detectForVideo(video, ts);
        count = drawHands(ctx, res);
      }
      setLandmarkCount(count);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(rafId);
    };
  }, [enabled, videoRef, canvasRef]);

  // Clean up on unmount.
  useEffect(() => {
    return () => {
      const t = trackerRef.current;
      if (t) {
        t.instance.close();
        trackerRef.current = null;
      }
    };
  }, []);

  return { kind: desiredKind, landmarkCount, ready };
}
