
'use server';
/**
 * @fileOverview Generates gourmet recipes from pantry ingredients using Groq Llama 3.
 *
 * - generateRecipeFromPantry - A function that handles recipe generation.
 * - GenerateRecipeFromPantryInput - The input type.
 * - GenerateRecipeFromPantryOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {groqClient} from '@/ai/groq-client';

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
  return generateRecipeFromPantryFlow(input);
}

const generateRecipeFromPantryFlow = ai.defineFlow(
  {
    name: 'generateRecipeFromPantryFlow',
    inputSchema: GenerateRecipeFromPantryInputSchema,
    outputSchema: GenerateRecipeFromPantryOutputSchema,
  },
  async (input) => {
    let attempt = 0;
    
    while (attempt <= RETRY_DELAY.length) {
      try {
        const completion = await groqClient.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a world-class gourmet chef. Create a unique recipe based on the provided ingredients. Output ONLY raw JSON.'
            },
            {
              role: 'user',
              content: `Ingredients: ${input.ingredients.join(', ')}. 
              ${input.dietaryPreferences?.length ? `Preferences: ${input.dietaryPreferences.join(', ')}` : ''}
              
              Return JSON:
              {
                "recipeName": "string",
                "description": "string",
                "instructions": ["string"],
                "ingredientsList": ["string"],
                "dietaryNotes": "string"
              }`
            }
          ],
          temperature: 0.7,
          max_tokens: 1024,
          response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error('No content returned from Groq');
        
        return GenerateRecipeFromPantryOutputSchema.parse(JSON.parse(content));
      } catch (error: any) {
        const isQuotaError = error.status === 429;
        if (isQuotaError && attempt < RETRY_DELAY.length) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY[attempt]));
          attempt++;
          continue;
        }
        throw new Error(isQuotaError ? "The kitchen is currently busy. Please try again soon." : "Failed to manifest recipe. Please check your ingredients.");
      }
    }
    throw new Error("Service busy.");
  }
);
