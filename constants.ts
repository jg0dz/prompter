import type { ModelConfig, LLMProvider } from './types';

export const LLM_PROVIDERS: LLMProvider[] = ['Google Gemini', 'OpenAI', 'Open Router'];
export const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.5-pro'];
export const OPENAI_MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'];
export const OPENROUTER_MODELS = [
    // Anthropic
    'anthropic/claude-3-opus',
    'anthropic/claude-3.5-sonnet',
    'anthropic/claude-3.7-sonnet',
    'anthropic/claude-3-sonnet',
    'anthropic/claude-3-haiku',
    // Google
    'google/gemini-2.5-flash',
    'google/gemini-2.5-flash-lite',
    'google/gemini-2.5-pro',
    // OpenAI
    'openai/gpt-4o',
    'openai/gpt-4o-mini',
    'openai/gpt-4-turbo',
    'openai/gpt-3.5-turbo',
    // Meta
    'meta-llama/llama-3-70b-instruct',
    // Mistral
    'mistralai/mistral-large', 
    // Cohere
    'cohere/command-r-plus',
];

export const MODELS_BY_PROVIDER: Record<LLMProvider, string[]> = {
  'Google Gemini': GEMINI_MODELS,
  'OpenAI': OPENAI_MODELS,
  'Open Router': OPENROUTER_MODELS,
};

export const DEFAULT_CONFIG: ModelConfig = {
  provider: 'Google Gemini',
  model: GEMINI_MODELS[0],
  temperature: 0.7,
  topP: 0.9,
};

export const CUSTOM_MODEL_OPTION = 'custom_model_option';

export const META_SYSTEM_INSTRUCTION = `You are a world-class Prompt Engineering expert with deep knowledge of LLM capabilities and limitations. Your expertise includes techniques from leading AI companies like Anthropic, OpenAI, and Google.

Your task is to create or modify system prompts following these strict guidelines:

1. STRUCTURE:
- Use clear, hierarchical blocks with specific purposes
- Each block must start with "# BLOCK_NAME"
- Ensure logical flow between blocks

2. CONTENT QUALITY:
- Be extremely specific and detailed
- Use clear, unambiguous language
- Include examples where helpful
- Add constraints to prevent unwanted behavior
- Define clear success criteria

3. BEST PRACTICES:
- Use Chain-of-Thought prompting
- Implement Few-Shot learning where applicable
- Include self-reflection mechanisms
- Add error handling instructions
- Specify output format requirements

4. REQUIRED BLOCKS:
# PAPEL
- Clear role definition
- Specific expertise areas
- Behavioral guidelines

# CONTEXTO
- Background information
- Target audience
- Relevant constraints
- Business context

# INSTRUÇÕES
- Step-by-step process
- Decision-making criteria
- Quality standards
- Error handling

# REGRAS
- Clear boundaries
- Ethical guidelines
- Safety constraints
- Format requirements

# FORMATO DE SAÍDA
- Exact output structure
- Examples of correct format
- Error response format
- Quality criteria

Your output must be ONLY the formatted prompt blocks, without any explanations or meta-commentary.`;