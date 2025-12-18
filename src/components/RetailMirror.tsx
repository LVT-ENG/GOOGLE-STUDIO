
import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, ShoppingBag, Sparkles, X, ChevronRight, Scan, Ruler } from 'lucide-react';
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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Camera & Run Background Scan
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        // Simulate background scanning process
        setTimeout(() => {
          const scan = simulateUserScan();
          setUserMetrics(scan);
        }, 2000);

      } catch (err) {
        console.error("Camera error:", err);
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

    // Calculate fit immediately if metrics are available
    if (userMetrics) {
      const fit = calculatePerfectFit(userMetrics, product);
      setFitResult({ size: fit.size, details: fit.matchDetails });
      startCountdown(product, fit.size);
    } else {
      // Fallback if scan hasn't finished (should be rare in demo)
      const fallbackScan = simulateUserScan();
      setUserMetrics(fallbackScan);
      const fit = calculatePerfectFit(fallbackScan, product);
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
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[60]">
      {/* Background Camera Feed (The Mirror) */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${generatedLook ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Generated Result Overlay */}
      {generatedLook && (
        <div className="absolute inset-0 z-10 bg-slate-900 animate-in fade-in duration-700">
          <img src={generatedLook} alt="Virtual Try On" className="w-full h-full object-contain" />
        </div>
      )}

      {/* UI Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none">
        
        {/* Top Header */}
        <div className="p-8 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent pointer-events-auto">
          <div>
             <h1 className="text-4xl font-bold text-white tracking-wider drop-shadow-lg">
               TRYON<span className="text-rose-500">YOU</span> <span className="text-xl font-light opacity-80">Mirror</span>
             </h1>
             <p className="text-slate-300">Touch a garment. We calculate your perfect size.</p>
             {userMetrics && (
               <div className="mt-4 flex gap-4 text-xs text-green-400 bg-black/40 p-2 rounded-lg backdrop-blur-sm border border-green-500/30">
                 <span className="flex items-center gap-1"><Scan size={14}/> Body Scanned</span>
                 <span>Waist: ~{userMetrics.waist}cm</span>
                 <span>Hips: ~{userMetrics.hips}cm</span>
               </div>
             )}
          </div>
          <button 
            onClick={onExit}
            className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-rose-500 transition-colors"
          >
            <X size={32} />
          </button>
        </div>

        {/* Center Info / Countdown */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {countdown !== null && (
            <div className="flex flex-col items-center">
              <div className="text-9xl font-bold text-white drop-shadow-2xl animate-ping mb-4">
                {countdown}
              </div>
              {fitResult && (
                <div className="bg-black/70 backdrop-blur-md p-6 rounded-2xl border border-rose-500 text-center animate-in zoom-in">
                  <p className="text-rose-400 font-bold uppercase tracking-widest text-sm mb-1">Perfect Fit Detected</p>
                  <p className="text-5xl font-bold text-white mb-2">Size {fitResult.size}</p>
                  <p className="text-slate-300 text-sm">{fitResult.details}</p>
                </div>
              )}
            </div>
          )}
          
          {isProcessing && (
            <div className="flex flex-col items-center gap-4 bg-black/60 backdrop-blur-xl p-8 rounded-3xl animate-in zoom-in">
              <Scan className="w-16 h-16 text-rose-500 animate-pulse" />
              <span className="text-2xl text-white font-medium">Generating AI Look...</span>
            </div>
          )}
        </div>

        {/* Bottom Controls & Catalog */}
        <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 pointer-events-auto">
          
          {/* Action Bar if Result is Shown */}
          {generatedLook && fitResult && (
            <div className="flex flex-col items-center gap-4 mb-8 animate-in slide-in-from-bottom-10">
              <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white flex items-center gap-2">
                <Ruler size={16} className="text-green-400" />
                <span>Recommended Size: <strong>{fitResult.size}</strong></span>
              </div>
              
              <div className="flex gap-6">
                <button 
                  onClick={() => setGeneratedLook(null)}
                  className="flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-xl"
                >
                  <RefreshCw size={24} /> Try Another
                </button>
                <button 
                  onClick={() => onBuy && selectedProduct && onBuy(selectedProduct)}
                  className="flex items-center gap-3 bg-rose-600 text-white px-8 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-xl shadow-rose-500/30"
                >
                  <ShoppingBag size={24} /> Buy Now ({selectedProduct?.price}€)
                </button>
              </div>
            </div>
          )}

          {/* Product Catalog Carousel */}
          {!generatedLook && !isProcessing && (
            <div className="relative">
               <button 
                 onClick={() => scrollCatalog('left')}
                 className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20"
               >
                 <ChevronRight size={32} className="rotate-180" />
               </button>

               <div 
                 ref={scrollRef}
                 className="flex gap-6 overflow-x-auto pb-4 pt-2 px-12 snap-x hide-scrollbar"
                 style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
               >
                 {INVENTORY_DATABASE.map((product) => (
                   <div 
                     key={product.sku}
                     onClick={() => handleProductSelect(product)}
                     className="flex-shrink-0 w-48 snap-center cursor-pointer group"
                   >
                     <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 group-hover:border-rose-500 transition-colors shadow-2xl">
                       <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                       <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                         <p className="text-white font-bold text-lg">{product.price}€</p>
                       </div>
                       
                       {/* Category Badge */}
                       <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white uppercase font-bold tracking-wider">
                         {product.category}
                       </div>

                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Sparkles className="text-rose-400 w-12 h-12 drop-shadow-lg" />
                       </div>
                     </div>
                     <p className="text-white mt-2 text-center font-medium truncate text-sm">{product.name}</p>
                   </div>
                 ))}
               </div>

               <button 
                 onClick={() => scrollCatalog('right')}
                 className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20"
               >
                 <ChevronRight size={32} />
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
