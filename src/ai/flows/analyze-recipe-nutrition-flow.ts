'use server';
/**
 * @fileOverview An AI agent that analyzes a given recipe to estimate its nutritional density and caloric breakdown.
 *
 * - analyzeRecipeNutrition - A function that handles the recipe nutrition analysis process.
 * - AnalyzeRecipeNutritionInput - The input type for the analyzeRecipeNutrition function.
 * - AnalyzeRecipeNutritionOutput - The return type for the analyzeRecipeNutrition function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeRecipeNutritionInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.array(z.string()).describe('A list of ingredients with quantities (e.g., "2 cups flour", "1/2 tsp salt").'),
  instructions: z.array(z.string()).describe('A list of step-by-step instructions for preparing the recipe.'),
});
export type AnalyzeRecipeNutritionInput = z.infer<typeof AnalyzeRecipeNutritionInputSchema>;

const AnalyzeRecipeNutritionOutputSchema = z.object({
  calories: z.number().describe('Estimated total calories per serving.'),
  proteinGrams: z.number().describe('Estimated protein in grams per serving.'),
  fatGrams: z.number().describe('Estimated fat in grams per serving.'),
  carbohydratesGrams: z.number().describe('Estimated carbohydrates in grams per serving.'),
  nutritionalDensityDescription: z.string().describe('A descriptive summary of the recipe\'s nutritional density (e.g., "Rich in fiber and vitamins", "High in healthy fats").'),
  notes: z.string().optional().describe('Any additional nutritional notes or dietary considerations.'),
});
export type AnalyzeRecipeNutritionOutput = z.infer<typeof AnalyzeRecipeNutritionOutputSchema>;

export async function analyzeRecipeNutrition(input: AnalyzeRecipeNutritionInput): Promise<AnalyzeRecipeNutritionOutput> {
  return analyzeRecipeNutritionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeRecipeNutritionPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: { schema: AnalyzeRecipeNutritionInputSchema },
  output: { schema: AnalyzeRecipeNutritionOutputSchema },
  prompt: `You are an expert nutritionist and food scientist. Your task is to analyze the provided recipe and estimate its nutritional density and caloric breakdown per serving.

Provide the estimated calories, protein, fat, and carbohydrates in grams. Also, give a descriptive summary of its nutritional density and any additional notes.

Recipe Name: {{{recipeName}}}
Ingredients:
{{#each ingredients}}- {{{this}}}
{{/each}}
Instructions:
{{#each instructions}}{{(@index)}}. {{{this}}}
{{/each}}

Focus on accuracy and provide a detailed yet concise analysis.`,
});

const analyzeRecipeNutritionFlow = ai.defineFlow(
  {
    name: 'analyzeRecipeNutritionFlow',
    inputSchema: AnalyzeRecipeNutritionInputSchema,
    outputSchema: AnalyzeRecipeNutritionOutputSchema,
  },
  async (input) => {
    let retries = 3;
    let lastError: any;

    while (retries > 0) {
      try {
        const { output } = await prompt(input);
        if (!output) throw new Error('No output from prompt');
        return output;
      } catch (error: any) {
        lastError = error;
        const errorMsg = error.message?.toLowerCase() || '';
        const isRetryable = errorMsg.includes('503') || 
                          errorMsg.includes('high demand') || 
                          errorMsg.includes('unavailable') || 
                          errorMsg.includes('rate limit') ||
                          errorMsg.includes('429') ||
                          errorMsg.includes('404');
        
        if (isRetryable && retries > 1) {
          retries--;
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        throw error;
      }
    }
    throw lastError || new Error('Failed to analyze nutrition after retries');
  }
);
