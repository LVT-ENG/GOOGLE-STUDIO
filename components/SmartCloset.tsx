
import React, { useState, useEffect } from 'react';
import { User, RefreshCw, Leaf, Coins, Shirt, ArrowUpRight, History, Recycle, Info, Globe } from 'lucide-react';
import { WardrobeItem, UserProfile } from '../types';
import { getWardrobeItems, donateItem } from '../services/smartCloset';

interface Props {
  userProfile: Partial<UserProfile>;
}

export const SmartCloset: React.FC<Props> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<'collection' | 'impact'>('collection');
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(userProfile.avbetBalance || 150);
  const [donatingId, setDonatingId] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const data = await getWardrobeItems();
    setItems(data);
    setLoading(false);
  };

  const handleDonate = async (item: WardrobeItem) => {
    if (!window.confirm(`¿Donar "${item.productName}" al Armario Solidario a cambio de ${item.avbetValue} AVBETs?`)) return;

    setDonatingId(item.id);
    const result = await donateItem(item.id);
    
    if (result.success) {
      setBalance(prev => prev + result.earnedCredits);
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'donated' } : i));
    }
    setDonatingId(null);
  };

  const totalCO2 = items.reduce((acc, curr) => acc + curr.ecoImpact.co2Saved, 0);
  const totalWater = items.reduce((acc, curr) => acc + curr.ecoImpact.waterSaved, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* Solidarity Wardrobe Concept Header */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <Globe className="absolute -right-20 -top-20 w-96 h-96 text-rose-500/10 animate-spin-slow" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-400 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-rose-500/30">
              <Leaf size={14} />
              <span>ECO-FRIENDLY SCORE: 85/100</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">Solidarity <br/><span className="text-rose-500 font-light italic">Wardrobe</span></h1>
            <p className="text-slate-400 text-xl max-w-xl leading-relaxed">
              Tus prendas son activos digitales y físicos. Úsalas, dónalas o recíclalas para cerrar el círculo de la moda sostenible.
            </p>
          </div>
          
          <div className="flex gap-4 md:gap-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] text-center w-48 shadow-xl">
               <p className="text-4xl font-bold text-rose-500 mb-1">{totalCO2.toFixed(1)}</p>
               <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Kg CO2 Ahorrado</p>
            </div>
            <div className="bg-slate-800 border border-white/5 p-8 rounded-[2.5rem] text-center w-48 shadow-xl">
               <p className="text-4xl font-bold text-white mb-1">{balance}</p>
               <p className="text-[10px] text-rose-400 uppercase font-bold tracking-widest">AVBET Credits</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 border-b border-slate-200 px-4">
        <button 
          onClick={() => setActiveTab('collection')}
          className={`pb-4 text-lg font-bold transition-all relative ${activeTab === 'collection' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Mi Colección Activa
          {activeTab === 'collection' && <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-500 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('impact')}
          className={`pb-4 text-lg font-bold transition-all relative ${activeTab === 'impact' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Impacto Global
          {activeTab === 'impact' && <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-500 rounded-t-full"></div>}
        </button>
      </div>

      <div className="mt-8">
        {activeTab === 'collection' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((item) => (
              <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={item.image} alt={item.productName} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  
                  {item.status === 'active' && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-10 text-center">
                       <p className="text-slate-400 text-xs uppercase font-bold mb-2">Valoración Circular</p>
                       <p className="text-5xl font-bold text-white mb-8">{item.avbetValue} <span className="text-xl font-light text-rose-500">AVBT</span></p>
                       <button 
                         onClick={() => handleDonate(item)}
                         disabled={donatingId === item.id}
                         className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-50 transition-all hover:scale-105"
                       >
                         <Recycle size={20} /> Donar & Compartir
                       </button>
                    </div>
                  )}
                  
                  {item.status === 'donated' && (
                    <div className="absolute inset-0 bg-green-500/40 backdrop-blur-sm flex items-center justify-center">
                      <div className="bg-white px-6 py-2 rounded-full font-bold text-green-600 shadow-xl border-2 border-green-600">DONADO</div>
                    </div>
                  )}
                </div>
                
                <div className="p-8">
                  <h3 className="font-bold text-xl text-slate-900 mb-2 truncate">{item.productName}</h3>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span>Adquirido: {item.purchaseDate}</span>
                    <span className="flex items-center gap-1 text-rose-500 uppercase tracking-widest font-bold"><ArrowUpRight size={14} /> NFT Trace</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'impact' && (
          <div className="grid md:grid-cols-2 gap-12 animate-in slide-in-from-bottom-8">
            <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100 flex flex-col justify-center">
               <div className="flex items-start gap-6 mb-8">
                 <div className="p-4 bg-blue-100 text-blue-600 rounded-3xl">
                   <Globe size={32} />
                 </div>
                 <div>
                   <h4 className="font-bold text-2xl text-slate-900">Ecosistema Solidario</h4>
                   <p className="text-slate-500 text-lg mt-2 leading-relaxed">Tus donaciones han evitado la emisión de 3.5 toneladas de CO2 a nivel global.</p>
                 </div>
               </div>
               
               <div className="space-y-6">
                  {[
                    "Item #492 - Enviado a Planta de Reciclaje JIT (Madrid)",
                    "Item #120 - Asignado a Solidarity Wardrobe (Global)",
                    "Ahorro acumulado: 125,000 Litros de agua"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 font-medium text-slate-700">
                      <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                      {text}
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
               <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Sostenibilidad" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-12">
                 <div className="text-white">
                    <h3 className="text-3xl font-bold mb-2">Tu impacto es real.</h3>
                    <p className="opacity-80">Gracias por elegir una moda sin desperdicio y sin esperas.</p>
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
