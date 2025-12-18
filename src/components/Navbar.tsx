
import React from 'react';
import { Shirt, ShoppingBag, Fingerprint, User, Menu } from 'lucide-react';
import { AppState } from '../types';

interface NavbarProps {
  currentState: AppState;
  onNavigate: (state: AppState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentState, onNavigate }) => {
  // Hide Navbar in Kiosk Mode for immersion
  if (currentState === 'retail_kiosk') return null;

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('landing')}
          >
            <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Shirt size={22} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-none tracking-tight text-slate-900">
                TRYON<span className="text-rose-500">YOU</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">By Abvetos</span>
            </div>
          </div>
          
          {/* Progress Indicators (Only visible during flows) */}
          {currentState !== 'landing' && currentState !== 'smart_closet' && (
            <div className="hidden md:flex items-center gap-2 bg-slate-100/50 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${['questionnaire', 'biometrics'].includes(currentState) ? 'bg-rose-500 scale-125' : 'bg-slate-300'}`} />
              <div className="w-8 h-0.5 bg-slate-200"></div>
              <div className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${currentState === 'shop_pau' ? 'bg-rose-500 scale-125' : 'bg-slate-300'}`} />
              <div className="w-8 h-0.5 bg-slate-200"></div>
              <div className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${currentState === 'fgt_mockups' ? 'bg-rose-500 scale-125' : 'bg-slate-300'}`} />
              <div className="w-8 h-0.5 bg-slate-200"></div>
              <div className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${currentState === 'checkout_avbet' ? 'bg-rose-500 scale-125' : 'bg-slate-300'}`} />
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => onNavigate('smart_closet')}
              className={`flex items-center gap-2 transition-colors ${currentState === 'smart_closet' ? 'text-rose-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <User size={20} />
              <span className="hidden sm:inline text-sm font-medium">Mi Armario</span>
            </button>
            
            <button 
              onClick={() => onNavigate('shop_pau')}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              {currentState === 'checkout_avbet' ? <Fingerprint size={18} /> : <ShoppingBag size={18} />}
              <span>{currentState === 'checkout_avbet' ? 'AVBET Pay' : 'PAU Shop'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
