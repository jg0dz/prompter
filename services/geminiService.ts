
import { GoogleGenAI } from "@google/genai";
import type { ModelConfig } from '../types';

export async function* runPrompt(
  systemInstruction: string,
  userPrompt: string,
  config: ModelConfig,
  apiKey: string
): AsyncGenerator<string> {
  if (!apiKey) {
    throw new Error("API key for Google Gemini is not configured. Please add it in the API Key configuration panel.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContentStream({
      model: config.model,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: config.temperature,
        topP: config.topP,
      },
    });

    for await (const chunk of response) {
        yield chunk.text;
    }
  } catch (error) {
    if (error instanceof Error) {
        throw new Error(`Erro na API Gemini: ${error.message}`);
    }
    throw new Error("Erro desconhecido ao comunicar com a API Gemini.");
  }
}
