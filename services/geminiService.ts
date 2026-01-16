import { GoogleGenAI } from "@google/genai";
import { NotificationDraft } from "../types";

export const generateNotification = async (draft: NotificationDraft, language: 'EN' | 'TI'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are the secretary of a traditional Ethiopian Iddir (Community Association). 
    Write a short, culturally appropriate notification message for members.
    
    Context:
    Topic: ${draft.topic}
    Audience: ${draft.audience}
    Tone: ${draft.tone}
    Target Language: ${language === 'TI' ? 'Tigrigna (using Fidel script)' : 'English'}
    
    Instructions:
    - If Target Language is Tigrigna: Write the main message in proper, formal Tigrigna using Fidel script. Add a very brief English summary at the bottom.
    - If Target Language is English: Write in English, but include a brief Tigrigna translation at the bottom.
    - Keep it culturally respectful (e.g., using "Selam" or "Keburan").
    - Keep it under 100 words total.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating notification. Please try again later.";
  }
};

export const generateCommunityImage = async (): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = "A high-quality, photorealistic image of an Ethiopian community gathering (Iddir) in a modern hall. Elders and members wearing traditional white clothing (Hagerawi Libsi) and Netela, sitting in rows or circles, engaged in discussion. Warm lighting, cultural elements like a coffee ceremony setup in the corner. Professional photography.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
         imageConfig: { aspectRatio: "4:3" }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    return null;

  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return null;
  }
};

export const generateAboutContent = async (type: 'HISTORY' | 'VALUE', context: string, language: 'EN' | 'TI'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = "";
  
  if (type === 'HISTORY') {
      prompt = `
        You are a wise elder storyteller of an Ethiopian Iddir (Community Association) in Mekelle.
        The user wants to hear the full story of the Iddir based on this short summary: "${context}".
        
        Task: Write a warm, inspiring, and culturally rich narrative (about 150 words). 
        - Elaborate on the importance of unity (Mahber).
        - Mention the values of helping one another in sorrow and joy.
        - Language: ${language === 'TI' ? 'Tigrigna (using Fidel script)' : 'English'}.
      `;
  } else {
      prompt = `
        You are a cultural expert in Ethiopian traditions.
        The user is interested in the core value: "${context}".
        
        Task: 
        1. Provide a short, famous Ethiopian proverb (in ${language === 'TI' ? 'Tigrigna' : 'English/Amharic translated to English'}) related to this value.
        2. Explain briefly how this value applies to an Iddir community.
        - Keep it under 60 words.
        - Language of explanation: ${language === 'TI' ? 'Tigrigna' : 'English'}.
      `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Content generation unavailable.";
  } catch (error) {
    console.error("Gemini About Gen Error:", error);
    return "Could not contact the AI elder at this moment.";
  }
};