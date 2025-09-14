import type { ModelConfig } from '../types';

// Reusing the OpenAI stream data format as Open Router is compatible
interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    delta: {
      content?: string;
    };
    index: number;
    finish_reason: string | null;
  }[];
}


export async function* runOpenRouterPrompt(
  systemInstruction: string,
  userPrompt: string,
  config: ModelConfig,
  apiKey: string
): AsyncGenerator<string> {
  if (!apiKey) {
    throw new Error("API key for Open Router is not configured. Please add it in the API Key configuration panel.");
  }

  const siteUrl = (typeof window !== 'undefined' && window.location.protocol && window.location.hostname)
    ? `${window.location.protocol}//${window.location.hostname}`
    : 'http://localhost:3000';

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': siteUrl,
        'X-Title': 'LLM Prompter',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
        temperature: config.temperature,
        top_p: config.topP,
        stream: true,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Open Router API Error: ${errorData.error?.message || response.statusText}`);
    }

    if (!response.body) {
      throw new Error("The response body is empty.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          if (data.trim() === '[DONE]') {
            return;
          }
          try {
            const parsed: ChatCompletionChunk = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            // Ignorar erros de parsing de stream
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
        throw new Error(`Erro na API Open Router: ${error.message}`);
    }
    throw new Error("Erro desconhecido ao comunicar com a API Open Router.");
  }
}
