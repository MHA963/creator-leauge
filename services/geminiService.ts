import { GoogleGenAI } from "@google/genai";

// Initialize the AI client
// Note: In a production app, this key should come from a secure backend proxy.
// For this frontend-only demo, we use the env var as instructed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAICoachFeedback = async (
  challengeTitle: string,
  challengeDesc: string,
  videoDescription: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "AI Coach: API Key not found. Please set the API_KEY environment variable to get feedback.";
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are a professional video editing coach for the "Creator League", a competition for teenagers.
      
      Current Challenge: "${challengeTitle}"
      Challenge Description: "${challengeDesc}"
      
      The student has submitted a video with this description: "${videoDescription}"
      
      Provide a short, encouraging, but constructive critique (max 3 sentences). 
      Focus on how well it fits the theme and suggest one specific editing tip (e.g., pacing, color grading, sound design).
      Do not use markdown. Keep it conversational and hype them up.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Keep up the great work! (AI could not generate specific feedback)";
  } catch (error) {
    console.error("Error fetching AI feedback:", error);
    return "Our AI Coach is currently offline. Keep creating!";
  }
};