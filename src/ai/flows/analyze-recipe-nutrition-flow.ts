'use server';
/**
 * @fileOverview Analyzes recipe nutrition with robust error handling.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeRecipeNutritionInputSchema = z.object({
  recipeName: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
});
export type AnalyzeRecipeNutritionInput = z.infer<typeof AnalyzeRecipeNutritionInputSchema>;

const AnalyzeRecipeNutritionOutputSchema = z.object({
  calories: z.number(),
  proteinGrams: z.number(),
  fatGrams: z.number(),
  carbohydratesGrams: z.number(),
  nutritionalDensityDescription: z.string(),
  notes: z.string().optional(),
});
export type AnalyzeRecipeNutritionOutput = z.infer<typeof AnalyzeRecipeNutritionOutputSchema>;

const RETRY_DELAY = [2000, 5000, 10000];

export async function analyzeRecipeNutrition(input: AnalyzeRecipeNutritionInput): Promise<AnalyzeRecipeNutritionOutput> {
  let attempt = 0;

  while (attempt <= RETRY_DELAY.length) {
    try {
      const { text } = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        config: {
          temperature: 0.3,
          maxOutputTokens: 256,
        },
        prompt: `Analyze nutrition for: ${input.recipeName}.
        Ingredients: ${input.ingredients.join(', ')}
        
        Output raw JSON:
        {
          "calories": number,
          "proteinGrams": number,
          "fatGrams": number,
          "carbohydratesGrams": number,
          "nutritionalDensityDescription": "summary",
          "notes": "extra"
        }`
      });

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid format');
      return AnalyzeRecipeNutritionOutputSchema.parse(JSON.parse(jsonMatch[0]));
    } catch (error: any) {
      const isQuotaError = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
      if (isQuotaError && attempt < RETRY_DELAY.length) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY[attempt]));
        attempt++;
        continue;
      }
      throw new Error("Nutrition analysis unavailable right now.");
    }
  }
  throw new Error("Service busy.");
}
