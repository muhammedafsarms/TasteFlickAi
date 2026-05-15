
import {genkit} from 'genkit';

/**
 * @fileOverview Genkit initialization. 
 * Note: We are now using the Groq client directly within flows 
 * to handle specialized migration requirements.
 */

export const ai = genkit({});
