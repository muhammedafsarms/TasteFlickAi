'use server';
/**
 * @fileOverview A Genkit flow for answering culinary doubts and providing expert cooking advice.
 *
 * - chefChat - A function that handles the chat process.
 * - ChefChatInput - The input type for the chefChat function.
 * - ChefChatOutput - The return type for the chefChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChefChatInputSchema = z.object({
  message: z.string().describe('The user\'s question or doubt about cooking.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional().describe('The conversation history for context.'),
});
export type ChefChatInput = z.infer<typeof ChefChatInputSchema>;

const ChefChatOutputSchema = z.object({
  answer: z.string().describe('The expert chef\'s detailed answer.'),
  suggestions: z.array(z.string()).optional().describe('Follow-up questions or suggestions.'),
});
export type ChefChatOutput = z.infer<typeof ChefChatOutputSchema>;

export async function chefChat(input: ChefChatInput): Promise<ChefChatOutput> {
  return chefChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chefChatPrompt',
  input: {schema: ChefChatInputSchema},
  output: {schema: ChefChatOutputSchema},
  prompt: `You are the "TasteFlick Alchemist", a world-renowned gourmet chef and culinary scientist. 
Your goal is to answer any doubts the user has about cooking, ingredients, techniques, or recipes.

User's Question: {{{message}}}

{{#if history}}
Previous context:
{{#each history}}
- {{role}}: {{content}}
{{/each}}
{{/if}}

Provide a detailed, encouraging, and highly professional answer. If the question is not about food or cooking, politely steer the conversation back to the culinary arts. Offer 2-3 brief follow-up suggestions for what they might ask next.`,
});

const chefChatFlow = ai.defineFlow(
  {
    name: 'chefChatFlow',
    inputSchema: ChefChatInputSchema,
    outputSchema: ChefChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
