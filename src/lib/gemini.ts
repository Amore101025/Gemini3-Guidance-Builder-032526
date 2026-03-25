import { GoogleGenAI } from '@google/genai';

export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing');
  }
  return new GoogleGenAI({ apiKey });
};

export const generateContentStream = async function* (
  model: string,
  prompt: string,
  systemInstruction?: string
) {
  const ai = getGeminiClient();
  const response = await ai.models.generateContentStream({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.2,
    },
  });

  for await (const chunk of response) {
    yield chunk.text;
  }
};

export const generateContent = async (
  model: string,
  prompt: string,
  systemInstruction?: string
) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.2,
    },
  });
  return response.text;
};
