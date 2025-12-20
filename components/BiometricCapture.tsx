
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Scan, CheckCircle, Fingerprint, AlertCircle, Zap } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const BiometricCapture: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1); 
  const [progress, setProgress] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const steps = [
    { title: "Escaneo Corporal", desc: "4 fotos con folio A4 + mano (360º)", icon: <Camera size={24} /> },
    { title: "Registro AVBET Iris", desc: "Escaneo ocular de alta seguridad", icon: <Scan size={24} /> },
    { title: "Huella Vocal", desc: "Registro de voz para confirmación", icon: <Mic size={24} /> }
  ];

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      setCameraError(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(true);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleSimulatedScan = () => {
    if ((step === 1 || step === 2) && !isCameraActive) {
      startCamera();
      return;
    }

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
            if (step + 1 === 3) stopCamera(); // Stop camera for voice step
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
             <div className={`p-4 rounded-full border-2 transition-all duration-500 ${step === idx + 1 ? 'border-rose-500 bg-rose-50 scale-110 shadow-lg' : step > idx + 1 ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
               {step > idx + 1 ? <CheckCircle size={24} /> : s.icon}
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest">{s.title}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-200 relative overflow-hidden">
        {(step === 1 || step === 2) && (
          <div className="space-y-6">
            <div className="aspect-[4/3] bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border-4 border-slate-800 shadow-inner">
              {!isCameraActive ? (
                <div className="flex flex-col items-center justify-center text-slate-500 p-8 space-y-4">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
                    <Camera size={32} />
                  </div>
                  <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Cámara en espera</p>
                </div>
              ) : cameraError ? (
                <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center text-slate-400 p-6">
                  <AlertCircle size={48} className="mb-4 text-rose-500" />
                  <p className="font-bold text-white uppercase tracking-widest">Error de Dispositivo</p>
                  <p className="text-xs text-slate-500 mt-2">Active los permisos de cámara para continuar.</p>
                </div>
              ) : (
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              
              <div className="relative z-10 pointer-events-none">
                {step === 1 && isCameraActive && (
                  <div className="flex flex-col items-center text-white/50">
                    <div className="border-2 border-dashed border-white/30 p-24 rounded-[3rem]"></div>
                    <p className="font-bold text-[10px] uppercase tracking-[0.4em] mt-4">Escaneo Corporal JIT</p>
                  </div>
                )}
                {step === 2 && isCameraActive && (
                  <div className="w-56 h-56 border-2 border-green-500/30 rounded-full flex items-center justify-center relative overflow-hidden">
                    <div className="w-full h-1 bg-green-500/50 absolute top-1/2 left-0 animate-scan"></div>
                    <Scan size={80} className="text-green-500/50" />
                  </div>
                )}
              </div>
              
              {progress > 0 && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-20">
                   <div className="text-white">
                      <div className="w-20 h-20 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                      <p className="font-black text-4xl tracking-tighter">{progress}%</p>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-2">Sincronizando hash</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
             <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center flex-col gap-6 shadow-inner border border-slate-100">
               <div className="flex items-end justify-center gap-1.5 h-20">
                 {[1,2,3,4,5,6,7,8,9,10].map(i => (
                   <div key={i} className={`w-2.5 bg-rose-500 rounded-full transition-all duration-300 ${progress > 0 ? 'animate-bounce' : 'h-4 opacity-20'}`} style={{ height: progress > 0 ? `${Math.random() * 60 + 20}px` : '16px', animationDelay: `${i * 0.05}s` }}></div>
                 ))}
               </div>
               <div className="text-center px-10">
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Frase de Seguridad AVBET</p>
                 <p className="text-xl font-bold text-slate-800 italic leading-tight">"Yo autorizo el protocolo de pago biométrico AVBET para mi armario inteligente."</p>
               </div>
             </div>
          </div>
        )}

        <div className="mt-8">
          <button 
            onClick={handleSimulatedScan}
            disabled={progress > 0 && progress < 100}
            className={`w-full py-5 rounded-2xl font-bold text-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
              (!isCameraActive && step < 3) 
              ? "bg-slate-900 text-white hover:bg-rose-600" 
              : "bg-slate-100 text-slate-800 hover:bg-slate-200"
            }`}
          >
            {progress > 0 ? (
              <>Mapeando...</>
            ) : (!isCameraActive && step < 3) ? (
              <><Zap size={24} /> Activar Escáner</>
            ) : step === 3 ? (
              <><Mic size={24} /> Validar Huella Vocal</>
            ) : (
              <><Camera size={24} /> Capturar Referencia</>
            )}
          </button>
        </div>
      </div>
      <p className="text-xs text-slate-400 font-medium">Sus datos están protegidos por el protocolo Ultimátum EPCT.</p>
    </div>
  );
};
