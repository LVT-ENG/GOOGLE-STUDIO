import React from 'react';
import { motion } from 'framer-motion';

// Define the structure for the recommended garment
interface Garment {
  id: string;
  meta: {
    name: string;
    brand: string;
    image_url: string;
  };
  // Add other properties as needed
}

interface ResultDisplayProps {
  recommendation: Garment;
  explanation: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ recommendation, explanation }) => {
  if (!recommendation) {
    return <div>Loading your recommendation...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-4xl bg-gray-900 p-8 rounded-lg flex flex-col md:flex-row gap-8 items-center"
    >
      {/* Garment Image */}
      <div className="w-full md:w-1/2">
        <img
          src={recommendation.meta.image_url}
          alt={recommendation.meta.name}
          className="rounded-lg w-full object-cover shadow-lg"
        />
      </div>

      {/* Recommendation Details */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <p className="text-gold text-lg">THE PERFECT FIT FOR YOU</p>
        <h2 className="text-4xl font-bold my-2">{recommendation.meta.name}</h2>
        <h3 className="text-xl text-gray-400 mb-6">{recommendation.meta.brand}</h3>

        <div className="bg-dark p-4 rounded-lg border border-gray-700">
            <h4 className="font-bold text-lg mb-2">Why it fits:</h4>
            <p className="text-gray-300">{explanation}</p>
        </div>

        <button className="mt-8 bg-gold text-dark font-bold py-3 px-8 text-lg rounded-md hover:bg-yellow-500 transition-colors duration-300">
          More Details
        </button>
      </div>
    </motion.div>
  );
};

export default ResultDisplay;
