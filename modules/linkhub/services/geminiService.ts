import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateBio = async (name: string, keywords: string, currentBio: string, language: Language): Promise<string> => {
  if (!ai) {
    console.error("API Key missing");
    return language === 'tr' ? "API anahtarı bulunamadı." : "API Key missing.";
  }

  try {
    const langName = language === 'tr' ? 'Turkish' : 'English';
    const prompt = `
      Sen yaratıcı bir sosyal medya asistanısın. Aşağıdaki bilgilere göre kısa, etkileyici ve emojiler içeren bir sosyal medya biyografisi (bio) yaz.
      
      Yazılacak Dil: ${langName}
      Maksimum uzunluk: 150 karakter.

      Kullanıcı Adı: ${name}
      İlgi Alanları/Anahtar Kelimeler: ${keywords}
      Mevcut Bio (varsa): ${currentBio}

      Sadece biyografi metnini döndür.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || (language === 'tr' ? "Biyografi oluşturulamadı." : "Could not generate bio.");
  } catch (error) {
    console.error("Gemini bio generation error:", error);
    return language === 'tr' ? "Bir hata oluştu. Lütfen tekrar deneyin." : "An error occurred. Please try again.";
  }
};