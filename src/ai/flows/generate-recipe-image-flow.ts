'use server';
/**
 * @fileOverview A simplified image fallback system using high-quality placeholders.
 */

import { z } from 'zod';

const GenerateRecipeImageInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  description: z.string().describe('A brief description of the dish.'),
});
export type GenerateRecipeImageInput = z.infer<typeof GenerateRecipeImageInputSchema>;

const GenerateRecipeImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI or URL of the image.'),
});
export type GenerateRecipeImageOutput = z.infer<typeof GenerateRecipeImageOutputSchema>;

export async function generateRecipeImage(input: GenerateRecipeImageInput): Promise<GenerateRecipeImageOutput> {
  // Image generation removed as per request. Using high-quality seed-based placeholders.
  return {
    imageUrl: `https://picsum.photos/seed/${encodeURIComponent(input.recipeName)}/800/600`,
  };
}
