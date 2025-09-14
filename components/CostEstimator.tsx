import React from 'react';
import { LLMProvider } from '../types';

interface CostEstimatorProps {
  provider: LLMProvider;
  promptLength: number;
  responseLength?: number;
}

const COST_PER_1K_TOKENS = {
  'Google Gemini': { input: 0.00025, output: 0.00075 },
  'OpenAI': { input: 0.01, output: 0.03 },
  'Open Router': { input: 0.005, output: 0.015 }
};

export const CostEstimator: React.FC<CostEstimatorProps> = ({ 
  provider, 
  promptLength, 
  responseLength = 0 
}) => {
  const estimatedInputTokens = Math.ceil(promptLength / 4);
  const estimatedOutputTokens = Math.ceil(responseLength / 4);
  const totalTokens = estimatedInputTokens + estimatedOutputTokens;
  
  const costs = COST_PER_1K_TOKENS[provider];
  const inputCost = (estimatedInputTokens / 1000) * costs.input;
  const outputCost = (estimatedOutputTokens / 1000) * costs.output;
  const totalCost = inputCost + outputCost;

  return (
    <div className="text-xs text-slate-400 bg-slate-900/30 backdrop-blur-sm p-3 rounded-lg border border-slate-700/50 shadow-lg">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Tokens:</span>
          <span className="font-medium text-slate-300">{totalTokens.toLocaleString()}</span>
        </div>
        <span className="text-slate-600">•</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Custo:</span>
          <span className="font-medium text-emerald-400">${totalCost.toFixed(6)}</span>
        </div>
        <span className="text-slate-600">•</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Provedor:</span>
          <span className="font-medium text-purple-400">{provider}</span>
        </div>
      </div>
    </div>
  );
};
