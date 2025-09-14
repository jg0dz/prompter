import React from 'react';

interface PromptActionsProps {
  onTranslateToEn: () => void;
  onTranslateToPt: () => void;
  onConvertMarkdown: () => void;
  onConvertXML: () => void;
  isLoading?: boolean;
  isTranslating?: boolean;
}

export const PromptActions: React.FC<PromptActionsProps> = ({
  onTranslateToEn,
  onTranslateToPt,
  onConvertMarkdown,
  onConvertXML,
  isLoading = false,
  isTranslating = false
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={onTranslateToPt}
          disabled={isLoading || isTranslating}
          className="flex items-center gap-1.5 text-sm bg-sky-500/10 hover:bg-sky-500/20 disabled:bg-sky-500/5 disabled:cursor-not-allowed text-sky-400 hover:text-sky-300 disabled:text-sky-400/50 font-medium py-1.5 px-3 rounded-l-md transition-all duration-200 border border-sky-500/20 hover:border-sky-500/30"
          title="Traduzir para Português"
        >
          <span>🇧🇷 PT</span>
        </button>
        <button
          onClick={onTranslateToEn}
          disabled={isLoading || isTranslating}
          className="flex items-center gap-1.5 text-sm bg-sky-500/10 hover:bg-sky-500/20 disabled:bg-sky-500/5 disabled:cursor-not-allowed text-sky-400 hover:text-sky-300 disabled:text-sky-400/50 font-medium py-1.5 px-3 rounded-r-md transition-all duration-200 border border-sky-500/20 hover:border-sky-500/30 border-l-0"
          title="Traduzir para Inglês"
        >
          <span>🇺🇸 EN</span>
        </button>
      </div>
      <button
        onClick={onConvertMarkdown}
        disabled={isLoading}
        className="flex items-center gap-1.5 text-sm bg-emerald-500/10 hover:bg-emerald-500/20 disabled:bg-emerald-500/5 disabled:cursor-not-allowed text-emerald-400 hover:text-emerald-300 disabled:text-emerald-400/50 font-medium py-1.5 px-3 rounded-md transition-all duration-200 border border-emerald-500/20 hover:border-emerald-500/30"
      >
        <span>Markdown</span>
      </button>
      <button
        onClick={onConvertXML}
        disabled={isLoading}
        className="flex items-center gap-1.5 text-sm bg-amber-500/10 hover:bg-amber-500/20 disabled:bg-amber-500/5 disabled:cursor-not-allowed text-amber-400 hover:text-amber-300 disabled:text-amber-400/50 font-medium py-1.5 px-3 rounded-md transition-all duration-200 border border-amber-500/20 hover:border-amber-500/30"
      >
        <span>XML</span>
      </button>
    </div>
  );
};
