
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

/**
 * @fileOverview Genkit initialization.
 * Configured with Google AI plugin for image generation capabilities.
 */
export const ai = genkit({
  plugins: [googleAI()],
});
