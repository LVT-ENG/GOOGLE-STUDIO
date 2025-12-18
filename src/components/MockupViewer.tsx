
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag, Wand2 } from 'lucide-react';

interface Props {
  onSelect: (mockupId: string) => void;
}

// Using the Peacock AI images as the "Generative Fashion" demo
const MOCKUPS = [
  { id: 'MK-1', title: 'FGT: Peacock Suit V1', image: '/assets/demo/image_16.jpg', price: 1250 },
  { id: 'MK-2', title: 'FGT: Peacock Suit V2', image: '/assets/demo/image_17.jpg', price: 1250 },
  { id: 'MK-3', title: 'FGT: Peacock Suit V3', image: '/assets/demo/image_18.jpg', price: 1250 },
  { id: 'MK-4', title: 'FGT: Geometric Urban', image: '/assets/demo/image_2.jpg', price: 180 }, // Cloud image as abstract print
  { id: 'MK-5', title: 'FGT: Red Abstract', image: '/assets/demo/image_5.jpg', price: 300 },
];

export const MockupViewer: React.FC<Props> = ({ onSelect }) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(MOCKUPS.length / itemsPerPage);

  const currentMockups = MOCKUPS.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-right-8">
      
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
          <Wand2 size={16} />
          <span>FASHION GENERATIVE TECH</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Diseños Únicos Generados</h2>
        <p className="text-slate-500 text-lg">
          Basado en tu perfil y las tendencias globales, FGT ha creado estas piezas exclusivas. 
          Al comprar, se fabricará una única unidad solo para ti (JIT).
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {currentMockups.map((m, idx) => (
          <div 
            key={m.id} 
            className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex-1 relative overflow-hidden aspect-[3/4]">
               <img 
                src={m.image} 
                alt={m.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
               />
               
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                 <button 
                  onClick={() => onSelect(m.id)}
                  className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3 shadow-2xl"
                 >
                   <ShoppingBag size={20} /> Comprar Pieza Única
                 </button>
               </div>

               <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20">
                 1 of 1 Edition
               </div>
            </div>
            
            <div className="p-6 bg-white border-t border-slate-50">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-lg text-slate-900">{m.title}</h4>
                  <p className="text-xs text-slate-500">Diseño Generativo AI</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-rose-600">{m.price}€</p>
                  <p className="text-[10px] text-slate-400">Prod. Incluida</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-12">
          <button 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-4 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-2">
            {Array.from({length: totalPages}).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all ${page === i ? 'bg-slate-800 scale-125' : 'bg-slate-300'}`} />
            ))}
          </div>
          <button 
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-4 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};
