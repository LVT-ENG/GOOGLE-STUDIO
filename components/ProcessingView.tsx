
import React, { useEffect, useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';

export const ProcessingView = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const steps = [
    "Analyse de la posture corporelle...",
    "Segmentation du vêtement...",
    "Ajustement de l'éclairage et des ombres...",
    "Génération du rendu final..."
  ];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 40); // 4 seconds total approx

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const stepDuration = 1000;
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, stepDuration);
    return () => clearInterval(stepTimer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div 
          className="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent animate-spin"
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-rose-500">
          <Wand2 size={40} className="animate-pulse" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-slate-800 mb-2">La magie opère</h3>
      
      <div className="h-8 mb-6 overflow-hidden relative w-full max-w-md text-center">
        {steps.map((step, idx) => (
          <p 
            key={idx}
            className={`absolute w-full transition-all duration-500 text-slate-500 font-medium ${
              idx === currentStep ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            {step}
          </p>
        ))}
      </div>

      <div className="w-full max-w-md bg-slate-100 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-rose-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-slate-400 mt-2 font-medium">{progress}% Terminé</p>
    </div>
  );
};
