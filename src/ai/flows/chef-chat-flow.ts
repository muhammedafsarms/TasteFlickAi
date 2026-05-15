'use server';
/**
 * @fileOverview Culinary advice chat flow with quota management.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChefChatInputSchema = z.object({
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional(),
});
export type ChefChatInput = z.infer<typeof ChefChatInputSchema>;

const ChefChatOutputSchema = z.object({
  answer: z.string(),
  suggestions: z.array(z.string()).optional(),
});
export type ChefChatOutput = z.infer<typeof ChefChatOutputSchema>;

const RETRY_DELAY = [2000, 5000, 10000];

export async function chefChat(input: ChefChatInput): Promise<ChefChatOutput> {
  let attempt = 0;

  while (attempt <= RETRY_DELAY.length) {
    try {
      const { text } = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        config: {
          temperature: 0.8,
          maxOutputTokens: 400,
        },
        prompt: `You are a world-class chef. Answer: ${input.message}
        History: ${input.history?.slice(-4).map(h => `${h.role}: ${h.content}`).join('\n')}
        
        Output raw JSON:
        {
          "answer": "Chef's response",
          "suggestions": ["Follow-up question?"]
        }`
      });

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Format error');
      return ChefChatOutputSchema.parse(JSON.parse(jsonMatch[0]));
    } catch (error: any) {
      const isQuotaError = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
      if (isQuotaError && attempt < RETRY_DELAY.length) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY[attempt]));
        attempt++;
        continue;
      }
      return {
        answer: "The Alchemist is briefly stepping away from the stove. Please ask again in a minute.",
        suggestions: ["Wait a moment"]
      };
    }
  }
  return { answer: "Service busy.", suggestions: [] };
}
