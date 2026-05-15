import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview Genkit initialization.
 * Configured with Google AI plugin for image generation capabilities.
 */
export const ai = genkit({
  plugins: [googleAI()],
});
