import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import PromptOutput from './components/PromptOutput';
import SuggestionChips from './components/SuggestionChips';
import { generateProjectPlan, Source } from './services/geminiService';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  
  const WEB_SEARCH_KEYWORDS = ['clone', 'remake', 'recreate', 'copy', 'build a site like', 'build an app like'];

  const handleGenerate = useCallback(async (prompt: string) => {
    if (isLoading || !prompt.trim()) {
      if (!prompt.trim()) setError("Please enter a prompt.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedPlan('');
    setSources([]);

    const isWebSearchActive = WEB_SEARCH_KEYWORDS.some(keyword => prompt.toLowerCase().includes(keyword));

    try {
      const result = await generateProjectPlan(prompt, isWebSearchActive);
      setGeneratedPlan(result.text);
      setSources(result.sources);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate plan. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const onSelectSuggestion = (prompt: string) => {
    setUserInput(prompt);
    handleGenerate(prompt);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B1028] text-slate-200 font-sans overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-600/40 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-cyan-400/40 rounded-full filter blur-3xl opacity-50 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full min-h-screen p-4">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-8 md:py-16">
          <Header />
          <main className="w-full mt-10 md:mt-12">
            <PromptInput
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onGenerate={() => handleGenerate(userInput)}
              isLoading={isLoading}
            />
            <SuggestionChips onSelect={onSelectSuggestion} isLoading={isLoading} />
            
            {error && (
              <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            <div className={`transition-opacity duration-700 ease-in-out ${generatedPlan || isLoading ? 'opacity-100' : 'opacity-0'}`}>
               <div className="mt-12">
                  <PromptOutput 
                    planText={generatedPlan} 
                    isLoading={isLoading} 
                    sources={sources} 
                  />
                </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;