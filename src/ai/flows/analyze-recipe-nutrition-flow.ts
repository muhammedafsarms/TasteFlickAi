
'use server';
/**
 * @fileOverview Analyzes recipe nutrition using Groq Llama 3.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {groqClient} from '@/ai/groq-client';

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
  return analyzeRecipeNutritionFlow(input);
}

const analyzeRecipeNutritionFlow = ai.defineFlow(
  {
    name: 'analyzeRecipeNutritionFlow',
    inputSchema: AnalyzeRecipeNutritionInputSchema,
    outputSchema: AnalyzeRecipeNutritionOutputSchema,
  },
  async (input) => {
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
              
              Return JSON:
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
        
        return AnalyzeRecipeNutritionOutputSchema.parse(JSON.parse(content));
      } catch (error: any) {
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
);
