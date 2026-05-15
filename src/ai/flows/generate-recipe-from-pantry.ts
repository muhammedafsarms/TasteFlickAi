'use server';
/**
 * @fileOverview A Genkit flow for generating gourmet-style recipes based on available pantry ingredients and dietary preferences.
 *
 * - generateRecipeFromPantry - A function that generates a recipe.
 * - GenerateRecipeFromPantryInput - The input type for the generateRecipeFromPantry function.
 * - GenerateRecipeFromPantryOutput - The return type for the generateRecipeFromPantry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeFromPantryInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients available in the pantry.'),
  dietaryPreferences: z
    .array(z.string())
    .optional()
    .describe(
      'Optional dietary preferences or restrictions (e.g., "vegetarian", "gluten-free", "low-carb").'
    ),
});
export type GenerateRecipeFromPantryInput = z.infer<
  typeof GenerateRecipeFromPantryInputSchema
>;

const GenerateRecipeFromPantryOutputSchema = z.object({
  recipeName: z.string().describe('The name of the gourmet recipe.'),
  description: z
    .string()
    .describe('A brief, enticing description of the recipe.'),
  instructions: z
    .array(z.string())
    .describe('A step-by-step guide to prepare the recipe.'),
  ingredientsList: z
    .array(z.string())
    .describe(
      'A detailed list of ingredients with quantities needed for the recipe.'
    ),
  dietaryNotes: z
    .string()
    .describe('Any notes regarding dietary compliance or suggestions.'),
});
export type GenerateRecipeFromPantryOutput = z.infer<
  typeof GenerateRecipeFromPantryOutputSchema
>;

export async function generateRecipeFromPantry(
  input: GenerateRecipeFromPantryInput
): Promise<GenerateRecipeFromPantryOutput> {
  return generateRecipeFromPantryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeFromPantryPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: GenerateRecipeFromPantryInputSchema},
  output: {schema: GenerateRecipeFromPantryOutputSchema},
  prompt: `You are a world-class gourmet chef with particular mastery in Indian regional cuisines (North Indian, South Indian, Bengali, Coastal, etc.) and global fusion.

Your task is to craft a unique, gourmet-style recipe (potentially an exquisite Indian masterpiece or a bold fusion) using the ingredients provided. You have access to a virtually infinite database of culinary techniques and flavor profiles.

Ingredients available: {{#each ingredients}}- {{{this}}}{{/each}}

{{#if dietaryPreferences}}Dietary preferences/restrictions: {{#each dietaryPreferences}}- {{{this}}}{{/each}}{{else}}No specific dietary preferences provided.{{/if}}

If Indian ingredients (like Basmati rice, Paneer, Garam Masala, or Curry Leaves) are present, lean into authentic Indian gourmet preparation. Invent a creative recipe name and provide a description, step-by-step instructions, a detailed ingredient list with quantities, and dietary notes. Focus on presentation, aromatic complexity, and harmonious flavor combinations.`,
});

const generateRecipeFromPantryFlow = ai.defineFlow(
  {
    name: 'generateRecipeFromPantryFlow',
    inputSchema: GenerateRecipeFromPantryInputSchema,
    outputSchema: GenerateRecipeFromPantryOutputSchema,
  },
  async (input) => {
    let retries = 3;
    let lastError: any;

    while (retries > 0) {
      try {
        const {output} = await prompt(input);
        if (!output) throw new Error('No output from prompt');
        return output;
      } catch (error: any) {
        lastError = error;
        const errorMsg = error.message?.toLowerCase() || '';
        const isRetryable = errorMsg.includes('503') || 
                          errorMsg.includes('high demand') || 
                          errorMsg.includes('unavailable') || 
                          errorMsg.includes('rate limit') ||
                          errorMsg.includes('429') ||
                          errorMsg.includes('404');
        
        if (isRetryable && retries > 1) {
          retries--;
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        throw error;
      }
    }
    throw lastError || new Error('Failed to generate recipe after retries');
  }
);
