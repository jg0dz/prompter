
export interface PromptBlock {
  id: string;
  title: string;
  content: string;
}

export type LLMProvider = 'Google Gemini' | 'OpenAI' | 'Open Router';

export interface ModelConfig {
  provider: LLMProvider;
  temperature: number;
  topP: number;
  model: string;
}

export type ApiKeys = {
  [key in LLMProvider]?: string;
};
