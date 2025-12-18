
import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Camera } from 'lucide-react';

interface UploadZoneProps {
  onImageSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`relative border-2 border-dashed rounded-3xl p-10 transition-all duration-300 ease-in-out text-center cursor-pointer bg-white/50 backdrop-blur-sm ${
          isDragging 
            ? 'border-rose-500 bg-rose-50/50 scale-[1.02]' 
            : 'border-slate-300 hover:border-rose-400 hover:shadow-xl hover:-translate-y-1'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-tr from-rose-100 to-purple-100 rounded-full flex items-center justify-center text-rose-600 mb-2 shadow-sm animate-float">
            <Upload size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Importez votre photo</h3>
            <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">
              Glissez et déposez votre image ici, ou cliquez pour parcourir. Nous recommandons une photo de plain-pied.
            </p>
          </div>
          
          <div className="flex gap-3 mt-4">
            <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              <ImageIcon size={12} /> JPG, PNG
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              <Camera size={12} /> Bonne luminosité
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
