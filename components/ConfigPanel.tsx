
import React, { useState, useEffect } from 'react';
import type { ModelConfig, LLMProvider } from '../types';
import { LLM_PROVIDERS, MODELS_BY_PROVIDER, CUSTOM_MODEL_OPTION } from '../constants';
import { KeyIcon, ChevronDownIcon } from './icons';
import InputLabel from './common/InputLabel';

interface ConfigPanelProps {
  config: ModelConfig;
  onConfigChange: <K extends keyof ModelConfig>(key: K, value: ModelConfig[K]) => void;
  onOpenKeyModal: () => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onConfigChange, onOpenKeyModal }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCustomModelInput, setIsCustomModelInput] = useState(false);

  useEffect(() => {
    const isCustom = !MODELS_BY_PROVIDER[config.provider].includes(config.model);
    setIsCustomModelInput(isCustom);
  }, [config.model, config.provider]);

  const handleProviderChange = (provider: LLMProvider) => {
    const newModel = MODELS_BY_PROVIDER[provider][0];
    onConfigChange('provider', provider);
    onConfigChange('model', newModel);
  };

  const handleModelSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value === CUSTOM_MODEL_OPTION) {
      setIsCustomModelInput(true);
      onConfigChange('model', '');
    } else {
      setIsCustomModelInput(false);
      onConfigChange('model', value);
    }
  };
    
  return (
    <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-lg flex-shrink-0 shadow-lg">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-medium text-slate-200">Configurações</h2>
        <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-slate-700/50">
          <button 
            onClick={onOpenKeyModal}
            className="w-full flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 font-medium py-2.5 px-4 rounded-md transition-all duration-200 mb-6 border border-amber-500/20 hover:border-amber-500/30"
          >
            <KeyIcon className="w-5 h-5" />
            Configurar Chaves de API
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <InputLabel htmlFor="llm-provider">Provedor LLM</InputLabel>
              <select 
                id="llm-provider"
                value={config.provider}
                onChange={(e) => handleProviderChange(e.target.value as LLMProvider)}
                className="w-full bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-md py-2 px-3 text-slate-300 focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 outline-none transition-all duration-200 hover:border-slate-600/50"
              >
                {LLM_PROVIDERS.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>
            <div>
              <InputLabel htmlFor="model">Modelo</InputLabel>
              {isCustomModelInput ? (
                <input
                  type="text"
                  id="model-custom"
                  value={config.model}
                  onChange={(e) => onConfigChange('model', e.target.value)}
                  placeholder="Digite o nome do modelo..."
                  className="w-full bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-md py-2 px-3 text-slate-300 focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 outline-none transition-all duration-200 hover:border-slate-600/50"
                  autoFocus
                />
              ) : (
                <select 
                  id="model"
                  value={config.model}
                  onChange={handleModelSelectChange}
                  className="w-full bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-md py-2 px-3 text-slate-300 focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 outline-none transition-all duration-200 hover:border-slate-600/50"
                >
                  {MODELS_BY_PROVIDER[config.provider].map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                  <option value={CUSTOM_MODEL_OPTION}>Custom...</option>
                </select>
              )}
            </div>
            <div>
              <InputLabel htmlFor="temperature">Temperatura</InputLabel>
              <input 
                type="number"
                id="temperature"
                value={config.temperature}
                onChange={(e) => onConfigChange('temperature', parseFloat(e.target.value))}
                step="0.1"
                min="0"
                max="2"
                className="w-full bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-md py-2 px-3 text-slate-300 focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 outline-none transition-all duration-200 hover:border-slate-600/50"
              />
            </div>
            <div>
              <InputLabel htmlFor="top-p">Top-p</InputLabel>
              <input 
                type="number"
                id="top-p"
                value={config.topP}
                onChange={(e) => onConfigChange('topP', parseFloat(e.target.value))}
                step="0.1"
                min="0"
                max="1"
                className="w-full bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-md py-2 px-3 text-slate-300 focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 outline-none transition-all duration-200 hover:border-slate-600/50"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;
