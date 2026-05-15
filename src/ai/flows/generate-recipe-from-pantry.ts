
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
import {googleAI} from '@genkit-ai/google-genai';

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
        const { text } = await ai.generate({
          model: 'googleai/gemini-2.0-flash',
          prompt: `You are a world-class gourmet chef. Craft a unique, gourmet-style recipe using the following ingredients.
          
          Ingredients available: ${input.ingredients.join(', ')}
          ${input.dietaryPreferences ? `Dietary preferences: ${input.dietaryPreferences.join(', ')}` : ''}

          Return ONLY a raw JSON object (no markdown, no extra text) with the following structure:
          {
            "recipeName": "string",
            "description": "string",
            "instructions": ["string"],
            "ingredientsList": ["string"],
            "dietaryNotes": "string"
          }`,
        });

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found in response');
        
        const jsonString = jsonMatch[0];
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
    throw lastError || new Error('The kitchen is busy, please try again soon.');
  }
);
