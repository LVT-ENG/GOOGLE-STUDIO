
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
import { CheckCircle, Monitor } from 'lucide-react';

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
    // Register the item in the smart closet as if it was purchased instantly via the mirror
    registerInCloset('demo@tryon.app', {
      sku: product.sku,
      mockupId: 'MIRROR-VTO',
      orderId: `RET-${Date.now()}`,
      productDetails: product
    });
    // Navigate to the closet to show the item
    setAppState('smart_closet');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar currentState={appState} onNavigate={setAppState} />

      <main className={`${appState === 'retail_kiosk' ? '' : 'pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'} min-h-[calc(100vh-64px)] flex flex-col`}>
        
        {/* LANDING */}
        {appState === 'landing' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              TRYON<span className="text-rose-500">YOU</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              La revolución de la moda inteligente. Biometría, IA generativa y producción automática bajo la patente <span className="font-semibold text-slate-900">Ultimátum</span>.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
               <button 
                onClick={() => setAppState('questionnaire')}
                className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-slate-800 transition-all hover:scale-105"
               >
                 Empezar Experiencia Online
               </button>
               
               <button 
                onClick={() => setAppState('retail_kiosk')}
                className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
               >
                 <Monitor size={20} /> Demo Tienda Física
               </button>
            </div>
            
            {/* Demo Video Placeholder */}
            <div className="mt-16 w-full max-w-4xl aspect-video bg-slate-200 rounded-3xl overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors cursor-pointer">
                 <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-lg">
                   <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-slate-900 border-b-[10px] border-b-transparent ml-1"></div>
                 </div>
              </div>
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover" alt="Fashion Demo" />
            </div>
          </div>
        )}

        {/* RETAIL KIOSK MIRROR */}
        {appState === 'retail_kiosk' && (
          <RetailMirror 
            onExit={() => setAppState('landing')} 
            onBuy={handleRetailPurchase}
          />
        )}

        {/* QUESTIONNAIRE */}
        {appState === 'questionnaire' && (
          <Questionnaire onComplete={(data) => {
            setUserProfile(prev => ({...prev, ...data}));
            setAppState('biometrics');
          }} />
        )}

        {/* BIOMETRICS */}
        {appState === 'biometrics' && (
          <BiometricCapture onComplete={() => {
            setAppState('shop_pau');
          }} />
        )}

        {/* SHOP PAU */}
        {appState === 'shop_pau' && (
          <ShopPAU 
            onNext={() => setAppState('fgt_mockups')} 
            userProfile={userProfile}
          />
        )}

        {/* FGT MOCKUPS */}
        {appState === 'fgt_mockups' && (
          <MockupViewer onSelect={(id) => {
            console.log('Selected Mockup:', id);
            setAppState('checkout_avbet');
          }} />
        )}

        {/* CHECKOUT AVBET */}
        {appState === 'checkout_avbet' && !checkoutSuccess && (
          <BiometricCheckout onSuccess={handleCheckoutSuccess} />
        )}

        {/* SUCCESS SCREEN */}
        {appState === 'checkout_avbet' && checkoutSuccess && (
           <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
               <CheckCircle size={48} />
             </div>
             <h2 className="text-4xl font-bold text-slate-900 mb-4">¡Compra Exitosa!</h2>
             <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
               Tu prenda única se está imprimiendo (JIT) y se ha añadido a tu <strong>Armario Inteligente</strong>.
             </p>
             <button 
               onClick={() => {
                 setCheckoutSuccess(false); // Reset internal state
                 setAppState('smart_closet');
               }}
               className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-all"
             >
               Ir a Mi Armario
             </button>
           </div>
        )}

        {/* SMART CLOSET */}
        {appState === 'smart_closet' && (
          <SmartCloset userProfile={userProfile} />
        )}

      </main>
    </div>
  );
}

export default App;
