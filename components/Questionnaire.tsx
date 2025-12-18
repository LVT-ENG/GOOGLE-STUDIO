
import React, { useState } from 'react';
import { ArrowRight, Weight, Ruler, MapPin, Palette } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  onComplete: (data: Partial<UserProfile>) => void;
}

export const Questionnaire: React.FC<Props> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    city: '',
    weight: '',
    height: '',
    styles: '',
    colors: '',
    gramaje: '180'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      city: formData.city,
      weight: Number(formData.weight),
      height: Number(formData.height),
      preferences: {
        styles: formData.styles.split(',').map(s => s.trim()),
        colors: formData.colors.split(',').map(c => c.trim()),
        fabricWeight: Number(formData.gramaje)
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-rose-500 to-purple-600 text-white">
          <h2 className="text-3xl font-bold mb-2">Perfil Tryon</h2>
          <p className="text-rose-100">Configura tus medidas y preferencias para que PAU acierte.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin size={16} /> Ciudad
              </label>
              <input 
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="Ej: Madrid"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Weight size={16} /> Peso (kg)
              </label>
              <input 
                required type="number" min="30" max="300"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                value={formData.weight}
                onChange={e => setFormData({...formData, weight: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Ruler size={16} /> Altura (cm)
              </label>
              <input 
                required type="number" min="100" max="250"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                value={formData.height}
                onChange={e => setFormData({...formData, height: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Palette size={16} /> Gramaje (g/m²)
              </label>
              <input 
                type="number" min="80" max="400"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                value={formData.gramaje}
                onChange={e => setFormData({...formData, gramaje: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Estilos y Colores</label>
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none mb-3"
              placeholder="Estilos (ej: urbano, minimalista, luxury)"
              value={formData.styles}
              onChange={e => setFormData({...formData, styles: e.target.value})}
            />
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
              placeholder="Colores favoritos (ej: negro, pastel, neón)"
              value={formData.colors}
              onChange={e => setFormData({...formData, colors: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            Siguiente: Avatar 3D <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
