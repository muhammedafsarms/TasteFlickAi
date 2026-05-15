
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
import { googleAI } from '@genkit-ai/google-genai';

const AnalyzeRecipeNutritionInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.array(z.string()).describe('A list of ingredients with quantities.'),
  instructions: z.array(z.string()).describe('A list of step-by-step instructions.'),
});
export type AnalyzeRecipeNutritionInput = z.infer<typeof AnalyzeRecipeNutritionInputSchema>;

const AnalyzeRecipeNutritionOutputSchema = z.object({
  calories: z.number().describe('Estimated total calories per serving.'),
  proteinGrams: z.number().describe('Estimated protein in grams per serving.'),
  fatGrams: z.number().describe('Estimated fat in grams per serving.'),
  carbohydratesGrams: z.number().describe('Estimated carbohydrates in grams per serving.'),
  nutritionalDensityDescription: z.string().describe('A descriptive summary of the recipe\'s nutritional density.'),
  notes: z.string().optional().describe('Any additional nutritional notes.'),
});
export type AnalyzeRecipeNutritionOutput = z.infer<typeof AnalyzeRecipeNutritionOutputSchema>;

export async function analyzeRecipeNutrition(input: AnalyzeRecipeNutritionInput): Promise<AnalyzeRecipeNutritionOutput> {
  return analyzeRecipeNutritionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeRecipeNutritionPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: { schema: AnalyzeRecipeNutritionInputSchema },
  prompt: `You are an expert nutritionist. Analyze the provided recipe and estimate its nutritional breakdown per serving.

Recipe Name: {{{recipeName}}}
Ingredients:
{{#each ingredients}}- {{{this}}}
{{/each}}
Instructions:
{{#each instructions}}{{(@index)}}. {{{this}}}
{{/each}}

Return ONLY a raw JSON object with the following structure. Do not include markdown formatting:
{
  "calories": number,
  "proteinGrams": number,
  "fatGrams": number,
  "carbohydratesGrams": number,
  "nutritionalDensityDescription": "...",
  "notes": "..."
}`,
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
        const response = await prompt(input);
        const text = response.text;
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found in response');
        
        const jsonString = jsonMatch[0];
        const parsed = JSON.parse(jsonString);
        return AnalyzeRecipeNutritionOutputSchema.parse(parsed);
      } catch (error: any) {
        lastError = error;
        const errorMsg = error.message?.toLowerCase() || '';
        const isRetryable = errorMsg.includes('503') || 
                          errorMsg.includes('high demand') || 
                          errorMsg.includes('unavailable') || 
                          errorMsg.includes('rate limit') ||
                          errorMsg.includes('429');
        
        if (isRetryable && retries > 1) {
          retries--;
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        throw error;
      }
    }
    throw lastError || new Error('Failed to analyze nutrition after retries. Please check your ingredients and try again.');
  }
);
