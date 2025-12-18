
import React from 'react';
import { garments } from '../data/garments';
import { Garment } from '../types';
import { Check } from 'lucide-react';

interface GarmentSelectorProps {
  selectedId: string | null;
  onSelect: (garment: Garment) => void;
}

export const GarmentSelector: React.FC<GarmentSelectorProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[600px] p-2 custom-scrollbar">
      {garments.map((item) => (
        <div 
          key={item.id}
          onClick={() => onSelect(item)}
          className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
            selectedId === item.id 
              ? 'border-rose-500 shadow-lg ring-2 ring-rose-500/20 scale-[0.98]' 
              : 'border-transparent hover:border-slate-200 hover:shadow-md'
          }`}
        >
          <div className="aspect-[3/4] bg-slate-100 relative">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white font-medium text-sm">{item.price}</span>
            </div>
            
            {selectedId === item.id && (
              <div className="absolute top-3 right-3 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in duration-200">
                <Check size={16} strokeWidth={3} />
              </div>
            )}
          </div>
          <div className="p-3 bg-white">
            <p className="text-xs text-rose-600 font-semibold uppercase tracking-wider mb-1">{item.category}</p>
            <h4 className="text-sm font-bold text-slate-800 truncate">{item.name}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};
