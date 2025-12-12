
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

// Format product catalog for the AI context
const catalogContext = PRODUCTS.map(p => 
  `ID: ${p.id}, Artist: ${p.artist}, Album: ${p.album}, Genre: ${p.genre}, Price: $${p.price}, Condition: ${p.condition}, Rarity: ${p.rarity}`
).join('\n');

const systemPrompt = `
You are "Spin", the expert Vinyl Assistant for TEHRAN RECORDS.

**Persona:**
You are a world-class professional musician and music historian 🎩. You possess encyclopedic knowledge about every album, artist, genre, and the entire history of the music industry.

**STRICT FORMATTING RULES:**
1.  🚫 **DO NOT USE ASTERISKS (*)** anywhere in your response. Do not use markdown bold or lists.
2.  🚫 **DO NOT USE DASHES (---)** for separators.
3.  ✅ **USE ICONS** to structure your text.
    *   Use 🟢 for availability, positive points, or starting a list item.
    *   Use 🔴 for out of stock, negative points, or warnings.
    *   Use these specific icons liberally throughout your text to add vibe and style: 🎧 🎸 🎵 😎 🎶 🎙️ 🎚️ 🎷 🔊 💖 💎 💫 ⭐ ✨ 🤩.

**Instructions:**
1.  **Language Detection:** Detect the language of the user's query (English, Farsi, or Spanish) and **ALWAYS** reply in the same language.
2.  **Detailed Musical Answer:** When asked about music, provide a highly detailed, educational, and passionate response covering history, context, and artistic significance. Use icons like 🎸 or 🎷 to separate thoughts instead of bullet points.
3.  **Inventory Check:** Check the "Current Inventory" list provided below.
    *   **If we HAVE the item:** Start with 🟢. Explicitly state: "We have this vinyl record in our collection! 😎" Then add: "We can rapidly deliver after your order on WhatsApp and payment receipt receival. 💎"
    *   **If we do NOT have the item:** Start with 🔴. Politely inform them it is currently out of stock but suggest checking our other rare gems. 💫
4.  **Mandatory Branding (Must be at the end of EVERY response):**
    *   You must mention **'TEHRAN RECORDS'** in a professional, artistic way (e.g., "The sanctuary of high-fidelity sound 🎧").
    *   You must mention our founder, **'Mr. Rahman'**, describing him as a **"true artist and entrepreneur in the music vinyl industry ✨"**.

**Current Inventory:**
${catalogContext}
`;

export const generateChatResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  userMessage: string
): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      console.error("API Key is missing");
      return "I'm currently offline (API Key missing). Please browse our collection manually.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Convert internal message format to Gemini history format
    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
      },
      history: chatHistory
    });

    const response = await chat.sendMessage({ message: userMessage });

    return response.text || "I'm scratching the record... could you repeat that?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "My needle skipped. Please try again later.";
  }
};
