import React, { useState } from 'react';
import BodyScan from '../components/BodyScan';
import UserInputForm from '../components/UserInputForm';
import ResultDisplay from '../components/ResultDisplay';

// Define structures for data
interface BodyMeasurements {
  height: number;
  shoulderWidth: number;
  chest: number;
  waist: number;
  hips: number;
  legLength: number;
  torsoLength: number;
}

interface UserPreferences {
  occasion: string;
  fit: string;
}

interface Garment {
  id: string;
  meta: {
    name: string;
    brand: string;
    image_url: string;
  };
}

const Demo = () => {
  const [step, setStep] = useState('scan'); // 'scan', 'input', 'result'
  const [measurements, setMeasurements] = useState<BodyMeasurements | null>(null);
  const [recommendation, setRecommendation] = useState<Garment | null>(null);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');

  const handleScanComplete = (capturedMeasurements: BodyMeasurements) => {
    setMeasurements(capturedMeasurements);
    setStep('input');
  };

  const handleFormSubmit = async (submission: { measurements: { weight: number }, preferences: UserPreferences }) => {
    if (!measurements) {
        setError("Scan data is missing.");
        return;
    }

    const finalPayload = {
      measurements: { ...measurements, weight: submission.measurements.weight },
      preferences: submission.preferences
    };

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });

      const data = await response.json();

      if (data.ok) {
        setRecommendation(data.recommendation);
        setExplanation(data.explanation);
        setStep('result');
      } else {
        setError(data.error || "An unknown error occurred.");
      }
    } catch (err) {
      setError("Failed to connect to the recommendation engine.");
      console.error(err);
    }
  };

  const renderStep = () => {
    if (error) {
      return <div className="text-red-500 text-center">
        <h2 className="text-2xl font-bold mb-4">An Error Occurred</h2>
        <p>{error}</p>
        <button onClick={() => setStep('scan')} className="mt-4 bg-gold text-dark font-bold py-2 px-6">Try Again</button>
      </div>
    }

    switch (step) {
      case 'scan':
        return (
          <>
            <h1 className="text-3xl font-bold mb-4 text-gold">Step 1: Body Scan</h1>
            <p className="mb-8 text-center">Place yourself in the frame to begin the biometric scan.</p>
            <div className="mirror-frame w-full max-w-2xl">
              <BodyScan onScanComplete={handleScanComplete} />
            </div>
          </>
        );
      case 'input':
        return (
          <>
            <h1 className="text-3xl font-bold mb-4 text-gold">Step 2: Confirm Details</h1>
            <p className="mb-8 text-center">Confirm a few details to find your perfect fit.</p>
            {measurements &&
              <UserInputForm initialMeasurements={measurements} onSubmit={handleFormSubmit} />
            }
          </>
        );
      case 'result':
        return (
          <>
            <h1 className="text-3xl font-bold mb-8 text-center text-gold">Your Recommendation is Ready!</h1>
            {recommendation &&
              <ResultDisplay recommendation={recommendation} explanation={explanation} />
            }
          </>
        );
      default:
        return <div>Error: Unknown step</div>;
    }
  };

  return (
    <div className="bg-dark text-white min-h-screen flex flex-col items-center justify-center p-4">
      {renderStep()}
    </div>
  );
};

export default Demo;
