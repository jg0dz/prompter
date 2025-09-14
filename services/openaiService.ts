
import type { ModelConfig } from '../types';

// OpenAI/Open Router stream data format
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


export async function* runOpenAIPrompt(
  systemInstruction: string,
  userPrompt: string,
  config: ModelConfig,
  apiKey: string
): AsyncGenerator<string> {
  if (!apiKey) {
    throw new Error("API key for OpenAI is not configured. Please add it in the API Key configuration panel.");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
        throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
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
        throw new Error(`Erro na API OpenAI: ${error.message}`);
    }
    throw new Error("Erro desconhecido ao comunicar com a API OpenAI.");
  }
}
