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

const RETRY_DELAY = [2000, 5000];

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
    console.log("Alchemist: Manifesting recipe for ingredients:", input.ingredients.join(", "));
    
    if (!isGroqConfigured()) {
      throw new Error("Groq API key is not configured. Please set GROQ_API_KEY in your environment.");
    }

    let attempt = 0;
    
    while (attempt <= RETRY_DELAY.length) {
      try {
        console.log(`Alchemist: Requesting completion (Attempt ${attempt + 1})...`);
        const completion = await groqClient.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a world-class Michelin-star chef. Create an incredibly detailed, unique gourmet recipe based on the provided ingredients. Focus on technique and flavour profiles. For the recipe name, create a descriptive, evocative, and technically accurate gourmet name. Output ONLY valid JSON.'
            },
            {
              role: 'user',
              content: `Ingredients: ${input.ingredients.join(', ')}. 
              ${input.dietaryPreferences?.length ? `Preferences: ${input.dietaryPreferences.join(', ')}` : ''}
              
              Return JSON exactly in this format:
              {
                "recipeName": "A descriptive, evocative, and technically accurate gourmet name",
                "description": "Eloquent description",
                "prepTime": "XX mins",
                "cookTime": "XX mins",
                "difficulty": "Intermediate",
                "instructions": ["Step 1", "Step 2..."],
                "ingredientsList": ["Quantity + Ingredient name", "..."],
                "platingSuggestions": "Advice",
                "dietaryNotes": "Context"
              }`
            }
          ],
          temperature: 0.7,
          max_tokens: 2048,
          response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content;
        console.log("Alchemist: Raw response received:", content?.substring(0, 100) + "...");

        if (!content) {
          throw new Error('Alchemist received an empty vision.');
        }
        
        try {
          const parsed = JSON.parse(content);
          return GenerateRecipeFromPantryOutputSchema.parse(parsed);
        } catch (parseError) {
          console.error("Alchemist: JSON parsing/validation failed:", parseError);
          throw new Error("The Alchemist's recipe was illegible.");
        }
        
      } catch (error: any) {
        console.error(`Alchemist Error (Attempt ${attempt + 1}):`, error.message || error);
        
        const isQuotaError = error.status === 429;
        if (isQuotaError && attempt < RETRY_DELAY.length) {
          console.warn(`Alchemist: Rate limited. Retrying in ${RETRY_DELAY[attempt]}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY[attempt]));
          attempt++;
          continue;
        }
        throw new Error(isQuotaError ? "The kitchen is currently busy. Please try again soon." : `Failed to manifest recipe: ${error.message}`);
      }
    }
    throw new Error("Service busy.");
  }
);
