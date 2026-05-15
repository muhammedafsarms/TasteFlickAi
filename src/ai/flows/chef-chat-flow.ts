
'use server';
/**
 * @fileOverview Culinary advice and recipe manifestation chat flow using Groq.
 */

import { groqClient, isGroqConfigured } from '../groq-client';
import { z } from 'zod';

const ChefChatInputSchema = z.object({
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional(),
});
export type ChefChatInput = z.infer<typeof ChefChatInputSchema>;

const ChefChatOutputSchema = z.object({
  answer: z.string(),
  recipe: z.object({
    recipeName: z.string(),
    description: z.string(),
    prepTime: z.string(),
    cookTime: z.string(),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Master']),
    instructions: z.array(z.string()),
    ingredientsList: z.array(z.string()),
    platingSuggestions: z.string(),
    dietaryNotes: z.string(),
  }).optional(),
});
export type ChefChatOutput = z.infer<typeof ChefChatOutputSchema>;

export async function chefChat(input: ChefChatInput): Promise<ChefChatOutput> {
  console.log("Chef: Consulting Groq scrolls for message:", input.message);

  if (!isGroqConfigured()) {
    throw new Error("Groq API key is not configured.");
  }

  try {
    const messages = [
      { 
        role: "system" as const, 
        content: `You are a Michelin-star chef. Answer culinary questions. 
        If a recipe is requested, provide it in the "recipe" field of the JSON. 
        Recipe names must be 1-3 words long.
        Output ONLY raw JSON matching this structure:
        {
          "answer": "string",
          "recipe": {
             "recipeName": "string",
             "description": "string",
             "prepTime": "string",
             "cookTime": "string",
             "difficulty": "Beginner" | "Intermediate" | "Advanced" | "Master",
             "instructions": ["string"],
             "ingredientsList": ["string"],
             "platingSuggestions": "string",
             "dietaryNotes": "string"
          } (optional)
        }`
      },
      ...(input.history || []).map(h => ({ role: h.role, content: h.content })),
      { role: "user" as const, content: input.message }
    ];

    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Chef Fallback: Empty response.");

    return ChefChatOutputSchema.parse(JSON.parse(content));
  } catch (error: any) {
    console.error("Chef Chat Error:", error);
    return {
      answer: `The kitchen is briefly overwhelmed. (Error: ${error.message})`,
    };
  }
}
