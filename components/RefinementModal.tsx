import React, { useState } from 'react';
import Modal from './common/Modal';
import { XIcon } from './icons';

interface RefinementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefine: (observation: string) => void;
  isRefining: boolean;
}

export const RefinementModal: React.FC<RefinementModalProps> = ({
  isOpen,
  onClose,
  onRefine,
  isRefining
}) => {
  const [observation, setObservation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (observation.trim()) {
      onRefine(observation.trim());
      setObservation('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-[90vw] max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Refinar Agente</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Fechar modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Descreva as alterações que deseja fazer no agente:
            </label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ex: Adicionar mais exemplos práticos, incluir validação de dados, melhorar a estrutura de saída..."
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={isRefining}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isRefining}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!observation.trim() || isRefining}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isRefining ? 'Refinando...' : 'Refinar Agente'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
