'use server';
/**
 * @fileOverview Generates highly detailed gourmet recipes from pantry ingredients using Groq Llama 3.
 */

import { ai } from '../genkit';
import { z } from 'genkit';
import { groqClient, isGroqConfigured } from '../groq-client';

const GenerateRecipeFromPantryInputSchema = z.object({
  ingredients: z.array(z.string()),
  dietaryPreferences: z.array(z.string()).optional(),
});
export type GenerateRecipeFromPantryInput = z.infer<typeof GenerateRecipeFromPantryInputSchema>;

const GenerateRecipeFromPantryOutputSchema = z.object({
  recipeName: z.string(),
  description: z.string(),
  prepTime: z.string().describe('e.g., 15 mins'),
  cookTime: z.string().describe('e.g., 30 mins'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Master']),
  instructions: z.array(z.string()),
  ingredientsList: z.array(z.string()),
  platingSuggestions: z.string(),
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
    if (!isGroqConfigured()) {
      throw new Error("Groq API key is not configured. Please set GROQ_API_KEY in your environment.");
    }

    let attempt = 0;
    
    while (attempt <= RETRY_DELAY.length) {
      try {
        const completion = await groqClient.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a world-class Michelin-star chef. Create an incredibly detailed, unique gourmet recipe based on the provided ingredients. Focus on technique and flavour profiles. Output ONLY raw JSON.'
            },
            {
              role: 'user',
              content: `Ingredients: ${input.ingredients.join(', ')}. 
              ${input.dietaryPreferences?.length ? `Preferences: ${input.dietaryPreferences.join(', ')}` : ''}
              
              Return JSON exactly in this format:
              {
                "recipeName": "Creative Name",
                "description": "Eloquent description of the dish and its soul",
                "prepTime": "XX mins",
                "cookTime": "XX mins",
                "difficulty": "Intermediate",
                "instructions": ["Detailed step 1 with culinary techniques", "Step 2..."],
                "ingredientsList": ["Quantity + Ingredient name", "..."],
                "platingSuggestions": "Detailed advice on how to plate this like a pro",
                "dietaryNotes": "Nutritional or dietary context"
              }`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
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
        throw new Error(isQuotaError ? "The kitchen is currently busy. Please try again soon." : "Failed to manifest recipe. Please check your ingredients or API configuration.");
      }
    }
    throw new Error("Service busy.");
  }
);
