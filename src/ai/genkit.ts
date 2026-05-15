
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview Genkit initialization.
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash-exp', // Fast and reliable for gourmet JSON
});
