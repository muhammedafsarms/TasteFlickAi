
'use server';
/**
 * @fileOverview Generates gourmet recipes from pantry ingredients using Groq Llama 3.
 */

import { groqClient, isGroqConfigured } from '../groq-client';
import { z } from 'zod';

const GenerateRecipeFromPantryInputSchema = z.object({
  ingredients: z.array(z.string()),
  dietaryPreferences: z.array(z.string()).optional(),
});
export type GenerateRecipeFromPantryInput = z.infer<typeof GenerateRecipeFromPantryInputSchema>;

const GenerateRecipeFromPantryOutputSchema = z.object({
  recipeName: z.string(),
  description: z.string(),
  prepTime: z.string(),
  cookTime: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Master']),
  instructions: z.array(z.string()),
  ingredientsList: z.array(z.string()),
  platingSuggestions: z.string(),
  dietaryNotes: z.string(),
});
export type GenerateRecipeFromPantryOutput = z.infer<typeof GenerateRecipeFromPantryOutputSchema>;

export async function generateRecipeFromPantry(input: GenerateRecipeFromPantryInput): Promise<GenerateRecipeFromPantryOutput> {
  console.log("Alchemist: Initiating Groq manifestation for:", input.ingredients);

  if (!isGroqConfigured()) {
    throw new Error("Groq API key is not configured.");
  }

  try {
    const prompt = `You are a Michelin-star chef. Create a gourmet recipe based on these ingredients: ${input.ingredients.join(', ')}.
    ${input.dietaryPreferences?.length ? `STRICT DIETARY CONSTRAINTS: ${input.dietaryPreferences.join(', ')}` : ''}

    CRITICAL INSTRUCTIONS:
    1. The recipeName must be exactly one, two, or three words long.
    2. Output ONLY raw JSON matching this structure:
    {
      "recipeName": "string (1-3 words)",
      "description": "string",
      "prepTime": "string",
      "cookTime": "string",
      "difficulty": "Beginner" | "Intermediate" | "Advanced" | "Master",
      "instructions": ["string"],
      "ingredientsList": ["string"],
      "platingSuggestions": "string",
      "dietaryNotes": "string"
    }`;

    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("The Alchemist returned an empty plate.");

    console.log("Alchemist: Manifestation complete.");
    return GenerateRecipeFromPantryOutputSchema.parse(JSON.parse(content));
  } catch (error: any) {
    console.error("Alchemist Error:", error);
    throw new Error(`The culinary spirits were interrupted: ${error.message}`);
  }
}
