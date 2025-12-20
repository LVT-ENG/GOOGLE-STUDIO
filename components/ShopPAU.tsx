
import React, { useState, useMemo } from 'react';
import { Heart, X, Sparkles, Zap, Filter } from 'lucide-react';
import { Product, UserProfile } from '../types';

interface Props {
  onNext: () => void;
  userProfile: Partial<UserProfile>;
}

const PRODUCT_CATALOG: Product[] = [
  { sku: 'PAU-001', name: 'Chaqueta Neopreno Oversize', category: 'Chaquetas', description: 'Corte estructural, tejido técnico denso.', price: 120, image: '/assets/demo/image_11.jpg', tags: ['urban', 'heavy', 'oversize'] },
  { sku: 'PAU-002', name: 'Vestido Chic Rojo', category: 'Vestidos', description: 'Elegancia atemporal.', price: 299, image: '/assets/demo/image_6.jpg', tags: ['luxury', 'red', 'light'] },
  { sku: 'PAU-003', name: 'Look Urbano Geométrico', category: 'Conjuntos', description: 'Patrones audaces para el día a día.', price: 180, image: '/assets/demo/image_21.jpg', tags: ['minimal', 'pattern', 'medium'] },
  { sku: 'PAU-004', name: 'Casual Leather Set', category: 'Conjuntos', description: 'Esenciales de piel premium.', price: 450, image: '/assets/demo/image_12.jpg', tags: ['urban', 'leather', 'medium'] },
  { sku: 'PAU-005', name: 'Smart Casual Edit', category: 'Conjuntos', description: 'Perfecto para oficina y afterwork.', price: 220, image: '/assets/demo/image_15.jpg', tags: ['street', 'blue', 'heavy'] },
  { sku: 'PAU-006', name: 'Essential White Top', category: 'Tops', description: 'Básico esencial muy ligero.', price: 45, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', tags: ['minimal', 'white', 'light'] },
  { sku: 'PAU-007', name: 'Bomber Jacket JIT', category: 'Chaquetas', description: 'Estilo aviador con materiales reciclados.', price: 155, image: 'https://images.unsplash.com/photo-1551488852-080175b21695?auto=format&fit=crop&w=400&q=80', tags: ['jacket', 'warm'] },
  { sku: 'PAU-008', name: 'Floral Sundress', category: 'Vestidos', description: 'Ligero y fresco para el verano.', price: 70, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80', tags: ['dress', 'summer'] },
];

export const ShopPAU: React.FC<Props> = ({ onNext, userProfile }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Todo');

  const handleInteraction = (sku: string, action: 'like' | 'dislike') => {
    console.log(`PAU Tracking: User ${action}d ${sku}`);
  };

  const categories = useMemo(() => {
    const cats = ['Todo', ...new Set(PRODUCT_CATALOG.map(p => p.category))];
    return cats;
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todo') return PRODUCT_CATALOG;
    return PRODUCT_CATALOG.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
      
      {/* PAU Header */}
      <div className="relative rounded-[3rem] overflow-hidden mb-10 bg-slate-900 shadow-2xl">
        <div className="absolute inset-0">
          <img src="/assets/demo/image_15.jpg" className="w-full h-full object-cover opacity-40 mix-blend-overlay" alt="PAU AI" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="relative p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold tracking-widest text-sm mb-2">
              <Sparkles size={16} />
              <span>PERSONALIZED ALGORITHM UNIT</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Tu Selección <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400">PAU</span></h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              He analizado tu biometría y las tendencias <strong className="text-white">FGT Top-20</strong>. 
              Esta cápsula está diseñada para maximizar tu estilo y confort.
            </p>
          </div>
          
          <button 
            onClick={onNext} 
            className="group flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-rose-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)]"
          >
            <Zap size={20} className="group-hover:animate-pulse" />
            Generar Mockups FGT
          </button>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex items-center gap-2 text-slate-400 font-bold tracking-widest text-xs uppercase">
          <Filter size={14} />
          <span>Filtrar por Categoría</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border-2 ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300 hover:text-rose-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product, idx) => (
          <div 
            key={product.sku} 
            className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                9{8 + (idx % 2)}% Match
              </div>

              <div className="absolute top-4 right-4 bg-slate-900/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm">
                {product.category}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="flex justify-center gap-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <button onClick={() => handleInteraction(product.sku, 'dislike')} className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-xl">
                    <X size={28} />
                  </button>
                  <button onClick={() => handleInteraction(product.sku, 'like')} className="w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-400 hover:scale-110 transition-all shadow-lg shadow-rose-500/40">
                    <Heart size={28} fill="currentColor" />
                  </button>
                </div>
                <p className="text-white text-center mt-6 text-sm font-medium opacity-80">Interés registrado por PAU</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-slate-900 leading-tight group-hover:text-rose-600 transition-colors">{product.name}</h3>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg text-sm">{product.price}€</span>
              </div>
              <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 font-medium text-lg italic">No se encontraron productos en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};
