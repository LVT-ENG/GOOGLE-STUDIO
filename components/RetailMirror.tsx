
import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, ShoppingBag, Sparkles, X, ChevronRight, Scan, Ruler, UserCheck, ShieldCheck, Zap } from 'lucide-react';
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
  const [cameraActive, setCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
        
        setTimeout(() => {
          setUserMetrics(simulateUserScan());
        }, 2500);

      } catch (err) {
        console.warn("Entorno Boutique Activo (Demo Mode)");
        setCameraActive(false);
        setTimeout(() => {
          setUserMetrics(simulateUserScan());
        }, 2000);
      }
    };
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleProductSelect = (product: DetailedProduct) => {
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
      console.error("VTO Error", error);
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
      
      {/* Mirror Physical Frame Prototype */}
      <div className="relative w-[96vw] h-[96vh] bg-slate-900 rounded-[5rem] border-[20px] border-slate-800 shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden flex items-center justify-center">
        
        {/* Reflection Layer (Boutique Image) */}
        <div className="absolute inset-0 z-0">
          {cameraActive ? (
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted
              className={`w-full h-full object-cover transition-opacity duration-1000 ${generatedLook ? 'opacity-0' : 'opacity-100'}`}
            />
          ) : (
            <div className={`w-full h-full transition-opacity duration-1000 ${generatedLook ? 'opacity-0' : 'opacity-100'}`}>
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=90" 
                className="w-full h-full object-cover blur-[1px] brightness-75 scale-105"
                alt="Luxury Boutique Interior"
              />
              <div className="absolute inset-0 bg-slate-950/40"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 space-y-8">
                 <div className="relative">
                    <UserCheck size={120} className="animate-pulse opacity-20" />
                    <div className="absolute -inset-4 border-2 border-rose-500/20 rounded-full animate-ping"></div>
                 </div>
                 <p className="font-mono text-xl tracking-[0.5em] uppercase font-bold opacity-30 italic">Analizando Presencia...</p>
              </div>
            </div>
          )}
        </div>

        {/* Technical HUD Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none p-12 md:p-24">
          
          {/* Top HUD Panel */}
          <div className="flex justify-between items-start pointer-events-auto">
            <div className="bg-slate-950/40 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl group transition-all hover:bg-slate-950/60">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-4 h-4 bg-rose-500 rounded-full animate-ping shadow-[0_0_15px_rgba(244,63,94,1)]"></div>
                 <h1 className="text-5xl font-bold text-white tracking-tighter leading-none">
                   TRYON<span className="text-rose-500 font-light italic">YOU</span>
                 </h1>
               </div>
               <p className="text-slate-400 font-mono text-[10px] tracking-[0.4em] uppercase mb-8 font-bold opacity-60">Terminal Piloto · Retail Experience</p>
               
               {userMetrics && (
                 <div className="grid grid-cols-2 gap-x-14 gap-y-4 border-t border-white/10 pt-10">
                   {[
                     ['HPS_REF', '152 CM'],
                     ['PERIM_PECHO', `${userMetrics.chest} CM`],
                     ['PERIM_TALLE', `${userMetrics.waist} CM`],
                     ['PERIM_CADERA', `${userMetrics.hips} CM`]
                   ].map(([label, val]) => (
                     <div key={label} className="flex justify-between w-48 text-slate-300 font-mono text-[11px] font-bold">
                       <span className="opacity-40">{label}</span> <span>{val}</span>
                     </div>
                   ))}
                 </div>
               )}
            </div>
            
            <button 
              onClick={onExit}
              className="p-8 bg-white/5 backdrop-blur-2xl rounded-full text-white hover:bg-rose-600 transition-all border border-white/10 shadow-2xl active:scale-90"
            >
              <X size={48} />
            </button>
          </div>

          {/* Center Feedback Area */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {countdown !== null && (
              <div className="flex flex-col items-center">
                <div className="text-[18rem] font-bold text-white drop-shadow-[0_0_100px_rgba(255,255,255,0.4)] animate-pulse tracking-tighter">
                  {countdown}
                </div>
                {fitResult && (
                  <div className="bg-slate-900/90 backdrop-blur-3xl p-12 rounded-[4rem] border-2 border-rose-500 text-center animate-in zoom-in-95 shadow-[0_0_100px_rgba(244,63,94,0.4)]">
                    <div className="flex items-center justify-center gap-3 text-rose-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-6">
                      <ShieldCheck size={24} /> Autenticación de Talla Perfecta
                    </div>
                    <p className="text-9xl font-bold text-white mb-3 tracking-tighter">Talla {fitResult.size}</p>
                    <p className="text-slate-400 font-mono text-sm tracking-widest font-bold opacity-70 uppercase">{fitResult.details}</p>
                  </div>
                )}
              </div>
            )}
            
            {isProcessing && (
              <div className="flex flex-col items-center gap-16 bg-black/60 backdrop-blur-3xl p-24 rounded-[5rem] animate-in zoom-in border border-white/10 shadow-2xl">
                <div className="relative">
                  <div className="absolute inset-0 bg-rose-500 blur-[100px] opacity-40 animate-pulse"></div>
                  <Scan className="w-40 h-40 text-white relative z-10 animate-pulse" />
                </div>
                <div className="text-center space-y-6">
                   <h3 className="text-5xl text-white font-bold tracking-tighter uppercase">Mapeando Tejido JIT</h3>
                   <div className="flex items-center justify-center gap-2">
                      <Zap size={20} className="text-rose-500 animate-bounce" />
                      <p className="text-slate-500 font-mono text-xs tracking-widest font-bold uppercase">Procesando biometría para calce perfecto...</p>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation & Catalog HUD */}
          <div className="pointer-events-auto">
            {generatedLook ? (
              <div className="flex flex-col items-center gap-10 mb-16 animate-in slide-in-from-bottom-20 duration-1000">
                <div className="bg-white/5 backdrop-blur-3xl px-14 py-8 rounded-[4rem] border border-white/20 text-white flex items-center gap-14 shadow-2xl">
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] mb-3">Prenda Seleccionada</p>
                    <p className="text-3xl font-bold tracking-tight">{selectedProduct?.name}</p>
                  </div>
                  <div className="w-px h-16 bg-white/20"></div>
                  <div className="text-center">
                    <p className="text-[10px] text-rose-400 font-bold uppercase tracking-[0.4em] mb-3">Resultado Biométrico</p>
                    <p className="text-5xl font-bold tracking-tighter">{fitResult?.size}</p>
                  </div>
                </div>
                
                <div className="flex gap-10">
                  <button 
                    onClick={() => setGeneratedLook(null)}
                    className="flex items-center gap-4 bg-white text-slate-900 px-14 py-8 rounded-[2.5rem] font-bold text-3xl hover:scale-105 transition-transform shadow-2xl active:scale-95"
                  >
                    <RefreshCw size={36} /> Probar Otro
                  </button>
                  <button 
                    onClick={() => onBuy && selectedProduct && onBuy(selectedProduct)}
                    className="flex items-center gap-4 bg-rose-600 text-white px-16 py-8 rounded-[2.5rem] font-bold text-3xl hover:scale-105 transition-transform shadow-[0_0_80px_rgba(244,63,94,0.6)] border border-rose-400/50 active:scale-95"
                  >
                    <ShoppingBag size={36} /> Comprar Ahora ({selectedProduct?.price}€)
                  </button>
                </div>
              </div>
            ) : !isProcessing && (
              <div className="relative">
                 <div className="absolute -top-16 left-10 flex items-center gap-4 text-white/40 font-mono tracking-[0.4em] uppercase text-[11px] font-bold">
                   <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(244,63,94,1)]"></div>
                   Toca una pieza de la colección para análisis
                 </div>
                 
                 <div 
                   ref={scrollRef}
                   className="flex gap-12 overflow-x-auto pb-16 pt-6 px-12 snap-x hide-scrollbar"
                 >
                   {INVENTORY_DATABASE.map((product) => (
                     <div 
                       key={product.sku}
                       onClick={() => handleProductSelect(product)}
                       className="flex-shrink-0 w-80 snap-center cursor-pointer group"
                     >
                       <div className="relative aspect-[3/4] rounded-[4rem] overflow-hidden border-2 border-white/10 group-hover:border-rose-500 transition-all shadow-2xl group-hover:-translate-y-8 duration-1000">
                         <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125" />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent opacity-90 group-hover:opacity-70" />
                         <div className="absolute bottom-0 left-0 right-0 p-12">
                           <p className="text-white font-bold text-5xl mb-3 tracking-tighter">{product.price}€</p>
                           <p className="text-slate-400 text-sm font-bold truncate tracking-[0.1em] uppercase opacity-80">{product.name}</p>
                         </div>
                         <div className="absolute top-10 right-10 px-6 py-2 bg-black/60 backdrop-blur-2xl rounded-full text-[11px] text-white uppercase font-bold tracking-[0.3em] border border-white/10 shadow-lg">
                           {product.category.toUpperCase()}
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>

                 <button 
                   onClick={() => scrollCatalog('right')}
                   className="absolute -right-10 top-1/2 -translate-y-1/2 z-30 p-10 bg-white/5 backdrop-blur-3xl rounded-full text-white hover:bg-rose-500 hover:scale-110 transition-all border border-white/10 shadow-2xl active:scale-90"
                 >
                   <ChevronRight size={64} />
                 </button>
              </div>
            )}
          </div>
        </div>

        {/* Global Lighting Effects */}
        <div className="absolute inset-0 pointer-events-none border-[4px] border-white/5 rounded-[5rem] shadow-[inset_0_0_200px_rgba(255,255,255,0.03)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[4px] bg-rose-500/80 rounded-b-full blur-xl animate-pulse"></div>
      </div>
    </div>
  );
};
