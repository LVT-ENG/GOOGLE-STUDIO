
import React, { useState, useEffect } from 'react';
import { Camera, Mic, Scan, CheckCircle, Fingerprint } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const BiometricCapture: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1); // 1: Photos, 2: Iris, 3: Voice
  const [progress, setProgress] = useState(0);

  const steps = [
    { title: "Escaneo Corporal", desc: "4 fotos con folio A4 + mano (360º)", icon: <Camera size={24} /> },
    { title: "Registro AVBET Iris", desc: "Escaneo ocular de alta seguridad", icon: <Scan size={24} /> },
    { title: "Huella Vocal", desc: "Registro de voz para confirmación", icon: <Mic size={24} /> }
  ];

  const handleSimulatedScan = () => {
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (step < 3) {
            setStep(step + 1);
            setProgress(0);
          } else {
            onComplete();
          }
        }, 800);
      }
    }, 30);
  };

  return (
    <div className="max-w-xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom-8">
      <h2 className="text-3xl font-bold text-slate-800">Biometría AVBET</h2>
      
      <div className="flex justify-center gap-4 mb-8">
        {steps.map((s, idx) => (
          <div key={idx} className={`w-1/3 flex flex-col items-center gap-2 ${step === idx + 1 ? 'text-rose-500' : step > idx + 1 ? 'text-green-500' : 'text-slate-300'}`}>
             <div className={`p-4 rounded-full border-2 ${step === idx + 1 ? 'border-rose-500 bg-rose-50' : step > idx + 1 ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
               {step > idx + 1 ? <CheckCircle size={24} /> : s.icon}
             </div>
             <span className="text-xs font-medium">{s.title}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
        {step === 1 && (
          <div className="space-y-6">
            <div className="aspect-[4/3] bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80')] bg-cover opacity-50"></div>
              <div className="relative z-10 text-white flex flex-col items-center">
                <Camera size={48} className="mb-4 animate-pulse" />
                <p className="font-medium">Posiciona tu mano sobre un folio A4</p>
              </div>
              <div className="absolute inset-0 border-[20px] border-black/30 pointer-events-none"></div>
            </div>
            <p className="text-slate-600">El sistema calculará tus medidas exactas mediante referencia escalar.</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="relative h-64 bg-black rounded-xl overflow-hidden flex items-center justify-center">
              <div className="absolute w-full h-1 bg-green-500/50 top-1/2 -translate-y-1/2 animate-scan"></div>
              <Fingerprint size={80} className="text-green-500/80" />
            </div>
            <p className="text-slate-600">Mirando fijamente a la cámara para hash biométrico del iris.</p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
             <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center flex-col gap-4">
               <div className="flex items-center justify-center gap-1 h-16">
                 {[1,2,3,4,5,6,7].map(i => (
                   <div key={i} className="w-3 bg-rose-500 rounded-full animate-bounce" style={{ height: `${Math.random() * 40 + 20}px`, animationDelay: `${i * 0.1}s` }}></div>
                 ))}
               </div>
               <p className="font-medium text-slate-800">Di: "Yo autorizo el pago AVBET"</p>
             </div>
          </div>
        )}

        <div className="mt-8">
          <button 
            onClick={handleSimulatedScan}
            disabled={progress > 0 && progress < 100}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {progress > 0 ? `Procesando... ${progress}%` : step === 3 ? "Registrar Voz" : "Escanear"}
          </button>
        </div>
      </div>
    </div>
  );
};
