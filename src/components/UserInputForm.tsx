import React, { useState } from 'react';

// Define the structure for the measurements from the scan
interface BodyMeasurements {
  height: number;
  [key: string]: any; // Allow other measurement properties
}

// Define the structure for the final submission data
interface UserSubmission {
  measurements: {
    height: number;
    weight: number;
  };
  preferences: {
    occasion: string;
    fit: string;
  };
}

interface UserInputFormProps {
  initialMeasurements: BodyMeasurements;
  onSubmit: (submission: UserSubmission) => void;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ initialMeasurements, onSubmit }) => {
  const [height, setHeight] = useState(Math.round(initialMeasurements.height));
  const [weight, setWeight] = useState(75); // Default weight
  const [occasion, setOccasion] = useState('casual');
  const [fit, setFit] = useState('regular');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      measurements: { height, weight },
      preferences: { occasion, fit }
    });
  };

  const buttonStyle = "px-6 py-2 rounded-md transition-colors duration-300";
  const activeButtonStyle = "bg-gold text-dark";
  const inactiveButtonStyle = "bg-gray-700 text-white hover:bg-gray-600";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-900 p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Confirm Your Details</h2>

      {/* Height and Weight Sliders */}
      <div className="mb-6">
        <label htmlFor="height" className="block mb-2 text-lg">Height: {height} cm</label>
        <input
          type="range"
          id="height"
          min="140"
          max="220"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <div className="mb-8">
        <label htmlFor="weight" className="block mb-2 text-lg">Weight: {weight} kg</label>
        <input
          type="range"
          id="weight"
          min="40"
          max="150"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Occasion Buttons */}
      <div className="mb-8">
        <p className="text-lg mb-3 text-center">What is the occasion?</p>
        <div className="flex justify-center gap-4">
          {['work', 'event', 'casual', 'ceremony'].map(o => (
            <button
              key={o}
              type="button"
              onClick={() => setOccasion(o)}
              className={`${buttonStyle} ${occasion === o ? activeButtonStyle : inactiveButtonStyle}`}
            >
              {o.charAt(0).toUpperCase() + o.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Fit Preference Buttons */}
      <div className="mb-10">
        <p className="text-lg mb-3 text-center">How do you like your fit?</p>
        <div className="flex justify-center gap-4">
          {['slim', 'regular', 'relaxed'].map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFit(f)}
              className={`${buttonStyle} ${fit === f ? activeButtonStyle : inactiveButtonStyle}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gold text-dark font-bold py-4 px-12 text-lg rounded-md hover:bg-yellow-500 transition-colors duration-300"
      >
        Find My Perfect Fit
      </button>
    </form>
  );
};

export default UserInputForm;
