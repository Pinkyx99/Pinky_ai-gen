import React, { useState, useEffect } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';
import { Source } from '../services/geminiService';

interface PromptOutputProps {
  planText: string;
  isLoading: boolean;
  sources: Source[];
}

const parsePlanText = (text: string) => {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];

  lines.forEach((line, index) => {
    line = line.trim();
    if (line.startsWith('🚀') || line.startsWith('🎯')) {
      elements.push(<p key={index} className="text-lg mb-1">{line}</p>);
    } else if (line.startsWith('###')) {
       elements.push(<h3 key={index} className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mt-6 mb-3 pb-1 border-b-2 border-slate-700">{line.replace('###', '').trim()}</h3>);
    } else if (line.startsWith('*   **')) {
      elements.push(<p key={index} className="text-slate-300 font-semibold mt-3 mb-1">{line.replace('*   **', '').replace('**:', ':')}</p>);
    } else if (line.startsWith('*   -')) {
      elements.push(<li key={index} className="text-slate-400 ml-4 list-disc marker:text-indigo-400">{line.replace('*   -', '').trim()}</li>);
    } else if (line.startsWith('---')) {
      elements.push(<hr key={index} className="border-slate-700 my-6" />);
    } else if (line.startsWith('📝 **AI Build Prompt Summary**:')) {
      elements.push(<h3 key={index} className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mt-6 mb-3">AI Build Prompt Summary</h3>);
    } else if (line.startsWith('>')) {
      elements.push(<blockquote key={index} className="border-l-4 border-indigo-500 pl-4 text-slate-400 italic my-2">{line.replace('>', '').trim()}</blockquote>);
    }
    else if (line) {
       elements.push(<p key={index} className="text-slate-300">{line}</p>);
    }
  });

  return elements;
};


const PromptOutput: React.FC<PromptOutputProps> = ({ planText, isLoading, sources }) => {
  const [isCopied, setIsCopied] = useState(false);

  const fullTextToCopy = `
${planText}

${sources.length > 0 ? 'Sources:\n' + sources.map(s => `- ${s.title}: ${s.uri}`).join('\n') : ''}
  `.trim();

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    if (planText) {
      navigator.clipboard.writeText(fullTextToCopy);
      setIsCopied(true);
    }
  };
  
  const renderSources = () => {
    if (!sources || sources.length === 0) {
      return null;
    }
    
    return (
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <h3 className="text-md font-semibold text-slate-300 mb-3">Referenced Sources</h3>
        <ul className="space-y-2 list-disc list-inside text-sm">
          {sources.map((source, index) => (
            <li key={index} className="truncate">
              <a
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                title={source.title}
                className="text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-2"
              >
                {source.title || source.uri}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-slate-500">
           <p className="text-lg font-semibold text-slate-400">Generating your app plan...</p>
           <p className="text-sm text-slate-500">The AI is analyzing your request...</p>
        </div>
      );
    }

    if (!planText) {
       // This state is not visible when idle, as the component is hidden.
       // It serves as a placeholder for the initial mount before animation.
      return null;
    }
    
    return (
      <>
        <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
          {parsePlanText(planText)}
        </div>
        {renderSources()}
      </>
    );
  };

  return (
    <div className="relative bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg min-h-[10rem] h-full">
       <div className="absolute top-0 right-0 p-3 z-10">
        {planText && !isLoading && (
          <button
            onClick={handleCopy}
            className="p-2 bg-slate-700/50 hover:bg-slate-600/70 rounded-lg transition-colors duration-200"
            aria-label="Copy to clipboard"
          >
            {isCopied ? <CheckIcon /> : <ClipboardIcon />}
          </button>
        )}
      </div>
      <div className="p-6 h-full overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default PromptOutput;