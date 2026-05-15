'use server';
/**
 * @fileOverview Generates highly detailed gourmet recipes from pantry ingredients using Genkit Prompts.
 * Includes a fallback mechanism to Groq if Gemini quota is reached.
 */

import { ai } from '../genkit';
import { z } from 'zod';
import { groqClient, isGroqConfigured } from '../groq-client';

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
      // Primary Attempt: Genkit with Gemini
      const { output } = await recipePrompt(input);
      if (!output) throw new Error('Empty output from Gemini.');
      return output;
    } catch (error: any) {
      console.error("Alchemy Error during Gemini manifestation:", error.message);
      
      const isQuotaError = error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED');
      
      if (isQuotaError && isGroqConfigured()) {
        console.log("Alchemist: Gemini exhausted. Invoking fallback spirits (Groq)...");
        try {
          const completion = await groqClient.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { 
                role: 'system', 
                content: 'You are a Michelin-star chef. Create a gourmet recipe. Output ONLY valid raw JSON matching the requested structure.' 
              },
              { 
                role: 'user', 
                content: `Ingredients: ${input.ingredients.join(', ')}. Dietary: ${input.dietaryPreferences?.join(', ') || 'None'}.
                Return JSON structure: { recipeName: string (1-3 words), description: string, prepTime: string, cookTime: string, difficulty: "Beginner"|"Intermediate"|"Advanced"|"Master", instructions: string[], ingredientsList: string[], platingSuggestions: string, dietaryNotes: string }`
              }
            ],
            response_format: { type: 'json_object' }
          });

          const content = completion.choices[0]?.message?.content;
          if (!content) throw new Error('Groq returned empty plate.');
          
          return GenerateRecipeFromPantryOutputSchema.parse(JSON.parse(content));
        } catch (groqError: any) {
          console.error("Alchemy Error during Groq fallback:", groqError.message);
          throw new Error(`All culinary spirits are currently busy: ${groqError.message}`);
        }
      }
      
      throw new Error(`The culinary spirits were interrupted: ${error.message}`);
    }
  }
);
