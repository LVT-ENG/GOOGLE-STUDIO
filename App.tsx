
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Questionnaire } from './components/Questionnaire';
import { BiometricCapture } from './components/BiometricCapture';
import { ShopPAU } from './components/ShopPAU';
import { MockupViewer } from './components/MockupViewer';
import { BiometricCheckout } from './components/BiometricCheckout';
import { RetailMirror } from './components/RetailMirror';
import { SmartCloset } from './components/SmartCloset';
import { registerInCloset } from './services/smartCloset';
import { AppState, UserProfile, DetailedProduct } from './types';
import { CheckCircle, Monitor, Zap, AlertCircle, Cpu, ArrowRight, ShieldCheck, Ruler, Gift, Clock, Users } from 'lucide-react';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({
    name: 'Usuario Demo',
    email: 'demo@tryon.app',
    avbetBalance: 150
  });

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCheckoutSuccess = () => {
    setCheckoutSuccess(true);
  };

  const handleRetailPurchase = (product: DetailedProduct) => {
    registerInCloset('demo@tryon.app', {
      sku: product.sku,
      mockupId: 'MIRROR-VTO',
      orderId: `RET-${Date.now()}`,
      productDetails: product
    });
    setAppState('smart_closet');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-rose-500 selection:text-white">
      <Navbar currentState={appState} onNavigate={setAppState} />

      <main className={`${appState === 'retail_kiosk' ? '' : 'pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'} min-h-[calc(100vh-64px)] flex flex-col`}>
        
        {/* LANDING VIEW (PILOT MODE) */}
        {appState === 'landing' && (
          <div className="flex-1 flex flex-col items-center animate-in fade-in duration-1000">
            
            {/* Friendly Christmas Warning Banner */}
            <div className="w-full bg-slate-900 text-white py-4 px-8 rounded-3xl mb-12 flex items-center justify-between shadow-2xl border border-white/10 animate-in slide-in-from-top-6 duration-1000">
               <div className="flex items-center gap-4">
                 <div className="bg-rose-500 p-2.5 rounded-full animate-bounce shadow-lg shadow-rose-500/50">
                   <Gift size={20} />
                 </div>
                 <p className="text-sm md:text-base font-medium">
                   <span className="text-rose-400 font-bold uppercase tracking-wider text-xs block md:inline md:mr-2">Recordatorio Amistoso:</span>
                   Comprar fuera de TRYONYOU en Navidad significa colas infinitas en devoluciones... 
                   <span className="text-rose-300 font-semibold italic ml-1">Aquí fabricamos lo que te queda bien a la primera. 😉</span>
                 </p>
               </div>
               <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono opacity-50 uppercase tracking-widest border-l border-white/20 pl-6">
                 <Clock size={14} /> Cero Esperas
               </div>
            </div>

            {/* Hero Section with Community Impact Image */}
            <div className="py-12 text-center max-w-5xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-6 py-2 rounded-full text-xs font-bold mb-10 tracking-widest animate-pulse border border-rose-100">
                <Zap size={14} />
                <span>ULTIMÁTUM PATENTED ECOSYSTEM</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-bold mb-8 tracking-tighter leading-none text-slate-900">
                TRYON<span className="text-rose-500 font-light italic">YOU</span>
              </h1>
              <p className="text-2xl md:text-3xl text-slate-500 mb-14 leading-relaxed font-medium max-w-3xl mx-auto">
                Olvídate de las tallas genéricas. <span className="text-slate-900 font-bold underline decoration-rose-500/30">Biometría y Producción JIT</span> para un calce perfecto garantizado.
              </p>
              
              <div className="flex flex-wrap gap-6 justify-center mb-20">
                <button 
                  onClick={() => setAppState('questionnaire')}
                  className="bg-slate-900 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:bg-rose-600 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group"
                >
                  Experiencia Online <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setAppState('retail_kiosk')}
                  className="bg-white text-slate-900 border-2 border-slate-900 px-12 py-6 rounded-2xl font-bold text-xl shadow-lg hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                  <Monitor size={24} /> Demo Tienda Física
                </button>
              </div>

              {/* People using app - Collage */}
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img 
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80" 
                  alt="Community Using TryOnYou" 
                  className="w-full h-auto grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-10 left-10 text-left text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Users size={24} className="text-rose-400" />
                    <span className="font-bold tracking-widest text-sm uppercase">Fashion Social Proof</span>
                  </div>
                  <h3 className="text-3xl font-bold">Unidos por la tecnología, <br/>separados de las colas.</h3>
                </div>
              </div>
            </div>

            {/* Visual Narrative: The Problem (Mountains of clothes) */}
            <section className="w-full grid md:grid-cols-2 gap-20 my-20 bg-white rounded-[4rem] p-16 shadow-2xl border border-slate-100 items-center overflow-hidden">
               <div className="relative group">
                 <div className="absolute inset-0 bg-rose-500/10 rounded-[3rem] -rotate-3 scale-105"></div>
                 <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                   <img 
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80" 
                    alt="Fitting Room Frustration" 
                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-1000"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-12">
                     <p className="text-white text-2xl font-bold italic leading-tight">
                       "¿Realmente vas a perder tu tiempo de Navidad en un probador lleno?"
                     </p>
                   </div>
                 </div>
               </div>
               <div className="space-y-10">
                 <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-[2rem] flex items-center justify-center shadow-lg">
                   <AlertCircle size={40} />
                 </div>
                 <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-none">Acabamos con la <br/><span className="text-rose-500">incertidumbre.</span></h2>
                 <p className="text-slate-500 text-2xl leading-relaxed">
                   En estas fiestas, elige la tranquilidad. Con nuestro escaneo <strong>AVBET Iris</strong> y el algoritmo <strong>PAU</strong>, cada prenda se diseña sabiendo exactamente cómo te va a sentar. Sin sorpresas, sin devoluciones, sin colas.
                 </p>
                 <div className="flex gap-6">
                    <div className="flex-1 p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                      <span className="block text-4xl font-bold text-slate-900">92.4%</span>
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-[0.2em] mt-2 block">Precisión Biómetrica</span>
                    </div>
                    <div className="flex-1 p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                      <span className="block text-4xl font-bold text-rose-500">Zero</span>
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-[0.2em] mt-2 block">Stock Residual</span>
                    </div>
                 </div>
               </div>
            </section>
            
            {/* Visual Narrative: Biometric Solution (Anatomical Mapping) */}
            <section className="w-full bg-slate-950 rounded-[5rem] py-32 px-8 md:px-20 my-20 overflow-hidden relative border border-slate-900">
              <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 blur-[150px] rounded-full"></div>
              <div className="max-w-6xl mx-auto text-center mb-24 relative z-10">
                <div className="inline-flex items-center gap-2 text-rose-400 font-bold tracking-[0.4em] text-xs uppercase mb-6">
                  <Ruler size={16} />
                  <span>Anatomical Mapping V2.0</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">Tu medida real, <span className="text-rose-500 italic">sin errores humanos.</span></h2>
                <p className="text-slate-400 text-xl max-w-3xl mx-auto font-light leading-relaxed">
                  Identificamos los puntos críticos de ajuste: HPS, perímetros cóncavos y alturas dinámicas mediante referencia escalar patentada.
                </p>
              </div>

              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                <div className="space-y-8 text-center">
                  <div className="aspect-[3/4] rounded-[3rem] overflow-hidden border border-slate-800 relative bg-slate-900 group shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700" alt="Mapping Side View" />
                    <div className="absolute top-6 left-6 bg-rose-600 text-[10px] px-3 py-1 text-white font-mono rounded tracking-[0.3em] font-bold">LATERAL_SCAN</div>
                  </div>
                  <h4 className="text-white font-bold text-xl tracking-tight">Análisis de Curvatura</h4>
                </div>
                <div className="space-y-8 text-center md:-translate-y-16">
                  <div className="aspect-[3/4] rounded-[3rem] overflow-hidden border-2 border-rose-500 relative bg-slate-900 shadow-[0_0_80px_rgba(244,63,94,0.3)] group">
                    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Mapping Front View" />
                    <div className="absolute top-6 left-6 bg-rose-600 text-[10px] px-3 py-1 text-white font-mono rounded tracking-[0.3em] font-bold">CRITICAL_FIT_HPS</div>
                  </div>
                  <h4 className="text-rose-500 font-bold text-2xl tracking-tight">Puntos HPS & Centro</h4>
                </div>
                <div className="space-y-8 text-center">
                  <div className="aspect-[3/4] rounded-[3rem] overflow-hidden border border-slate-800 relative bg-slate-900 group shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1539109132305-d75d830638c4?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700" alt="Rear View" />
                    <div className="absolute top-6 left-6 bg-rose-600 text-[10px] px-3 py-1 text-white font-mono rounded tracking-[0.3em] font-bold">DORSAL_ALGNMT</div>
                  </div>
                  <h4 className="text-white font-bold text-xl tracking-tight">Simetría Dorsal</h4>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* FLOW COMPONENTS */}
        {appState === 'retail_kiosk' && (
          <RetailMirror onExit={() => setAppState('landing')} onBuy={handleRetailPurchase} />
        )}

        {appState === 'questionnaire' && (
          <Questionnaire onComplete={(data) => {
            setUserProfile(prev => ({...prev, ...data}));
            setAppState('biometrics');
          }} />
        )}

        {appState === 'biometrics' && (
          <BiometricCapture onComplete={() => setAppState('shop_pau')} />
        )}

        {appState === 'shop_pau' && (
          <ShopPAU onNext={() => setAppState('fgt_mockups')} userProfile={userProfile} />
        )}

        {appState === 'fgt_mockups' && (
          <MockupViewer onSelect={(id) => setAppState('checkout_avbet')} />
        )}

        {appState === 'checkout_avbet' && !checkoutSuccess && (
          <BiometricCheckout onSuccess={handleCheckoutSuccess} />
        )}

        {appState === 'checkout_avbet' && checkoutSuccess && (
           <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
             <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-10 shadow-lg">
               <CheckCircle size={64} />
             </div>
             <h2 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">¡Orden Procesada!</h2>
             <p className="text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
               Tu prenda exclusiva se está imprimiendo bajo demanda (JIT) y ya está disponible en tu <strong>Armario Inteligente</strong>.
             </p>
             <button 
               onClick={() => { setCheckoutSuccess(false); setAppState('smart_closet'); }}
               className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-rose-600 transition-all shadow-2xl"
             >
               Ver Mi Armario Digital
             </button>
           </div>
        )}

        {appState === 'smart_closet' && <SmartCloset userProfile={userProfile} />}

      </main>
      
      {/* Footer Pilot Brand */}
      {appState === 'landing' && (
        <footer className="py-24 border-t border-slate-200 mt-32 bg-slate-950 text-white relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-600 to-rose-500"></div>
           <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-20">
              <div className="col-span-2">
                 <h3 className="text-4xl font-bold mb-8 tracking-tighter">TRYON<span className="text-rose-500 font-light italic">YOU</span></h3>
                 <p className="text-slate-400 text-lg max-w-sm mb-10 leading-relaxed">El primer ecosistema de moda circular e inteligente validado por la patente Ultimátum.</p>
                 <div className="flex flex-wrap gap-4">
                    {['tryonyou.app', 'tryonme.com', 'liveitfashion.com', 'abvetos.com'].map(url => (
                       <span key={url} className="text-[10px] bg-white/5 border border-white/10 px-4 py-2 rounded-full text-slate-400 font-mono tracking-widest">{url.toUpperCase()}</span>
                    ))}
                 </div>
              </div>
              <div className="space-y-6">
                 <h4 className="font-bold text-rose-500 uppercase tracking-[0.3em] text-xs">Propiedad Intelectual</h4>
                 <ul className="text-slate-400 space-y-4 text-sm font-medium">
                    <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={14} className="text-rose-500" /> Patente Ultimátum V2</li>
                    <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={14} className="text-rose-500" /> Protocolo AVBET Pay</li>
                    <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={14} className="text-rose-500" /> Watcher EPCT</li>
                 </ul>
              </div>
              <div className="space-y-6">
                 <h4 className="font-bold text-rose-500 uppercase tracking-[0.3em] text-xs">Ecosistema</h4>
                 <ul className="text-slate-400 space-y-4 text-sm font-medium">
                    <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={14} className="text-rose-500" /> Fashion Generative Tech</li>
                    <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={14} className="text-rose-500" /> Smart Closets</li>
                 </ul>
              </div>
           </div>
           <div className="max-w-7xl mx-auto px-8 mt-24 pt-10 border-t border-white/5 text-center text-slate-500 text-[10px] font-mono tracking-[0.5em]">
              © 2025 ULTIMÁTUM PATENT SYSTEM · PILOT DEMO 1.0.4
           </div>
        </footer>
      )}
    </div>
  );
}

export default App;
