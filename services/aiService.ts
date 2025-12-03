import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMarketDescription = async (title: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a financial analyst for a prediction market platform called Vantage. 
      Write a concise, professional, and precise description (max 80 words) for a prediction market with the title: "${title}".
      
      The description should:
      1. Explain the context briefly.
      2. Clearly define the resolution criteria (what explicitly causes the market to resolve to YES vs NO).
      3. Be neutral and institutional in tone.
      
      Do not include any intro text like "Here is the description". Just output the description text.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Market resolution will be determined by official consensus from reliable reporting agencies. (AI Generation Failed)";
  }
};