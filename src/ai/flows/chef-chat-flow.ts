
'use server';
/**
 * @fileOverview Culinary advice chat flow using Groq Llama 3.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {groqClient} from '@/ai/groq-client';

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
});
export type ChefChatOutput = z.infer<typeof ChefChatOutputSchema>;

const RETRY_DELAY = [2000, 5000];

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
    let attempt = 0;

    while (attempt <= RETRY_DELAY.length) {
      try {
        const historyMessages = input.history?.slice(-6).map(h => ({
          role: h.role,
          content: h.content
        })) || [];

        const completion = await groqClient.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a world-class chef. Provide concise, helpful culinary advice. Output ONLY raw JSON.'
            },
            ...historyMessages as any,
            {
              role: 'user',
              content: input.message
            }
          ],
          temperature: 0.8,
          max_tokens: 512,
          response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error('No content returned');
        
        const data = JSON.parse(content);
        return {
          answer: data.answer || "I'm sorry, I couldn't process that culinary request.",
          suggestions: data.suggestions || []
        };
      } catch (error: any) {
        const isQuotaError = error.status === 429;
        if (isQuotaError && attempt < RETRY_DELAY.length) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY[attempt]));
          attempt++;
          continue;
        }
        return {
          answer: "The chef is briefly away from the table. Please try again in a moment.",
          suggestions: ["Wait a moment"]
        };
      }
    }
    return { answer: "Service busy.", suggestions: [] };
  }
);
