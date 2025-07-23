import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, onGenerate, isLoading }) => {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      onGenerate();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        placeholder="Ex: An admin panel for an e-commerce store"
        className="w-full pl-6 pr-40 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-lg text-lg disabled:opacity-50"
        aria-label="Application idea prompt"
      />
      <button
        onClick={onGenerate}
        disabled={isLoading || !value.trim()}
        className="absolute inset-y-2 right-2 flex items-center justify-center px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 active:scale-100 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-200 disabled:from-purple-800 disabled:to-indigo-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:scale-100"
      >
        {isLoading ? (
           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <SparklesIcon />
            <span className="ml-2">Generate app</span>
          </>
        )}
      </button>
    </div>
  );
};

export default PromptInput;