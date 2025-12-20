
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
import { CheckCircle, Monitor, Zap, ArrowRight, Gift, Clock, Users } from 'lucide-react';

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
        
        {appState === 'landing' && (
          <div className="flex-1 flex flex-col items-center animate-in fade-in duration-1000">
            <div className="w-full bg-slate-900 text-white py-5 px-8 rounded-[2rem] mb-12 flex items-center justify-between shadow-2xl border border-white/5">
               <div className="flex items-center gap-4">
                 <div className="bg-rose-500 p-3 rounded-full animate-bounce shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                   <Gift size={20} />
                 </div>
                 <p className="text-sm md:text-base font-medium">
                   <span className="text-rose-400 font-bold uppercase tracking-wider text-xs block md:inline md:mr-2">Consejo Navideño:</span>
                   Evite colas y devoluciones.
                   <span className="text-rose-200 italic ml-1 font-semibold">En TryOnYou fabricamos lo que le queda bien a la primera. 😉</span>
                 </p>
               </div>
               <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono opacity-50 uppercase tracking-[0.3em]">
                 <Clock size={14} /> JIT Real-Time
               </div>
            </div>

            <div className="py-20 text-center max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-6 py-2 rounded-full text-[10px] font-black mb-10 tracking-[0.4em] uppercase border border-rose-100">
                <Zap size={14} />
                <span>Ultimátum Patent Ecosystem</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-bold mb-8 tracking-tighter leading-none text-slate-900">
                TryOnYou<span className="text-rose-500 font-light italic">.app</span>
              </h1>
              <p className="text-2xl md:text-3xl text-slate-500 mb-16 leading-relaxed font-medium max-w-3xl mx-auto">
                La tecnología que elimina el error humano en la moda. <span className="text-slate-900 font-bold">Biometría, IA y Producción JIT.</span>
              </p>
              
              <div className="flex flex-wrap gap-6 justify-center">
                <button 
                  onClick={() => setAppState('questionnaire')}
                  className="bg-slate-900 text-white px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl hover:bg-rose-600 transition-all hover:scale-105 flex items-center gap-3 group"
                >
                  Experiencia Online <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setAppState('retail_kiosk')}
                  className="bg-white text-slate-900 border-2 border-slate-900 px-12 py-6 rounded-3xl font-bold text-xl shadow-lg hover:bg-slate-50 transition-all hover:scale-105 flex items-center gap-3"
                >
                  <Monitor size={28} /> Demo Tienda Física
                </button>
              </div>

              <div className="mt-24 relative rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80" 
                  alt="Community" 
                  className="w-full h-auto grayscale-[0.2]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-12 text-left">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-2 text-rose-400">
                      <Users size={20} />
                      <span className="font-bold uppercase tracking-[0.3em] text-xs">Fashion Revolution</span>
                    </div>
                    <h3 className="text-4xl font-bold leading-tight">Unidos por la tecnología.</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
             <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-10">
               <CheckCircle size={64} />
             </div>
             <h2 className="text-5xl font-bold text-slate-900 mb-6">¡Orden Procesada!</h2>
             <p className="text-2xl text-slate-600 mb-12 max-w-2xl mx-auto">
               Su prenda exclusiva se está imprimiendo bajo demanda (JIT) y ya está disponible en su <strong>Armario Inteligente</strong>.
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
      
      {appState === 'landing' && (
        <footer className="py-20 border-t border-slate-200 mt-20 bg-slate-950 text-white">
           <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-20">
              <div>
                 <h3 className="text-4xl font-bold mb-6 tracking-tighter">TryOnYou<span className="text-rose-500 font-light italic">.app</span></h3>
                 <p className="text-slate-400 text-lg max-w-sm">Ecosistema de moda circular e inteligente validado por la patente Ultimátum.</p>
              </div>
              <div className="flex flex-col md:items-end justify-center">
                 <p className="text-slate-500 text-[10px] font-mono tracking-[0.4em]">© 2025 ULTIMÁTUM PATENT SYSTEM · PILOT 1.0.4</p>
              </div>
           </div>
        </footer>
      )}
    </div>
  );
}

export default App;
