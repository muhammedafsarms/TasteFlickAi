
'use server';
/**
 * @fileOverview Culinary advice chat flow using Groq Llama 3.
 */

import {ai} from '../genkit';
import {z} from 'genkit';
import {groqClient, isGroqConfigured} from '../groq-client';

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
    console.log("Chef's Table: Received message:", input.message);
    
    if (!isGroqConfigured()) {
      return { 
        answer: "The chef's kitchen is missing its secret key (GROQ_API_KEY). Please configure it to begin our culinary dialogue.", 
        suggestions: ["Check API configuration"] 
      };
    }

    let attempt = 0;

    while (attempt <= RETRY_DELAY.length) {
      try {
        const historyMessages = input.history?.slice(-6).map(h => ({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.content
        })) || [];

        console.log(`Chef's Table: Sending request (Attempt ${attempt + 1})...`);

        const completion = await groqClient.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a world-class chef. Provide concise, helpful culinary advice. You must respond in a valid JSON object format with two fields: "answer" (string) and "suggestions" (array of strings).'
            },
            ...historyMessages as any,
            {
              role: 'user',
              content: input.message
            }
          ],
          temperature: 0.7,
          max_tokens: 1024,
          response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content;
        console.log("Chef's Table: Raw response received:", content);

        if (!content) {
          throw new Error('Chef received an empty plate (no response content).');
        }
        
        try {
          const data = JSON.parse(content);
          return {
            answer: data.answer || "I'm sorry, I couldn't process that culinary request.",
            suggestions: data.suggestions || []
          };
        } catch (parseError) {
          console.error("Chef's Table: JSON Parsing failed:", parseError, "Content:", content);
          throw new Error('The chef spoke in riddles (invalid JSON response).');
        }

      } catch (error: any) {
        console.error(`Chef's Table Error (Attempt ${attempt + 1}):`, error.message || error);
        
        const isQuotaError = error.status === 429;
        if (isQuotaError && attempt < RETRY_DELAY.length) {
          console.warn(`Chef's Table: Rate limited. Retrying in ${RETRY_DELAY[attempt]}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY[attempt]));
          attempt++;
          continue;
        }

        return {
          answer: `The chef is briefly away from the table. (Error: ${error.message || "Unknown culinary mishap"})`,
          suggestions: ["Try again in a moment"]
        };
      }
    }
    return { answer: "The kitchen is currently overwhelmed. Please try again later.", suggestions: [] };
  }
);
