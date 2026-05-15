'use server';
/**
 * @fileOverview Analyzes recipe nutrition using Groq Llama 3.
 */

import { z } from 'zod';
import { groqClient, isGroqConfigured } from '../groq-client';

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
  console.log("Chef: Analyzing nutritional manifestation for:", input.recipeName);

  if (!isGroqConfigured()) {
    throw new Error("Groq API key is not configured.");
  }

  let attempt = 0;

  while (attempt <= RETRY_DELAY.length) {
    try {
      const completion = await groqClient.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a nutrition expert. Analyze the provided recipe and provide nutritional data. Output ONLY raw JSON.'
          },
          {
            role: 'user',
            content: `Recipe: ${input.recipeName}. Ingredients: ${input.ingredients.join(', ')}. 
            
            Return JSON matching this schema:
            {
              "calories": number,
              "proteinGrams": number,
              "fatGrams": number,
              "carbohydratesGrams": number,
              "nutritionalDensityDescription": "string",
              "notes": "string"
            }`
          }
        ],
        temperature: 0.3,
        max_tokens: 512,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error('No content returned from Groq');
      
      const parsed = JSON.parse(content);
      return AnalyzeRecipeNutritionOutputSchema.parse(parsed);
    } catch (error: any) {
      console.error("Nutrition Analysis Error (Attempt " + (attempt + 1) + "):", error);
      const isQuotaError = error.status === 429;
      if (isQuotaError && attempt < RETRY_DELAY.length) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY[attempt]));
        attempt++;
        continue;
      }
      throw new Error("Nutrition analysis temporarily unavailable.");
    }
  }
  throw new Error("Service busy.");
}
