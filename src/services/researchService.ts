import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function researchStreamer(streamerName: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Research the streamer named "${streamerName}". Provide a detailed summary including their main platforms, content style, notable moments, and social media links.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return response.text;
}
