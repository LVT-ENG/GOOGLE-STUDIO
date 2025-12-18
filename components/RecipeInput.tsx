import React, { useState, useCallback, useRef } from 'react';
import { Camera, Image as ImageIcon, Loader2, ChefHat } from 'lucide-react';

interface RecipeInputProps {
  isLoading: boolean;
  onSubmit: (text: string, image?: string) => void;
}

export const RecipeInput: React.FC<RecipeInputProps> = ({ isLoading, onSubmit }) => {
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Strip prefix for API usage later if needed, but keeping standard data URI for preview
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText && !selectedImage) return;
    
    // Pass raw base64 data without prefix to the service
    const base64Data = selectedImage ? selectedImage.split(',')[1] : undefined;
    onSubmit(inputText, base64Data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ChefHat className="w-8 h-8" />
          CulinaryAI
        </h2>
        <p className="text-orange-50 mt-2">Describe your cravings or upload a photo of your ingredients.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-2">
            What's in your kitchen?
          </label>
          <textarea
            id="prompt"
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none text-slate-700 placeholder-slate-400 bg-slate-50"
            rows={3}
            placeholder="E.g., I have chicken, basil, and tomatoes. What can I make?"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
          >
            <Camera className="w-4 h-4" />
            {selectedImage ? "Change Photo" : "Add Photo"}
          </button>

          {selectedImage && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
              >
                <span className="text-xs">✕</span>
              </button>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || (!inputText && !selectedImage)}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg transition-all transform active:scale-[0.99] ${
              isLoading || (!inputText && !selectedImage)
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Thinking like a Chef...
              </>
            ) : (
              "Generate Recipe"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
