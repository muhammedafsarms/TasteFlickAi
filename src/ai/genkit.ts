
import { genkit } from 'genkit';

/**
 * @fileOverview Genkit initialization.
 * Simplified to remove Google AI plugin as image generation is no longer required.
 */
export const ai = genkit({
  plugins: [],
});
