'use server';
/**
 * @fileOverview Culinary advice and recipe manifestation chat flow using Genkit Prompts.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

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
  suggestions: z.array(z.string()).optional(),
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

const chefPrompt = ai.definePrompt({
  name: 'chefChatPrompt',
  input: { schema: ChefChatInputSchema },
  output: { schema: ChefChatOutputSchema },
  prompt: `You are a world-class Michelin-star chef. 
              
- If the user asks for a recipe, provide a highly detailed gourmet manifestation. 
- If the user asks for advice, provide eloquent culinary wisdom.
- For any "recipeName", create a descriptive, evocative, and technically accurate gourmet name that is EXACTLY one, two, or three words long.

User Message: {{{message}}}

Recent Conversation:
{{#each history}}
{{{role}}}: {{{content}}}
{{/each}}`,
});

export async function chefChat(input: ChefChatInput): Promise<ChefChatOutput> {
  return chefChatFlow(input);
}

const chefChatFlow = ai.defineFlow(
  {
    name: 'chefChatFlow',
    inputSchema: ChefChatInputSchema,
    outputSchema: ChefChatOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await chefPrompt(input);
      if (!output) throw new Error('Chef received an empty plate.');
      return output;
    } catch (error: any) {
      console.error("Chef Chat Error:", error);
      return {
        answer: `The kitchen is briefly overwhelmed. (Error: ${error.message || "Unknown mishap"})`,
        suggestions: ["Try again in a moment"]
      };
    }
  }
);
