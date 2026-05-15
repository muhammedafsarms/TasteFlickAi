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
  prompt: `You are the "TasteFlick Alchemist", a world-renowned gourmet chef.
Answer any culinary question the user has.

User's Question: {{{message}}}

{{#if history}}
Previous context:
{{#each history}}
- {{role}}: {{content}}
{{/each}}
{{/if}}

Return ONLY a raw JSON object with the following structure. Do not include markdown formatting:
{
  "answer": "...",
  "suggestions": ["...", "..."]
}`,
});

const chefChatFlow = ai.defineFlow(
  {
    name: 'chefChatFlow',
    inputSchema: ChefChatInputSchema,
    outputSchema: ChefChatOutputSchema,
  },
  async (input) => {
    let retries = 3;
    let lastError: any;

    while (retries > 0) {
      try {
        const response = await prompt(input);
        const text = response.text;
        const jsonString = text.replace(/```json\n?|```/g, '').trim();
        const parsed = JSON.parse(jsonString);
        return ChefChatOutputSchema.parse(parsed);
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
    throw lastError || new Error('Failed to chat with chef after retries');
  }
);
