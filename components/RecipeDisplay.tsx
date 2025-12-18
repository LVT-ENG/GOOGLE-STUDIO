import React from 'react';
import { RecipeData } from '../types';
import { Clock, Flame, BarChart3, ChefHat, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RecipeDisplayProps {
  recipe: RecipeData;
  imageUrl?: string;
  isImageLoading: boolean;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, imageUrl, isImageLoading }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="relative h-64 md:h-80 bg-slate-100 overflow-hidden group">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={recipe.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              {isImageLoading ? (
                 <div className="animate-pulse flex flex-col items-center">
                   <div className="w-12 h-12 bg-slate-300 rounded-full mb-2"></div>
                   <span>Plating your dish... (Generating Image)</span>
                 </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ChefHat className="w-16 h-16 mb-2 opacity-50" />
                  <span>No Image Available</span>
                </div>
              )}
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
            <div className="p-8 text-white w-full">
               <div className="flex items-center gap-2 mb-2">
                 <span className="px-3 py-1 bg-orange-500 rounded-full text-xs font-bold uppercase tracking-wider">
                   {recipe.cuisine}
                 </span>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                   recipe.difficulty === 'Easy' ? 'bg-green-500' :
                   recipe.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                 }`}>
                   {recipe.difficulty}
                 </span>
               </div>
               <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight">{recipe.title}</h1>
               <p className="text-slate-200 text-lg max-w-2xl">{recipe.description}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <Clock className="w-6 h-6 text-orange-500 mb-2" />
            <span className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Time</span>
            <span className="text-lg font-bold text-slate-900">{recipe.cookingTime}</span>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <Flame className="w-6 h-6 text-red-500 mb-2" />
            <span className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Calories</span>
            <span className="text-lg font-bold text-slate-900">{recipe.calories}</span>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <BarChart3 className="w-6 h-6 text-blue-500 mb-2" />
            <span className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Macros</span>
            <span className="text-lg font-bold text-slate-900">Balanced</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-8 p-8">
          
          {/* Ingredients Column */}
          <div className="md:col-span-1 space-y-6">
             <div>
               <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                 Ingredients
               </h3>
               <ul className="space-y-3">
                 {recipe.ingredients.map((ing, idx) => (
                   <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                     <div className="mt-1 w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                     <span className="text-slate-700 text-sm">{ing}</span>
                   </li>
                 ))}
               </ul>
             </div>

             {/* Nutrition Chart */}
             <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
               <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider text-center">
                 Nutrition Profile
               </h3>
               <div className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={recipe.nutrition}
                       cx="50%"
                       cy="50%"
                       innerRadius={40}
                       outerRadius={70}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {recipe.nutrition.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                       ))}
                     </Pie>
                     <Tooltip 
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     />
                     <Legend verticalAlign="bottom" height={36} iconType="circle" />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
             </div>
          </div>

          {/* Instructions Column */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              Instructions
            </h3>
            <div className="space-y-8">
              {recipe.instructions.map((step, idx) => (
                <div key={idx} className="relative pl-8 group">
                  <div className="absolute left-0 top-0 w-8 h-8 -ml-4 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold border-4 border-white shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <div className="border-l-2 border-slate-100 pl-6 pb-2 group-last:border-l-0">
                    <p className="text-slate-700 leading-relaxed text-lg">{step}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3 p-4 bg-green-50 text-green-800 rounded-xl border border-green-100 mt-8">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-medium">Bon Appétit! Your culinary masterpiece is ready.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
