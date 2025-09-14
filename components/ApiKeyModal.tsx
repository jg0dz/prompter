import React, { useState, useEffect } from 'react';
import type { ApiKeys, LLMProvider } from '../types';
import type { KeyTestStatus } from '../App';
import Modal from './common/Modal';
import { GeminiIcon, OpenAIIcon, OpenRouterIcon, XIcon, KeyIcon } from './icons';
import { LLM_PROVIDERS } from '../constants';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKeys: ApiKeys;
  onSave: (keys: ApiKeys) => void;
  onTestKey: (provider: LLMProvider, key: string) => void;
  testStatus: Record<LLMProvider, {status: KeyTestStatus, message: string}>;
}

const ProviderIcon: React.FC<{ provider: LLMProvider }> = ({ provider }) => {
    const commonClass = "w-5 h-5";
    switch (provider) {
        case 'Google Gemini': return <GeminiIcon className={commonClass} />;
        case 'OpenAI': return <OpenAIIcon className={commonClass} />;
        case 'Open Router': return <OpenRouterIcon className={commonClass} />;
        default: return <KeyIcon className={commonClass} />;
    }
};

const TestStatusIndicator: React.FC<{ status: KeyTestStatus, message: string }> = ({ status, message }) => {
    if (status === 'testing') {
        return <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>;
    }
    if (status === 'success') {
        return <span className="text-green-500 font-bold" title="Chave válida">✓</span>;
    }
    if (status === 'error') {
        return <span className="text-red-500 font-bold" title={message}>✗</span>;
    }
    return null;
};

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, currentKeys, onSave, onTestKey, testStatus }) => {
  const [activeTab, setActiveTab] = useState<LLMProvider>(LLM_PROVIDERS[0]);
  const [localKeys, setLocalKeys] = useState<ApiKeys>({});

  useEffect(() => {
    if (isOpen) {
      setLocalKeys(currentKeys);
    }
  }, [isOpen, currentKeys]);

  const handleKeyChange = (provider: LLMProvider, value: string) => {
    setLocalKeys(prev => ({ ...prev, [provider]: value }));
  };

  const handleSave = () => {
    onSave(localKeys);
  };

  const handleTest = (provider: LLMProvider) => {
      const keyToTest = localKeys[provider] || '';
      onTestKey(provider, keyToTest);
  }

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-200">Configurar Chaves de API</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="border-b border-slate-600 mb-6">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              {LLM_PROVIDERS.map((provider) => (
                <button
                  key={provider}
                  onClick={() => setActiveTab(provider)}
                  className={`
                    ${activeTab === provider
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                    }
                    flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none
                  `}
                >
                  <ProviderIcon provider={provider} />
                  {provider}
                </button>
              ))}
            </nav>
          </div>

          <div>
            {LLM_PROVIDERS.map((provider) => (
              <div key={provider} className={activeTab === provider ? 'block' : 'hidden'}>
                <label htmlFor={`${provider}-key`} className="block text-sm font-medium text-slate-300 mb-2">
                  Chave de API - {provider}
                </label>
                <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id={`${provider}-key`}
                      placeholder="Cole sua chave de API aqui"
                      value={localKeys[provider] || ''}
                      onChange={(e) => handleKeyChange(provider, e.target.value)}
                      className="flex-grow w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                    <div className="w-6 h-6 flex items-center justify-center">
                        <TestStatusIndicator {...testStatus[provider]} />
                    </div>
                    <button 
                        onClick={() => handleTest(provider)}
                        className="bg-slate-600 hover:bg-slate-500 text-slate-200 font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                        Testar
                    </button>
                </div>
                {testStatus[provider].status === 'error' && (
                    <p className="text-xs text-red-400 mt-2">{testStatus[provider].message}</p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  Sua chave é salva apenas na sessão do seu navegador e nunca sai do seu computador.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 bg-slate-800/50 border-t border-slate-700 rounded-b-lg">
          <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ApiKeyModal;