import React, { useState } from 'react';
import Modal from './common/Modal';
import { XIcon, WandIcon } from './icons';

interface AgentCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: (description: string) => Promise<void>;
  isCreating: boolean;
}

const AgentCreatorModal: React.FC<AgentCreatorModalProps> = ({ isOpen, onClose, onCreateAgent, isCreating }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!description.trim() || isCreating) return;
    await onCreateAgent(description);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-2xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <WandIcon className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-slate-200">Criar Novo Agente de IA</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-400 mb-4">
            Descreva a função ou a ideia do agente que você quer criar. A IA irá gerar uma estrutura de System Prompt completa para você usando as melhores práticas de engenharia de prompt.
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Um agente especialista em SEO que analisa URLs de artigos e sugere melhorias para título, meta-descrição e palavras-chave."
            rows={6}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3 p-4 bg-slate-800/50 border-t border-slate-700 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="bg-slate-600 hover:bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!description.trim() || isCreating}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {isCreating ? 'Gerando...' : 'Gerar Agente'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AgentCreatorModal;
