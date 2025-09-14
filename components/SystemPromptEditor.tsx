import React, { useState } from 'react';
import type { PromptBlock } from '../types';
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, SparklesIcon, ExpandIcon, WandIcon } from './icons';
import { PromptActions } from './PromptActions';

interface SystemPromptEditorProps {
  systemBlocks: PromptBlock[];
  setSystemBlocks: React.Dispatch<React.SetStateAction<PromptBlock[]>>;
  isLoading: boolean;
  onSuggestImprovement: () => void;
  isImproving: boolean;
  onExpandBlock: (block: PromptBlock) => void;
  onMoveBlock: (blockId: string, direction: 'up' | 'down') => void;
  onOpenAgentCreator: () => void;
  onOpenRefinement: () => void;
  onTranslateToEn: () => void;
  onTranslateToPt: () => void;
  onConvertMarkdown: () => void;
  onConvertXML: () => void;
  isTranslating: boolean;
  isConverting: boolean;
}

const SystemPromptEditor: React.FC<SystemPromptEditorProps> = ({
  systemBlocks, setSystemBlocks, isLoading, onSuggestImprovement, isImproving, onExpandBlock, onMoveBlock, onOpenAgentCreator,
  onOpenRefinement, onTranslateToEn, onTranslateToPt, onConvertMarkdown, onConvertXML, isTranslating, isConverting
}) => {
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(true);

  const addBlock = () => {
    setSystemBlocks(prev => [
      ...prev,
      { id: Date.now().toString(), title: '# NOVO BLOCO', content: '' }
    ]);
  };

  const updateBlock = (id: string, field: 'title' | 'content', value: string) => {
    setSystemBlocks(prev =>
      prev.map(block =>
        block.id === id ? { ...block, [field]: value } : block
      )
    );
  };

  const removeBlock = (id: string) => {
    setSystemBlocks(prev => prev.filter(block => block.id !== id));
  };

  const clearSystemPrompt = () => {
    if (window.confirm('Tem certeza que deseja apagar todo o System Prompt? Esta ação não pode ser desfeita.')) {
      setSystemBlocks([]);
    }
  };

  // Detectar se o prompt está vazio ou tem conteúdo mínimo
  const isPromptEmpty = systemBlocks.length === 0 ||
    systemBlocks.every(block =>
      (!block.title || block.title.trim() === '' || block.title === '# NOVO BLOCO') &&
      (!block.content || block.content.trim() === '')
    );

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg flex flex-col h-full">
      <div
        className="flex flex-col gap-4 p-4 flex-shrink-0"
      >
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsSystemPromptOpen(!isSystemPromptOpen)}
          >
            <h3 className="text-lg font-semibold text-slate-200">System Prompt</h3>
            <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform ${isSystemPromptOpen ? 'rotate-180' : ''}`} />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={addBlock}
              disabled={isLoading || isImproving}
              className="flex items-center gap-1.5 text-sm bg-slate-700/50 hover:bg-slate-600 disabled:bg-slate-700/30 disabled:cursor-not-allowed text-slate-300 font-medium py-1.5 px-3 rounded-md transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Novo Bloco</span>
            </button>
            <button
              onClick={clearSystemPrompt}
              disabled={isLoading || isImproving || systemBlocks.length === 0}
              className="flex items-center gap-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 disabled:bg-red-500/5 disabled:cursor-not-allowed text-red-400 hover:text-red-300 disabled:text-red-400/50 font-medium py-1.5 px-3 rounded-md transition-all duration-200 border border-red-500/20 hover:border-red-500/30"
              title="Apagar todo o System Prompt"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Apagar</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={(e) => isPromptEmpty ? onOpenAgentCreator() : onOpenRefinement()}
            disabled={isLoading || isImproving}
            className="flex items-center gap-1.5 text-sm bg-purple-500/20 hover:bg-purple-500/30 disabled:bg-purple-500/10 disabled:cursor-not-allowed text-purple-300 hover:text-purple-200 disabled:text-purple-300/50 font-medium py-1.5 px-3 rounded-md transition-all duration-200 border border-purple-500/20 hover:border-purple-500/30"
            title={isPromptEmpty ? "Criar um novo agente a partir de uma ideia" : "Refinar o agente existente"}
          >
            <WandIcon className="w-4 h-4" />
            <span>{isPromptEmpty ? "Criar Agente" : "Refinar"}</span>
          </button>
          
          <button
            onClick={onSuggestImprovement}
            disabled={isLoading || isImproving}
            className="flex items-center gap-1.5 text-sm bg-indigo-500/20 hover:bg-indigo-500/30 disabled:bg-indigo-500/10 disabled:cursor-not-allowed text-indigo-300 hover:text-indigo-200 disabled:text-indigo-300/50 font-medium py-1.5 px-3 rounded-md transition-all duration-200 border border-indigo-500/20 hover:border-indigo-500/30"
            title="Melhorar prompt automaticamente com IA"
          >
            {isImproving ? (
              <div className="w-4 h-4 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <SparklesIcon className="w-4 h-4" />
            )}
            <span>{isImproving ? 'Melhorando...' : 'Boost'}</span>
          </button>

          {systemBlocks.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <PromptActions
                onTranslateToEn={onTranslateToEn}
                onTranslateToPt={onTranslateToPt}
                onConvertMarkdown={onConvertMarkdown}
                onConvertXML={onConvertXML}
                isLoading={isLoading || isConverting}
                isTranslating={isTranslating}
              />
            </div>
          )}
        </div>
      </div>
      {isSystemPromptOpen && (
        <div className="p-4 border-t border-slate-700 flex flex-col gap-4 overflow-y-auto flex-grow">
          {systemBlocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4">
                <WandIcon className="w-12 h-12 text-slate-500 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-slate-300 mb-2">Bem-vindo ao LLM Prompter!</h3>
              <p className="text-slate-500 mb-6 max-w-md">
                Comece criando seu primeiro agente IA ou adicione blocos de prompt para definir o comportamento do sistema.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onOpenAgentCreator}
                  className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 font-medium py-2 px-4 rounded-md transition-all duration-200 border border-purple-500/20 hover:border-purple-500/30"
                >
                  <WandIcon className="w-4 h-4" />
                  Criar Agente IA
                </button>
                <button
                  onClick={addBlock}
                  className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600 text-slate-300 hover:text-slate-200 font-medium py-2 px-4 rounded-md transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
                >
                  <PlusIcon className="w-4 h-4" />
                  Adicionar Bloco
                </button>
              </div>
            </div>
          ) : (
            systemBlocks.map((block, index) => (
            <div key={block.id} className="bg-slate-900/30 backdrop-blur-sm rounded-lg border border-slate-700/50 flex flex-col shadow-lg transition-all duration-200 hover:border-slate-600/50">
              <div className="flex justify-between items-center p-3 border-b border-slate-700/50">
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
                  className="bg-transparent font-mono text-sm text-purple-300 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 w-full border border-transparent rounded-md px-2 py-1 transition-all duration-200"
                  placeholder="# TÍTULO DO BLOCO"
                />
                <div className="flex items-center gap-3 text-slate-500 flex-shrink-0">
                    <button 
                      onClick={() => onExpandBlock(block)} 
                      className="hover:text-sky-400 transition-colors duration-200" 
                      title="Expandir bloco"
                    >
                        <ExpandIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => removeBlock(block.id)} 
                      className="hover:text-red-400 transition-colors duration-200" 
                      title="Remover bloco"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                    <div className="flex flex-col -space-y-1">
                      <button
                        onClick={() => onMoveBlock(block.id, 'up')}
                        disabled={index === 0}
                        className="disabled:opacity-25 disabled:cursor-not-allowed hover:text-white transition-colors duration-200"
                        aria-label="Move block up"
                      >
                        <ChevronUpIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onMoveBlock(block.id, 'down')}
                        disabled={index === systemBlocks.length - 1}
                        className="disabled:opacity-25 disabled:cursor-not-allowed hover:text-white transition-colors duration-200"
                        aria-label="Move block down"
                      >
                        <ChevronDownIcon className="w-4 h-4" />
                      </button>
                    </div>
                </div>
              </div>
              <textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                  placeholder="Descreva o papel, contexto, instruções ou regras para o agente IA..."
                rows={5}
                className="w-full bg-transparent text-slate-300 text-sm p-4 focus:outline-none focus:ring-1 focus:ring-slate-500/30 focus:border-slate-500/30 resize-y flex-grow border border-transparent rounded-md font-mono transition-all duration-200"
              />
            </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SystemPromptEditor;
