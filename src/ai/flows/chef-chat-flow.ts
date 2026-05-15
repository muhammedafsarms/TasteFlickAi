
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
import {googleAI} from '@genkit-ai/google-genai';

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
        const historyText = input.history?.map(h => `${h.role}: ${h.content}`).join('\n') || '';
        
        const { text } = await ai.generate({
          model: 'googleai/gemini-2.0-flash',
          prompt: `You are the "TasteFlick Alchemist", a world-renowned gourmet chef. Answer any culinary question.
          
          User's Question: ${input.message}
          ${historyText ? `\nPrevious context:\n${historyText}` : ''}

          Return ONLY a raw JSON object (no markdown) with this structure:
          {
            "answer": "string",
            "suggestions": ["string"]
          }`,
        });

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found in response');
        
        const jsonString = jsonMatch[0];
        const parsed = JSON.parse(jsonString);
        return ChefChatOutputSchema.parse(parsed);
      } catch (error: any) {
        lastError = error;
        const errorMsg = error.message?.toLowerCase() || '';
        const isRetryable = errorMsg.includes('503') || errorMsg.includes('429');
        
        if (isRetryable && retries > 1) {
          retries--;
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        throw error;
      }
    }
    throw lastError || new Error('The Alchemist is unavailable. Please try again later.');
  }
);
