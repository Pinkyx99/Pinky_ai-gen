import React, { useState, useEffect } from 'react';
import KeyIcon from './icons/KeyIcon';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setApiKey('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if(apiKey.trim()) {
        onSave(apiKey.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
          <div className="bg-indigo-600/20 p-2 rounded-lg mr-4">
              <KeyIcon />
          </div>
          <h2 className="text-2xl font-bold text-white">Enter Your API Key</h2>
        </div>
        <p className="text-slate-400 mb-4 text-sm">
          To generate project plans, this app requires a Google Gemini API key. Your key is saved securely in your browser's local storage and is never shared.
        </p>
        <div className="mb-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste your Gemini API key here"
            className="w-full pl-4 pr-4 py-3 bg-slate-900/70 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-inner"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline">
                Get a Gemini API Key
            </a>
            <div className="flex gap-2">
                <button
                    onClick={onClose}
                    className="px-5 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors duration-200"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={!apiKey.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 active:scale-100 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-200 disabled:from-purple-800 disabled:to-indigo-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    Save & Continue
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
