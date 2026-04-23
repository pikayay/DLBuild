'use server';

import { GoogleGenAI } from '@google/genai';

// We create the client, assuming process.env.GEMINI_API_KEY is set in the environment.
// In a real implementation, you'd ensure this key is securely stored in your .env.local
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

export async function summarizeItemSentiment(formData: FormData) {
  const itemOrHeroName = formData.get('query')?.toString() || '';
  
  if (!itemOrHeroName) {
    return { error: 'Please provide an item or hero name.' };
  }

  try {
    if (!ai) {
      // Return a mocked response for now since the API isn't fully set up/key isn't provided
      return { 
        success: true, 
        summary: `(Mocked) Community sentiment for "${itemOrHeroName}" suggests it is highly situational but very powerful in the late game. Players often complain about its cost, but praise its utility.`
      };
    }

    const prompt = `Sourcing from the Deadlock subreddit and forums (or your general knowledge of the game Deadlock), what is the community sentiment around: "${itemOrHeroName}"? Be concise and informative for a build-crafter.`;

    // Make the actual call to Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return { success: true, summary: response.text };
  } catch (error) {
    console.error('Error fetching AI summary:', error);
    return { error: 'Failed to generate summary. Please try again later.' };
  }
}
