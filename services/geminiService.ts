
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

// Removed global ai instance to initialize with fresh API key per request

export const breakdownTask = async (taskTitle: string, description: string) => {
  // Always initialize fresh to ensure latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `أنت مساعد إنتاجية احترافي. قم بتقسيم المهمة التالية إلى خطوات عملية (subtasks) باللغة العربية.
    المهمة: "${taskTitle}"
    الوصف: "${description}"
    اقترح أيضاً جلسة بومودورو مناسبة (بالدقائق).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subtasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                duration: { type: Type.NUMBER, description: "المدة المتوقعة بالدقائق" }
              },
              required: ["title", "duration"]
            }
          },
          recommendedPomodoro: { type: Type.NUMBER }
        },
        required: ["subtasks", "recommendedPomodoro"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const getBehavioralAnalysis = async (tasks: Task[], focusTime: number) => {
  const taskSummary = tasks.slice(0, 10).map(t => ({ title: t.title, category: t.category, status: t.status }));
  
  // Always initialize fresh to ensure latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `قم بتحليل نمط الإنتاجية التالي وقدم 3 نصائح مهنية مختصرة ومحفزة باللغة العربية.
    إجمالي وقت التركيز: ${focusTime} دقيقة.
    المهام الأخيرة: ${JSON.stringify(taskSummary)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};
