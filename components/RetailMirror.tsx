
import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, ShoppingBag, Sparkles, X, ChevronRight, Scan, Ruler, UserCheck, ShieldCheck, Zap, Power } from 'lucide-react';
import { INVENTORY_DATABASE } from '../data/inventoryDatabase';
import { DetailedProduct, GarmentMeasurements } from '../types';
import { generateVirtualTryOn } from '../services/geminiService';
import { simulateUserScan, calculatePerfectFit } from '../services/sizingService';

interface Props {
  onExit: () => void;
  onBuy?: (product: DetailedProduct) => void;
}

export const RetailMirror: React.FC<Props> = ({ onExit, onBuy }) => {
  const [selectedProduct, setSelectedProduct] = useState<DetailedProduct | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedLook, setGeneratedLook] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [userMetrics, setUserMetrics] = useState<GarmentMeasurements | null>(null);
  const [fitResult, setFitResult] = useState<{size: string, details: string} | null>(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startVisionSystem = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraStarted(true);
        setCameraError(false);
      }
      
      setTimeout(() => {
        setUserMetrics(simulateUserScan());
      }, 1500);

    } catch (err) {
      console.warn("Camera access denied or unavailable. Entering simulation mode.");
      setCameraError(true);
      setIsCameraStarted(true);
      setUserMetrics(simulateUserScan());
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleProductSelect = (product: DetailedProduct) => {
    if (!isCameraStarted) return;
    setSelectedProduct(product);
    setGeneratedLook(null);
    setFitResult(null);

    if (userMetrics) {
      const fit = calculatePerfectFit(userMetrics, product);
      setFitResult({ size: fit.size, details: fit.matchDetails });
      startCountdown(product, fit.size);
    }
  };

  const startCountdown = (product: DetailedProduct, size: string) => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          processTryOn(product, size);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const processTryOn = async (product: DetailedProduct, size: string) => {
    setIsProcessing(true);
    try {
      const resultImage = await generateVirtualTryOn(
        `${product.name}, ${product.description}`, 
        size
      );
      setGeneratedLook(resultImage);
    } catch (error) {
      console.error("VTO Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const scrollCatalog = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 overflow-hidden z-[60] flex items-center justify-center">
      <div className="relative w-[98vw] h-[98vh] bg-slate-900 rounded-[4rem] border-[16px] border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
        
        <div className="absolute inset-0 z-0 bg-slate-950">
          {!isCameraStarted ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-black p-12 text-center">
               <div className="w-48 h-48 bg-rose-500/10 rounded-full flex items-center justify-center mb-10 border border-rose-500/20 animate-pulse">
                  <Power size={80} className="text-rose-500" />
               </div>
               <h2 className="text-6xl font-bold text-white mb-6 tracking-tighter">Espejo Inteligente <span className="text-rose-500">JIT</span></h2>
               <p className="text-slate-400 text-xl max-w-xl mb-12 font-medium">Active el sistema de visión biométrica para iniciar el calce perfecto.</p>
               <button 
                 onClick={startVisionSystem}
                 className="bg-white text-slate-900 px-16 py-6 rounded-2xl font-bold text-3xl hover:bg-rose-500 hover:text-white transition-all shadow-2xl flex items-center gap-4"
               >
                 <Zap size={32} /> Iniciar Sistema
               </button>
            </div>
          ) : (
            <>
              {cameraError ? (
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=90" 
                  className="w-full h-full object-cover brightness-50 blur-[2px]"
                  alt="Simulation mode"
                />
              ) : (
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-1000 ${generatedLook ? 'opacity-0' : 'opacity-100'}`}
                />
              )}
            </>
          )}
        </div>

        {isCameraStarted && (
          <div className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none p-12 md:p-16">
            <div className="flex justify-between items-start pointer-events-auto">
              <div className="bg-slate-950/60 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
                 <div className="flex items-center gap-3 mb-2">
                   <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping"></div>
                   <h1 className="text-3xl font-bold text-white tracking-tighter">TryOnYou<span className="text-rose-500 italic">.mirror</span></h1>
                 </div>
                 {userMetrics && (
                   <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6">
                     <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-widest">Pecho: {userMetrics.chest}cm</span>
                     <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-widest">Cintura: {userMetrics.waist}cm</span>
                   </div>
                 )}
              </div>
              <button onClick={onExit} className="p-6 bg-white/5 backdrop-blur-2xl rounded-full text-white hover:bg-rose-600 transition-all border border-white/10 shadow-xl">
                <X size={32} />
              </button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {countdown !== null && (
                <div className="flex flex-col items-center">
                  <div className="text-[12rem] font-bold text-white drop-shadow-2xl animate-pulse">
                    {countdown}
                  </div>
                  {fitResult && (
                    <div className="bg-slate-950/80 backdrop-blur-3xl p-10 rounded-[3rem] border-2 border-rose-500 text-center animate-in zoom-in-95 shadow-2xl">
                      <p className="text-rose-400 font-bold uppercase tracking-[0.2em] text-xs mb-3">Talla Detectada</p>
                      <p className="text-7xl font-bold text-white mb-2 tracking-tighter">{fitResult.size}</p>
                      <p className="text-slate-400 text-[10px] uppercase font-mono">{fitResult.details}</p>
                    </div>
                  )}
                </div>
              )}
              {isProcessing && (
                <div className="flex flex-col items-center gap-8 bg-black/60 backdrop-blur-3xl p-16 rounded-[4rem] animate-in zoom-in border border-white/10">
                  <Scan className="w-24 h-24 text-rose-500 animate-pulse" />
                  <span className="text-3xl text-white font-bold tracking-tighter uppercase">Procesando Look...</span>
                </div>
              )}
            </div>

            <div className="pointer-events-auto">
              {generatedLook ? (
                <div className="flex flex-col items-center gap-8 mb-10 animate-in slide-in-from-bottom-10">
                  <div className="flex gap-6">
                    <button 
                      onClick={() => setGeneratedLook(null)}
                      className="bg-white text-slate-900 px-12 py-6 rounded-2xl font-bold text-2xl hover:scale-105 transition-transform flex items-center gap-3 shadow-2xl"
                    >
                      <RefreshCw size={28} /> Otro
                    </button>
                    <button 
                      onClick={() => onBuy && selectedProduct && onBuy(selectedProduct)}
                      className="bg-rose-600 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:scale-105 transition-transform flex items-center gap-3 shadow-2xl border border-rose-400/50"
                    >
                      <ShoppingBag size={28} /> Comprar Ahora
                    </button>
                  </div>
                </div>
              ) : !isProcessing && (
                <div className="relative">
                   <div 
                     ref={scrollRef}
                     className="flex gap-10 overflow-x-auto pb-10 pt-4 px-10 snap-x hide-scrollbar"
                   >
                     {INVENTORY_DATABASE.map((product) => (
                       <div 
                         key={product.sku}
                         onClick={() => handleProductSelect(product)}
                         className="flex-shrink-0 w-64 snap-center cursor-pointer group"
                       >
                         <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border-2 border-white/10 group-hover:border-rose-500 transition-all shadow-xl group-hover:-translate-y-4">
                           <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                           <div className="absolute bottom-0 left-0 right-0 p-8">
                             <p className="text-white font-bold text-3xl mb-1">{product.price}€</p>
                             <p className="text-slate-400 text-[10px] font-bold uppercase truncate tracking-widest">{product.name}</p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {generatedLook && (
          <div className="absolute inset-0 z-10 bg-slate-950 animate-in fade-in duration-1000">
            <img src={generatedLook} alt="Virtual Try On" className="w-full h-full object-contain" />
          </div>
        )}
      </div>
    </div>
  );
};
