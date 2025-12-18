
import React, { useState, useEffect } from 'react';
import { User, RefreshCw, Leaf, Coins, Shirt, ArrowUpRight, History, Recycle, Info } from 'lucide-react';
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
      
      {/* Background decoration from image_7 concept */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <img src="/assets/demo/image_7.jpg" className="w-full h-full object-cover grayscale" alt="" />
      </div>

      <div className="relative z-10">
        {/* User & Wallet Header */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 flex flex-col sm:flex-row items-center gap-8">
             <div className="relative">
               <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                 {/* Avatar placeholder from image_9 */}
                 <img src="/assets/demo/image_9.jpg" className="w-full h-full object-cover" alt="Avatar" />
               </div>
               <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
             </div>
             
             <div className="text-center sm:text-left flex-1">
               <h2 className="text-3xl font-bold text-slate-900 mb-1">{userProfile.name || 'Tryon User'}</h2>
               <p className="text-slate-500 flex items-center justify-center sm:justify-start gap-2">
                 <span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">ID: {userProfile.email?.split('@')[0].toUpperCase()}</span>
                 <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded text-xs font-bold">Ultimátum Member</span>
               </p>
             </div>

             <div className="bg-slate-900 text-white p-6 rounded-2xl min-w-[200px] text-center shadow-lg relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">AVBET Balance</p>
                <p className="text-4xl font-bold">{balance}</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-yellow-400">
                  <Coins size={12} />
                  <span>Créditos disponibles</span>
                </div>
             </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-8 shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
             <Leaf className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
             
             <div>
               <div className="flex items-center gap-2 mb-4 opacity-80">
                 <Recycle size={20} />
                 <span className="font-bold tracking-wider text-sm uppercase">Impacto Real</span>
               </div>
               <div className="flex gap-8">
                  <div>
                    <span className="text-3xl font-bold block">{totalCO2.toFixed(1)}</span>
                    <span className="text-xs opacity-70">Kg CO2 Ahorrado</span>
                  </div>
                  <div>
                    <span className="text-3xl font-bold block">{(totalWater / 1000).toFixed(1)}k</span>
                    <span className="text-xs opacity-70">Litros Agua</span>
                  </div>
               </div>
             </div>

             <div className="mt-6 pt-4 border-t border-white/20">
               <p className="text-xs opacity-80">
                 Tu huella es un 40% menor que la media del retail tradicional gracias al sistema CAP.
               </p>
             </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8 mt-12 border-b border-slate-200 px-4">
          <button 
            onClick={() => setActiveTab('collection')}
            className={`pb-4 text-lg font-bold transition-all relative ${activeTab === 'collection' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Armario Digital
            {activeTab === 'collection' && <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-500 rounded-t-full shadow-[0_-2px_10px_rgba(244,63,94,0.5)]"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('impact')}
            className={`pb-4 text-lg font-bold transition-all relative ${activeTab === 'impact' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Trazabilidad & Donación
            {activeTab === 'impact' && <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-500 rounded-t-full shadow-[0_-2px_10px_rgba(244,63,94,0.5)]"></div>}
          </button>
        </div>

        {/* Content */}
        <div className="mt-8">
          {activeTab === 'collection' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                        item.status === 'active' ? 'bg-white text-slate-900' : 'bg-green-500 text-white'
                      }`}>
                        {item.status === 'active' ? 'En Propiedad' : 'Donado'}
                      </span>
                    </div>

                    {/* AutoDonate Action Overlay */}
                    {item.status === 'active' && (
                      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-8 text-center">
                         <div className="mb-6">
                           <p className="text-slate-400 text-xs uppercase font-bold mb-1">Valor Actual</p>
                           <p className="text-4xl font-bold text-white flex items-center justify-center gap-2">
                             <Coins className="text-yellow-400" /> {item.avbetValue}
                           </p>
                         </div>
                         <button 
                           onClick={() => handleDonate(item)}
                           disabled={donatingId === item.id}
                           className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors shadow-lg"
                         >
                           {donatingId === item.id ? "Procesando..." : <><RefreshCw size={18} /> Donar (AutoDonate)</>}
                         </button>
                         <p className="text-slate-400 text-[10px] mt-4 max-w-[200px]">
                           Al donar, el sistema logística inversa recoge la prenda y te abona créditos AVBET.
                         </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 truncate">{item.productName}</h3>
                    <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                      <span>Adquirido: {item.purchaseDate}</span>
                      <span className="flex items-center gap-1"><ArrowUpRight size={12} /> NFT</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'impact' && (
            <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
              <div className="relative h-80 rounded-3xl overflow-hidden group shadow-xl">
                 <img src="/assets/demo/image_7.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="World" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
                   <h3 className="text-2xl font-bold text-white mb-2">Red de Armarios Solidarios</h3>
                   <p className="text-slate-200 text-sm mb-6">
                     Tus donaciones han sido enviadas a centros de reciclaje y segunda vida certificados por Ultimatum.
                   </p>
                   <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white w-max px-6 py-3 rounded-full text-sm font-bold hover:bg-white hover:text-slate-900 transition-colors">
                     Ver Mapa de Trazabilidad
                   </button>
                 </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col justify-center">
                 <div className="flex items-start gap-4 mb-6">
                   <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                     <Info size={24} />
                   </div>
                   <div>
                     <h4 className="font-bold text-lg text-slate-900">¿Cómo funciona AutoDonate?</h4>
                     <p className="text-slate-500 text-sm mt-1">El algoritmo detecta prendas con bajo uso en tu armario virtual y te propone su recirculación antes de que pierdan valor.</p>
                   </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">1</div>
                      <span className="text-sm text-slate-700 font-medium">Recibes notificación "Prenda Inactiva"</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-sm text-slate-700 font-medium">Aceptas valoración AVBET</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-sm text-slate-700 font-medium">Recogida automática en domicilio</span>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
