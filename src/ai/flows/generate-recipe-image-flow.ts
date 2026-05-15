'use server';
/**
 * @fileOverview A Genkit flow for generating high-end gourmet food photography for recipes using Imagen 4.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateRecipeImageInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  description: z.string().describe('A brief description of the dish.'),
});
export type GenerateRecipeImageInput = z.infer<typeof GenerateRecipeImageInputSchema>;

const GenerateRecipeImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateRecipeImageOutput = z.infer<typeof GenerateRecipeImageOutputSchema>;

export async function generateRecipeImage(input: GenerateRecipeImageInput): Promise<GenerateRecipeImageOutput> {
  return generateRecipeImageFlow(input);
}

const generateRecipeImageFlow = ai.defineFlow(
  {
    name: 'generateRecipeImageFlow',
    inputSchema: GenerateRecipeImageInputSchema,
    outputSchema: GenerateRecipeImageOutputSchema,
  },
  async (input) => {
    try {
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `A professional, high-end Michelin-star gourmet food photograph of ${input.recipeName}. ${input.description}. 
        The shot should be an elegant top-down or 45-degree angle composition, beautifully plated on luxury stoneware in a fine dining restaurant, 
        with soft natural side-lighting, macro detail, and artistic garnishes. 8k resolution, cinematic lighting, shallow depth of field.`,
      });

      if (!media) {
        throw new Error('Failed to generate image');
      }

      return {
        imageUrl: media.url,
      };
    } catch (error) {
      console.error("Image generation failed:", error);
      // Fallback to a high-quality placeholder if AI fails
      return {
        imageUrl: `https://picsum.photos/seed/${input.recipeName.length}/800/600`,
      };
    }
  }
);
