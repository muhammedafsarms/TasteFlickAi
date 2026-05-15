'use server';
/**
 * @fileOverview Generates gourmet recipes from pantry ingredients with robust retry logic.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeFromPantryInputSchema = z.object({
  ingredients: z.array(z.string()),
  dietaryPreferences: z.array(z.string()).optional(),
});
export type GenerateRecipeFromPantryInput = z.infer<typeof GenerateRecipeFromPantryInputSchema>;

const GenerateRecipeFromPantryOutputSchema = z.object({
  recipeName: z.string(),
  description: z.string(),
  instructions: z.array(z.string()),
  ingredientsList: z.array(z.string()),
  dietaryNotes: z.string(),
});
export type GenerateRecipeFromPantryOutput = z.infer<typeof GenerateRecipeFromPantryOutputSchema>;

const RETRY_DELAY = [2000, 5000, 10000];

export async function generateRecipeFromPantry(input: GenerateRecipeFromPantryInput): Promise<GenerateRecipeFromPantryOutput> {
  let attempt = 0;
  
  while (attempt <= RETRY_DELAY.length) {
    try {
      const { text } = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        config: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
        prompt: `Chef, create a unique gourmet recipe.
        Ingredients: ${input.ingredients.join(', ')}
        ${input.dietaryPreferences?.length ? `Preferences: ${input.dietaryPreferences.join(', ')}` : ''}
        
        Output raw JSON:
        {
          "recipeName": "Title",
          "description": "Short intro",
          "instructions": ["Step 1", "Step 2"],
          "ingredientsList": ["Qty Item"],
          "dietaryNotes": "Info"
        }`
      });

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid response format');
      return GenerateRecipeFromPantryOutputSchema.parse(JSON.parse(jsonMatch[0]));
    } catch (error: any) {
      const isQuotaError = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
      if (isQuotaError && attempt < RETRY_DELAY.length) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY[attempt]));
        attempt++;
        continue;
      }
      throw new Error(isQuotaError ? "The Alchemist is busy. Please try again in a moment." : "Alchemy failed. Check your ingredients.");
    }
  }
  throw new Error("The kitchen is currently over capacity. Please wait a minute.");
}
