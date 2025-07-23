import React from 'react';

interface SuggestionChipsProps {
  onSelect: (prompt: string) => void;
  isLoading: boolean;
}

const suggestions = [
  'Admin dashboard',
  'Ecommerce dashboard',
  'Music player app',
  'Social media feed',
  'Task management tool',
  'Fitness tracker',
];

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onSelect, isLoading }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-6 animate-fade-in">
      {suggestions.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          disabled={isLoading}
          className="px-4 py-1.5 bg-slate-800/60 border border-slate-700 text-slate-300 text-sm rounded-full hover:bg-slate-700/80 hover:border-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;