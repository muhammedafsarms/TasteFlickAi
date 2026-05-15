
'use server';
/**
 * @fileOverview Generates highly detailed gourmet recipes from pantry ingredients using Genkit Prompts.
 */

import { ai } from '../genkit';
import { z } from 'zod';

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
STRICT DIETARY CONSTRAINTS: {{#each dietaryPreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

Ingredients available:
{{#each ingredients}}
- {{{this}}}
{{/each}}

CRITICAL INSTRUCTIONS:
1. For the recipe name, create a descriptive, evocative, and technically accurate gourmet name that is EXACTLY one, two, or three words long.
2. The "difficulty" field MUST be exactly one of: "Beginner", "Intermediate", "Advanced", or "Master" (case-sensitive).
3. Ensure the output is valid JSON matching the schema provided.`,
});

export async function generateRecipeFromPantry(input: GenerateRecipeFromPantryInput): Promise<GenerateRecipeFromPantryOutput> {
  console.log("Alchemist: Starting pantry manifestation for ingredients:", input.ingredients);
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
      if (!output) {
        console.error("Alchemist: Empty output from prompt.");
        throw new Error('The Alchemist failed to manifest a vision.');
      }
      console.log("Alchemist: Successfully manifested recipe:", output.recipeName);
      return output;
    } catch (error: any) {
      console.error("Alchemy Error during manifestation:", error);
      throw new Error(`The culinary spirits were interrupted: ${error.message}`);
    }
  }
);
