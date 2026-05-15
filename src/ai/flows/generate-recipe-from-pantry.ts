'use server';
/**
 * @fileOverview Generates highly detailed gourmet recipes from pantry ingredients using Genkit Prompts.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

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

const recipePrompt = ai.definePrompt({
  name: 'generateRecipeFromPantryPrompt',
  input: { schema: GenerateRecipeFromPantryInputSchema },
  output: { schema: GenerateRecipeFromPantryOutputSchema },
  prompt: `You are a world-class Michelin-star chef and culinary alchemist. 
  
Create an incredibly detailed, unique gourmet recipe based on the provided ingredients. 
Focus on technique and complex flavour profiles.

{{#if dietaryPreferences}}
STRICT DIETARY CONSTRAINTS: {{{dietaryPreferences}}}
{{/if}}

Ingredients available:
{{#each ingredients}}
- {{{this}}}
{{/each}}

For the recipe name, create a descriptive, evocative, and technically accurate gourmet name that is EXACTLY one, two, or three words long.`,
});

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
    try {
      const { output } = await recipePrompt(input);
      if (!output) throw new Error('The Alchemist failed to manifest a vision.');
      return output;
    } catch (error: any) {
      console.error("Alchemy Error:", error);
      throw new Error(`Failed to manifest recipe: ${error.message}`);
    }
  }
);
