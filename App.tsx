import React, { useState, useCallback, useEffect } from 'react';
import type { PromptBlock, ModelConfig, ApiKeys, LLMProvider } from './types';
import ConfigPanel from './components/ConfigPanel';
import SystemPromptEditor from './components/SystemPromptEditor';
import UserPromptInput from './components/UserPromptInput';
import OutputDisplay from './components/OutputDisplay';
import Modal from './components/common/Modal';
import ApiKeyModal from './components/ApiKeyModal';
import AgentCreatorModal from './components/AgentCreatorModal';
import { RefinementModal } from './components/RefinementModal';
import { CostEstimator } from './components/CostEstimator';
import { PromptActions } from './components/PromptActions';
import { XIcon } from './components/icons';
import { DEFAULT_CONFIG, META_SYSTEM_INSTRUCTION } from './constants';
import { runPrompt as runGeminiPrompt } from './services/geminiService';
import { runOpenAIPrompt } from './services/openaiService';
import { runOpenRouterPrompt } from './services/openRouterService';
import { validateApiKey } from './services/apiKeyValidator';

const initialSystemBlocks: PromptBlock[] = [];

export type KeyTestStatus = 'idle' | 'testing' | 'success' | 'error';

function App() {
  const [config, setConfig] = useState<ModelConfig>(DEFAULT_CONFIG);
  const [systemBlocks, setSystemBlocks] = useState<PromptBlock[]>(initialSystemBlocks);
  const [userPrompt, setUserPrompt] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImproving, setIsImproving] = useState<boolean>(false);
  const [isCreatingAgent, setIsCreatingAgent] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [expandedBlock, setExpandedBlock] = useState<PromptBlock | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isAgentCreatorOpen, setIsAgentCreatorOpen] = useState(false);
  const [isRefinementOpen, setIsRefinementOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [keyTestStatus, setKeyTestStatus] = useState<Record<LLMProvider, {status: KeyTestStatus, message: string}>>({
    'Google Gemini': { status: 'idle', message: '' },
    'OpenAI': { status: 'idle', message: '' },
    'Open Router': { status: 'idle', message: '' },
  });

  useEffect(() => {
    try {
      const storedKeys = sessionStorage.getItem('apiKeys');
      if (storedKeys) {
        const parsedKeys = JSON.parse(storedKeys);
        setApiKeys(parsedKeys);
      }
    } catch (e) {
      // Falha silenciosa ao carregar chaves
    }
  }, []);

  // Verificar chave do provedor atual quando mudar
  useEffect(() => {
    const currentKey = apiKeys[config.provider];
    if (!currentKey) {
      setError(null); // Limpa erros anteriores
    }
  }, [config.provider, apiKeys]);

  const handleSaveApiKeys = (keys: ApiKeys) => {
    setApiKeys(keys);
    try {
      sessionStorage.setItem('apiKeys', JSON.stringify(keys));
    } catch (error) {
      // Falha silenciosa ao salvar chaves
    }
    setIsKeyModalOpen(false);
  };

  const handleTestKey = async (provider: LLMProvider, key: string) => {
    if (!key || key.trim() === '') {
      setKeyTestStatus(prev => ({ ...prev, [provider]: { status: 'error', message: 'A chave não pode estar vazia.' } }));
      return;
    }
    setKeyTestStatus(prev => ({ ...prev, [provider]: { status: 'testing', message: 'Testando chave...' } }));
    try {
      const result = await validateApiKey(provider, key.trim());
      setKeyTestStatus(prev => ({ ...prev, [provider]: result }));
    } catch (error) {
      setKeyTestStatus(prev => ({ ...prev, [provider]: { status: 'error', message: 'Erro inesperado ao testar a chave.' } }));
    }
  };

  const handleConfigChange = useCallback(<K extends keyof ModelConfig>(key: K, value: ModelConfig[K]) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      return newConfig;
    });
  }, []);

  const parseImprovedPrompt = (responseText: string): PromptBlock[] | null => {
    if (!responseText || !responseText.trim()) return null;

    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```') && cleanedText.endsWith('```')) {
      const firstNewline = cleanedText.indexOf('\n');
      const lastBackticks = cleanedText.lastIndexOf('```');
      if (firstNewline !== -1 && lastBackticks !== -1) {
        cleanedText = cleanedText.substring(firstNewline + 1, lastBackticks).trim();
      }
    }

    const blockRegex = /(#\s[^\n]+)([\s\S]*?(?=\n#\s|$))/g;
    const matches = [...cleanedText.matchAll(blockRegex)];

    if (matches.length === 0) return null;

    const newBlocks: PromptBlock[] = matches.map((match, index) => {
        const title = match[1].trim();
        const content = match[2].trim();
        return {
            id: Date.now().toString() + index,
            title,
            content
        };
    });

    return newBlocks.length > 0 ? newBlocks : null;
  };

  const handleRefineAgent = async (observation: string) => {
    setIsRefining(true);
    setError(null);

    const apiKey = apiKeys[config.provider];
    if (!apiKey) {
        const errorMessage = `Por favor, configure a chave de API do ${config.provider} antes de continuar. Clique no botão "Configurar Chaves de API" acima.`;
        setError(errorMessage);
        setIsRefining(false);
        setIsRefinementOpen(false);
        setIsKeyModalOpen(true);
        return;
    }

    const currentSystemPrompt = systemBlocks
      .map(block => `${block.title}\n\n${block.content}`)
      .join('\n\n---\n\n');

    const metaSystemInstruction = META_SYSTEM_INSTRUCTION;
    const metaUserPrompt = `CURRENT SYSTEM PROMPT:\n${currentSystemPrompt}\n\nUSER'S REFINEMENT REQUEST:\n"${observation}"\n\nPlease refine the system prompt based on the user's observation.`;

    try {
        let stream: AsyncGenerator<string>;

        if (config.provider === 'Google Gemini') {
            stream = runGeminiPrompt(
                metaSystemInstruction,
                metaUserPrompt,
                { ...DEFAULT_CONFIG, model: 'gemini-2.5-flash', temperature: 0.6 },
                apiKey
            );
        } else if (config.provider === 'OpenAI') {
            stream = runOpenAIPrompt(
                metaSystemInstruction,
                metaUserPrompt,
                { ...DEFAULT_CONFIG, model: 'gpt-4o', temperature: 0.6 },
                apiKey
            );
        } else if (config.provider === 'Open Router') {
            stream = runOpenRouterPrompt(
                metaSystemInstruction,
                metaUserPrompt,
                { ...DEFAULT_CONFIG, model: 'anthropic/claude-3.5-sonnet', temperature: 0.6 },
                apiKey
            );
        } else {
            throw new Error(`Refinamento não suportado para ${config.provider}`);
        }

        let result = '';
        for await (const chunk of stream) {
            result += chunk;
        }

        const newBlocks = parseImprovedPrompt(result);
        if (newBlocks) {
            setSystemBlocks(newBlocks);
            setIsRefinementOpen(false);
        } else {
            setError("A IA não conseguiu refinar o agente ou retornou um formato inválido. Tente descrever sua observação de forma diferente.");
        }

    } catch (e: any) {
        setError(e.message || 'Ocorreu um erro inesperado ao refinar o agente.');
    } finally {
        setIsRefining(false);
    }
  };

  const handleTranslateToEn = async () => {
    setIsTranslating(true);
    setError(null);

    const apiKey = apiKeys[config.provider];
    if (!apiKey) {
        setError(`Por favor, configure a chave de API do ${config.provider} antes de continuar.`);
        setIsTranslating(false);
        return;
    }

    const currentSystemPrompt = systemBlocks
      .map(block => `${block.title}\n\n${block.content}`)
      .join('\n\n---\n\n');

    const translateInstruction = "Translate the following system prompt to English while maintaining its structure, meaning, and technical accuracy. Keep the block format intact.";
    const translatePrompt = `System Prompt to translate:\n\n${currentSystemPrompt}`;

    try {
        let stream: AsyncGenerator<string>;

        if (config.provider === 'Google Gemini') {
            stream = runGeminiPrompt(translateInstruction, translatePrompt, config, apiKey);
        } else if (config.provider === 'OpenAI') {
            stream = runOpenAIPrompt(translateInstruction, translatePrompt, config, apiKey);
        } else if (config.provider === 'Open Router') {
            stream = runOpenRouterPrompt(translateInstruction, translatePrompt, config, apiKey);
        } else {
            throw new Error(`Tradução não suportada para ${config.provider}`);
        }

        let result = '';
        for await (const chunk of stream) {
            result += chunk;
        }

        const newBlocks = parseImprovedPrompt(result);
        if (newBlocks) {
            setSystemBlocks(newBlocks);
        } else {
            setError("A IA não conseguiu traduzir o prompt ou retornou um formato inválido.");
        }

    } catch (e: any) {
        setError(e.message || 'Ocorreu um erro inesperado ao traduzir o prompt.');
    } finally {
        setIsTranslating(false);
    }
  };

  const handleTranslateToPt = async () => {
    setIsTranslating(true);
    setError(null);

    const apiKey = apiKeys[config.provider];
    if (!apiKey) {
        setError(`Por favor, configure a chave de API do ${config.provider} antes de continuar.`);
        setIsTranslating(false);
        return;
    }

    const currentSystemPrompt = systemBlocks
      .map(block => `${block.title}\n\n${block.content}`)
      .join('\n\n---\n\n');

    const translateInstruction = "Traduza o seguinte system prompt para Português do Brasil, mantendo sua estrutura, significado e precisão técnica. Mantenha o formato dos blocos intacto.";
    const translatePrompt = `System Prompt para traduzir:\n\n${currentSystemPrompt}`;

    try {
        let stream: AsyncGenerator<string>;

        if (config.provider === 'Google Gemini') {
            stream = runGeminiPrompt(translateInstruction, translatePrompt, config, apiKey);
        } else if (config.provider === 'OpenAI') {
            stream = runOpenAIPrompt(translateInstruction, translatePrompt, config, apiKey);
        } else if (config.provider === 'Open Router') {
            stream = runOpenRouterPrompt(translateInstruction, translatePrompt, config, apiKey);
        } else {
            throw new Error(`Tradução não suportada para ${config.provider}`);
        }

        let result = '';
        for await (const chunk of stream) {
            result += chunk;
        }

        const newBlocks = parseImprovedPrompt(result);
        if (newBlocks) {
            setSystemBlocks(newBlocks);
        } else {
            setError("A IA não conseguiu traduzir o prompt ou retornou um formato inválido.");
        }

    } catch (e: any) {
        setError(e.message || 'Ocorreu um erro inesperado ao traduzir o prompt.');
    } finally {
        setIsTranslating(false);
    }
  };

  const handleConvertToMarkdown = async () => {
    setIsConverting(true);
    setError(null);

    const newBlocks = systemBlocks.map(block => {
      // Remove todas as tags XML se existirem
      const cleanTitle = block.title
        .replace(/<\/?title>/g, '')
        .replace(/<\/?content>/g, '')
        .trim();
      
      const cleanContent = block.content
        .replace(/<\/?content>/g, '')
        .trim();

      // Remove qualquer # existente e adiciona ## no início
      const titleWithoutHash = cleanTitle.replace(/^#+\s*/, '');
      const markdownTitle = `## ${titleWithoutHash}`;

      return {
        ...block,
        title: markdownTitle,
        content: cleanContent
      };
    });

    setSystemBlocks(newBlocks);
    setIsConverting(false);
  };

  const handleConvertToXML = async () => {
    setIsConverting(true);
    setError(null);

    const newBlocks = systemBlocks.map(block => {
      // Primeiro limpa qualquer XML ou markdown existente
      let cleanTitle = block.title
        .replace(/<\/?title>/g, '')
        .replace(/<\/?content>/g, '')
        .replace(/^#+\s*/, '')
        .trim();

      let cleanContent = block.content
        .replace(/<\/?content>/g, '')
        .replace(/<\/?title>/g, '')
        .trim();

      // Adiciona as tags XML (sem o # no início)
      const xmlTitle = `<title>${cleanTitle}</title>`;
      const xmlContent = `<content>\n${cleanContent}\n</content>`;

      return {
        ...block,
        title: xmlTitle,
        content: xmlContent
      };
    });

    setSystemBlocks(newBlocks);
    setIsConverting(false);
  };

  const handleCreateAgent = async (description: string) => {
    setIsCreatingAgent(true);
    setError(null);

    // Verificar se há chave configurada para o provedor atual
    const apiKey = apiKeys[config.provider];
    if (!apiKey) {
        const errorMessage = `Por favor, configure a chave de API do ${config.provider} antes de continuar. Clique no botão "Configurar Chaves de API" acima.`;
        setError(errorMessage);
        setIsCreatingAgent(false);
        setIsAgentCreatorOpen(false);
        setIsKeyModalOpen(true); // Abre modal de configuração
        return;
    }

    const metaSystemInstruction = META_SYSTEM_INSTRUCTION;

    const metaUserPrompt = `USER's AGENT IDEA:\n"${description}"`;

    try {
        let stream: AsyncGenerator<string>;

        if (config.provider === 'Google Gemini') {
            stream = runGeminiPrompt(
                metaSystemInstruction,
                metaUserPrompt,
                { ...DEFAULT_CONFIG, model: 'gemini-2.5-flash', temperature: 0.6 },
                apiKey
            );
        } else if (config.provider === 'OpenAI') {
            stream = runOpenAIPrompt(
                metaSystemInstruction,
                metaUserPrompt,
                { ...DEFAULT_CONFIG, model: 'gpt-4o', temperature: 0.6 },
                apiKey
            );
        } else if (config.provider === 'Open Router') {
            stream = runOpenRouterPrompt(
                metaSystemInstruction,
                metaUserPrompt,
                { ...DEFAULT_CONFIG, model: 'anthropic/claude-3.5-sonnet', temperature: 0.6 },
                apiKey
            );
        } else {
            throw new Error(`Criação de agentes não suportada para ${config.provider}`);
        }

        let result = '';
        for await (const chunk of stream) {
            result += chunk;
        }

        const newBlocks = parseImprovedPrompt(result);
        if (newBlocks) {
            setSystemBlocks(newBlocks);
            setIsAgentCreatorOpen(false);
        } else {
            setError("A IA não conseguiu gerar o agente ou retornou um formato inválido. Tente descrever sua ideia de forma diferente.");
        }

    } catch (e: any) {
        setError(e.message || 'Ocorreu um erro inesperado ao criar o agente.');
    } finally {
        setIsCreatingAgent(false);
    }
  };

  const handleSuggestImprovement = async () => {
    setIsImproving(true);
    setError(null);

    const apiKey = apiKeys[config.provider];
    if (!apiKey) {
      const errorMessage = `Por favor, configure a chave de API do ${config.provider} antes de continuar. Clique no botão "Configurar Chaves de API" acima.`;
      setError(errorMessage);
      setIsImproving(false);
      setIsKeyModalOpen(true); // Abre modal de configuração
      return;
    }

    const currentSystemPrompt = systemBlocks
      .map(block => `${block.title}\n\n${block.content}`)
      .join('\n\n---\n\n');

    const metaSystemInstruction = "You are a world-class Prompt Engineering expert. Your task is to analyze and refine prompts to maximize their effectiveness with Large Language Models like Gemini. You follow instructions precisely and provide concise, direct, and actionable improvements.";

    const metaUserPrompt = `Analyze the following prompt components and provide an improved version of the SYSTEM PROMPT blocks.

Your goal is to make the system prompt clearer, more detailed, and structured for optimal performance. You can add, remove, or merge blocks as you see fit. Provide specific examples within the prompt content where helpful.

The response MUST BE ONLY the improved system prompt, formatted exactly as a series of blocks, each starting with a title line like '# TITLE'. Do not add any extra explanations, greetings, or introductory text like "Here is the improved prompt:".

---
CURRENT SYSTEM PROMPT:
${currentSystemPrompt}
---
CURRENT USER PROMPT (for context):
${userPrompt || "(No user prompt provided, assume a generic one related to the system prompt's context)"}
---
`;

    try {
        let stream: AsyncGenerator<string>;

        if (config.provider === 'Google Gemini') {
            stream = runGeminiPrompt(
                metaSystemInstruction,
                metaUserPrompt,
                { ...DEFAULT_CONFIG, model: 'gemini-2.5-flash', temperature: 0.5 },
                apiKey
            );
        } else if (config.provider === 'OpenAI') {
            stream = runOpenAIPrompt(
                metaSystemInstruction,
                metaUserPrompt,
                { ...DEFAULT_CONFIG, model: 'gpt-4o', temperature: 0.5 },
                apiKey
            );
        } else if (config.provider === 'Open Router') {
            stream = runOpenRouterPrompt(
                metaSystemInstruction,
                metaUserPrompt,
                { ...DEFAULT_CONFIG, model: 'anthropic/claude-3.5-sonnet', temperature: 0.5 },
                apiKey
            );
        } else {
            throw new Error(`Sugestão de melhorias não suportada para ${config.provider}`);
        }

        let result = '';
        for await (const chunk of stream) {
            result += chunk;
        }

        const newBlocks = parseImprovedPrompt(result);
        if (newBlocks) {
            setSystemBlocks(newBlocks);
        } else {
            setError("A IA retornou uma sugestão vazia ou em formato inválido. Por favor, tente novamente.");
        }

    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred while improving the prompt.');
    } finally {
      setIsImproving(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setOutput('');


    const systemInstruction = systemBlocks
      .map(block => `${block.title}\n\n${block.content}`)
      .join('\n\n---\n\n');

    try {
        const apiKey = apiKeys[config.provider];
        if (!apiKey) {
            setIsKeyModalOpen(true); // Abre modal de configuração
            throw new Error(`Por favor, configure a chave de API do ${config.provider} antes de continuar. Clique no botão "Configurar Chaves de API" acima.`);
        }

        let stream: AsyncGenerator<string>;

        if (config.provider === 'Google Gemini') {
            stream = runGeminiPrompt(systemInstruction, userPrompt, config, apiKey);
        } else if (config.provider === 'OpenAI') {
            stream = runOpenAIPrompt(systemInstruction, userPrompt, config, apiKey);
        } else if (config.provider === 'Open Router') {
            stream = runOpenRouterPrompt(systemInstruction, userPrompt, config, apiKey);
        } else {
            throw new Error(`API calls for ${config.provider} are not yet implemented in this tool.`);
        }

        for await (const chunk of stream) {
            setOutput(prevOutput => prevOutput + chunk);
        }

    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockChange = (blockId: string, field: 'title' | 'content', value: string) => {
    setSystemBlocks(prevBlocks =>
      prevBlocks.map(b => (b.id === blockId ? { ...b, [field]: value } : b))
    );
    if (expandedBlock && expandedBlock.id === blockId) {
        setExpandedBlock(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    setSystemBlocks(prevBlocks => {
      const index = prevBlocks.findIndex(b => b.id === blockId);
      if (index === -1) return prevBlocks;

      if (direction === 'up' && index > 0) {
        const newBlocks = [...prevBlocks];
        const [movedBlock] = newBlocks.splice(index, 1);
        newBlocks.splice(index - 1, 0, movedBlock);
        return newBlocks;
      }

      if (direction === 'down' && index < prevBlocks.length - 1) {
        const newBlocks = [...prevBlocks];
        const [movedBlock] = newBlocks.splice(index, 1);
        newBlocks.splice(index + 1, 0, movedBlock);
        return newBlocks;
      }

      return prevBlocks;
    });
  };


  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 gap-6 pb-8 bg-gradient-to-b from-slate-900 to-slate-950">
      <ConfigPanel
        config={config}
        onConfigChange={handleConfigChange}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      <main className="flex-grow grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col min-h-0 h-[calc(100vh-20rem)] xl:h-auto">
            <SystemPromptEditor
              systemBlocks={systemBlocks}
              setSystemBlocks={setSystemBlocks}
              onSuggestImprovement={handleSuggestImprovement}
              isLoading={isLoading}
              isImproving={isImproving}
              onExpandBlock={(block) => setExpandedBlock(block)}
              onMoveBlock={handleMoveBlock}
              onOpenAgentCreator={() => setIsAgentCreatorOpen(true)}
              onOpenRefinement={() => setIsRefinementOpen(true)}
              onTranslateToEn={handleTranslateToEn}
              onTranslateToPt={handleTranslateToPt}
              onConvertMarkdown={handleConvertToMarkdown}
              onConvertXML={handleConvertToXML}
              isTranslating={isTranslating}
              isConverting={isConverting}
            />
        </div>

        <div className="flex flex-col gap-4 min-h-0 h-[calc(100vh-20rem)] xl:h-auto">
            <UserPromptInput
                userPrompt={userPrompt}
                setUserPrompt={setUserPrompt}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isImproving={isImproving}
                systemBlocks={systemBlocks}
            />
            <div className="flex-grow min-h-0 flex flex-col">
                <div className="flex-grow min-h-0">
                    <OutputDisplay output={output} isLoading={isLoading} error={error} />
                </div>
                <div className="mt-3 flex-shrink-0">
                  <CostEstimator 
                    provider={config.provider}
                    promptLength={systemBlocks.reduce((acc, block) => acc + block.content.length, 0)}
                    responseLength={output.length}
                  />
                </div>
            </div>
        </div>
      </main>

      <Modal isOpen={!!expandedBlock} onClose={() => setExpandedBlock(null)}>
        {expandedBlock && (
          <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 flex flex-col w-full max-w-2xl h-[80vh] shadow-2xl">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <input
                type="text"
                value={expandedBlock.title}
                onChange={(e) => handleBlockChange(expandedBlock.id, 'title', e.target.value)}
                className="bg-transparent font-mono text-lg text-purple-300 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 w-full rounded-md px-2 py-1 transition-all duration-200"
              />
              <button
                onClick={() => setExpandedBlock(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                aria-label="Close modal"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={expandedBlock.content}
              onChange={(e) => handleBlockChange(expandedBlock.id, 'content', e.target.value)}
              placeholder="Você é um agente IA especializado..."
              className="w-full bg-slate-800/30 text-slate-300 text-base p-4 focus:outline-none focus:ring-1 focus:ring-slate-500/30 focus:border-slate-500/30 resize-none flex-grow rounded-lg font-mono transition-all duration-200"
              autoFocus
            />
          </div>
        )}
      </Modal>

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        currentKeys={apiKeys}
        onSave={handleSaveApiKeys}
        onTestKey={handleTestKey}
        testStatus={keyTestStatus}
      />

      <AgentCreatorModal
        isOpen={isAgentCreatorOpen}
        onClose={() => setIsAgentCreatorOpen(false)}
        onCreateAgent={handleCreateAgent}
        isCreating={isCreatingAgent}
      />

      <RefinementModal
        isOpen={isRefinementOpen}
        onClose={() => setIsRefinementOpen(false)}
        onRefine={handleRefineAgent}
        isRefining={isRefining}
      />
    </div>
  );
}

export default App;
