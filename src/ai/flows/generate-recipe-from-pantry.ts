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
  output: {schema: GenerateRecipeFromPantryOutputSchema},
  prompt: `You are a world-class gourmet chef renowned for your ability to create exquisite dishes from limited ingredients.

Your task is to craft a unique, gourmet-style recipe using only the ingredients provided and adhering to any specified dietary preferences.

Ingredients available: {{#each ingredients}}- {{{this}}}{{/each}}

{{#if dietaryPreferences}}Dietary preferences/restrictions: {{#each dietaryPreferences}}- {{{this}}}{{/each}}{{else}}No specific dietary preferences provided.{{/if}}

Invent a creative recipe name and provide a description, a step-by-step instruction list, a detailed ingredient list with quantities, and any relevant dietary notes. Ensure the recipe uses as many of the provided ingredients as possible in a harmonious and delicious way. Focus on gourmet presentation and flavor combinations.`,
});

const generateRecipeFromPantryFlow = ai.defineFlow(
  {
    name: 'generateRecipeFromPantryFlow',
    inputSchema: GenerateRecipeFromPantryInputSchema,
    outputSchema: GenerateRecipeFromPantryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
