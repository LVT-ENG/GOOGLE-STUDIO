import React, { useRef, useEffect, useState } from 'react';
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

// Define the structure for the measurements we want to capture
interface BodyMeasurements {
  height: number;
  shoulderWidth: number;
  chest: number;
  waist: number;
  hips: number;
  legLength: number;
  torsoLength: number;
}

interface BodyScanProps {
  onScanComplete: (measurements: BodyMeasurements) => void;
}

// Helper function for vector calculations
const calculateDistance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

const BodyScan: React.FC<BodyScanProps> = ({ onScanComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusText, setStatusText] = useState('Initializing AI model...');
  const [scanTriggered, setScanTriggered] = useState(false);

  let lastVideoTime = -1;
  let animationFrameId: number;

  useEffect(() => {
    const createPoseLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
        const newPoseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task`,
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numPoses: 1
        });
        setPoseLandmarker(newPoseLandmarker);
        setStatusText('Waiting for camera access...');
        setupCamera();
      } catch (error) {
        console.error("Error initializing PoseLandmarker: ", error);
        setStatusText('Error loading AI model. Please refresh.');
      }
    };
    createPoseLandmarker();

    return () => {
        cancelAnimationFrame(animationFrameId);
    }
  }, []);

  const setupCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatusText('Camera not available on this device.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', () => {
          setIsLoading(false);
          setStatusText('Place your full body in the center of the frame.');
          predictWebcam();
        });
      }
    } catch (error) {
      console.error("Error accessing camera: ", error);
      setStatusText('Camera access denied. Please enable camera permissions.');
    }
  };

  const predictWebcam = () => {
    if (!poseLandmarker || !videoRef.current || scanTriggered) return;

    const video = videoRef.current;
    if (video.readyState < 2) {
        animationFrameId = requestAnimationFrame(predictWebcam);
        return;
    }

    if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        const results = poseLandmarker.detectForVideo(video, performance.now());

        const canvas = canvasRef.current;
        const canvasCtx = canvas?.getContext('2d');

        if (canvas && canvasCtx) {
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            const drawingUtils = new DrawingUtils(canvasCtx);
            if (results.landmarks && results.landmarks.length > 0) {
                const landmarks = results.landmarks[0];

                // Draw stylized connectors
                drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: '#c5a059', lineWidth: 2 });

                // Calculate and capture measurements
                const p = landmarks.map(lm => ({ x: lm.x * canvas.width, y: lm.y * canvas.height }));

                const shoulderLeft = p[11];
                const shoulderRight = p[12];
                const hipLeft = p[23];
                const hipRight = p[24];
                const ankleLeft = p[27];
                const ankleRight = p[28];
                const footIndexLeft = p[31];

                // Simple stability check: user must be mostly upright
                if (shoulderLeft.y < hipLeft.y && footIndexLeft.y > hipLeft.y) {
                    const shoulderWidth = calculateDistance(shoulderLeft, shoulderRight);
                    const waistWidth = calculateDistance({x: (hipLeft.x + shoulderLeft.x)/2, y: (hipLeft.y + shoulderLeft.y)/2}, {x: (hipRight.x + shoulderRight.x)/2, y: (hipRight.y + shoulderRight.y)/2});
                    const hipsWidth = calculateDistance(hipLeft, hipRight);
                    const torsoHeight = calculateDistance({x: (shoulderLeft.x + shoulderRight.x)/2, y: (shoulderLeft.y + shoulderRight.y)/2}, {x: (hipLeft.x + hipRight.x)/2, y: (hipLeft.y + hipRight.y)/2});
                    const legHeight = calculateDistance(hipLeft, ankleLeft);

                    // Convert pixel distances to cm (this is a rough estimation)
                    // We assume the distance from left to right shoulder is approx 45cm in real life.
                    const pixelToCmRatio = 45 / shoulderWidth;

                    const finalMeasurements: BodyMeasurements = {
                        height: (torsoHeight + legHeight) * pixelToCmRatio,
                        shoulderWidth: shoulderWidth * pixelToCmRatio,
                        chest: (shoulderWidth * 1.2) * pixelToCmRatio, // Approximation
                        waist: waistWidth * pixelToCmRatio,
                        hips: hipsWidth * pixelToCmRatio,
                        legLength: legHeight * pixelToCmRatio,
                        torsoLength: torsoHeight * pixelToCmRatio
                    };

                    setStatusText('Pose captured! Finalizing...');
                    setScanTriggered(true); // Stop the loop
                    setTimeout(() => {
                        onScanComplete(finalMeasurements);
                    }, 1500); // Give user feedback time
                } else {
                    setStatusText('Please stand upright and face the camera.');
                }
            }
        }
    }

    if (!scanTriggered) {
        animationFrameId = requestAnimationFrame(predictWebcam);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '640px', margin: 'auto' }}>
      <div className="status-overlay">{statusText}</div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', transform: 'scaleX(-1)' }} />
      <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
    </div>
  );
};

export default BodyScan;
