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
  input: {schema: GenerateRecipeFromPantryInputSchema},
  prompt: `You are a world-class gourmet chef with mastery in global fusion and Indian regional cuisines.

Your task is to craft a unique, gourmet-style recipe using the ingredients provided.

Ingredients available: {{#each ingredients}}- {{{this}}}{{/each}}

{{#if dietaryPreferences}}Dietary preferences: {{#each dietaryPreferences}}- {{{this}}}{{/each}}{{/if}}

Return ONLY a raw JSON object with the following structure. Do not include markdown formatting or extra text:
{
  "recipeName": "...",
  "description": "...",
  "instructions": ["step 1", "step 2", ...],
  "ingredientsList": ["quantity item", ...],
  "dietaryNotes": "..."
}`,
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
        const response = await prompt(input);
        const text = response.text;
        
        // Clean markdown if present
        const jsonString = text.replace(/```json\n?|```/g, '').trim();
        const parsed = JSON.parse(jsonString);
        
        return GenerateRecipeFromPantryOutputSchema.parse(parsed);
      } catch (error: any) {
        lastError = error;
        const errorMsg = error.message?.toLowerCase() || '';
        const isRetryable = errorMsg.includes('503') || 
                          errorMsg.includes('high demand') || 
                          errorMsg.includes('unavailable') || 
                          errorMsg.includes('rate limit') ||
                          errorMsg.includes('429');
        
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
