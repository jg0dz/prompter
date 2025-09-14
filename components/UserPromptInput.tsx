import React, { memo } from 'react';
import type { PromptBlock } from '../types';
import InputLabel from './common/InputLabel';

interface UserPromptInputProps {
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isImproving: boolean;
  systemBlocks: PromptBlock[];
}

const UserPromptInput: React.FC<UserPromptInputProps> = memo(({
  userPrompt, setUserPrompt, onSubmit, isLoading, isImproving, systemBlocks
}) => {

  const copyPrompt = () => {
    const fullPrompt = systemBlocks.map(b => `${b.title}\n${b.content}`).join('\n\n') + `\n\n---\n\n${userPrompt}`;
    navigator.clipboard.writeText(fullPrompt);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <InputLabel htmlFor="user-prompt">User Prompt</InputLabel>
        <textarea
          id="user-prompt"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Digite sua pergunta ou solicitação aqui... (ex: 'Crie um post para Instagram sobre nosso produto', 'Escreva um email de marketing', 'Gere ideias para conteúdo')"
          rows={8}
          className="w-full bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-slate-300 font-mono text-sm focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 outline-none transition-all duration-200 shadow-lg"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onSubmit}
          disabled={isLoading || isImproving}
          className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 disabled:bg-emerald-500/10 text-emerald-300 hover:text-emerald-200 disabled:text-emerald-300/50 font-medium py-2.5 px-4 rounded-md transition-all duration-200 border border-emerald-500/20 hover:border-emerald-500/30 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Testando...' : 'Testar Prompt'}
        </button>
        <button
          onClick={copyPrompt}
          disabled={isLoading || isImproving}
          className="flex-shrink-0 bg-slate-800/50 hover:bg-slate-700/50 disabled:bg-slate-800/30 text-slate-300 hover:text-slate-200 disabled:text-slate-300/50 font-medium py-2.5 px-4 rounded-md transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50 disabled:cursor-not-allowed"
        >
          Copiar Prompt
        </button>
      </div>
    </div>
  );
});

export default UserPromptInput;
