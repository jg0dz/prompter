import type { LLMProvider } from '../types';
import type { KeyTestStatus } from '../App';

type ValidationResult = {
    status: KeyTestStatus;
    message: string;
}

async function validateGeminiKey(apiKey: string): Promise<ValidationResult> {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?pageSize=1&key=${apiKey}`);
        if (response.ok) {
            return { status: 'success', message: 'Chave válida!' };
        }
        const errorData = await response.json();
        return { status: 'error', message: errorData.error?.message || 'Chave inválida ou incorreta.' };
    } catch (error) {
        return { status: 'error', message: 'Falha na rede ao testar a chave.' };
    }
}

async function validateOpenAIKey(apiKey: string): Promise<ValidationResult> {
    try {
        const response = await fetch("https://api.openai.com/v1/models", {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` },
        });
        if (response.ok) {
            return { status: 'success', message: 'Chave válida!' };
        }
        const errorData = await response.json();
        return { status: 'error', message: errorData.error?.message || 'Chave inválida ou incorreta.' };
    } catch (error) {
        return { status: 'error', message: 'Falha na rede ao testar a chave.' };
    }
}

async function validateOpenRouterKey(apiKey: string): Promise<ValidationResult> {
    const siteUrl = (typeof window !== 'undefined' && window.location.protocol && window.location.hostname)
      ? `${window.location.protocol}//${window.location.hostname}`
      : 'http://localhost:3000';

    try {
        const response = await fetch("https://openrouter.ai/api/v1/models", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': siteUrl,
                'X-Title': 'LLM Prompter',
            },
        });
        if (response.ok) {
            return { status: 'success', message: 'Chave válida!' };
        }
        const errorData = await response.json();
        return { status: 'error', message: errorData.error?.message || 'Chave inválida ou incorreta.' };
    } catch (error) {
        return { status: 'error', message: 'Falha na rede ao testar a chave.' };
    }
}


export async function validateApiKey(provider: LLMProvider, apiKey: string): Promise<ValidationResult> {
    switch (provider) {
        case 'Google Gemini':
            return validateGeminiKey(apiKey);
        case 'OpenAI':
            return validateOpenAIKey(apiKey);
        case 'Open Router':
            return validateOpenRouterKey(apiKey);
        default:
            return { status: 'error', message: 'Provedor desconhecido.' };
    }
}
