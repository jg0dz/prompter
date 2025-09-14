import React, { memo } from 'react';
import { CopyIcon } from './icons';

interface OutputDisplayProps {
  output: string;
  isLoading: boolean;
  error: string | null;
}

const OutputDisplay: React.FC<OutputDisplayProps> = memo(({ output, isLoading, error }) => {
  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 h-full flex flex-col shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-slate-300">Resultado</h3>
        {output && !isLoading && (
            <button
                onClick={copyOutput}
                className="text-slate-400 hover:text-slate-200 transition-colors"
                title="Copy output"
            >
                <CopyIcon className="w-4 h-4" />
            </button>
        )}
      </div>
      <div className="flex-grow bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 overflow-y-auto border border-slate-700/30">
        {error ? (
            <pre className="text-red-400 whitespace-pre-wrap font-mono text-sm leading-relaxed">{error}</pre>
        ) : (
            <>
            {isLoading && !output && (
                <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-400/30 border-t-emerald-400"></div>
                </div>
            )}
            {output ? (
                <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{output}</pre>
            ) : !isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-2xl">🤖</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-slate-300 mb-2">Pronto para testar!</h3>
                  <p className="text-slate-500 max-w-md">
                    Configure seu System Prompt e digite uma pergunta para ver a resposta da IA aqui.
                  </p>
                </div>
            ) : null}
            </>
        )}
      </div>
    </div>
  );
});

export default OutputDisplay;
