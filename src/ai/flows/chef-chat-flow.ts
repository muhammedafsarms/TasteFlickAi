'use server';
/**
 * @fileOverview Culinary advice and recipe manifestation chat flow using Genkit Prompts.
 * Includes fallback to Groq for quota resilience.
 */

import { ai } from '../genkit';
import { z } from 'genkit';
import { groqClient, isGroqConfigured } from '../groq-client';

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
      // Primary Attempt: Genkit Gemini
      const { output } = await chefPrompt(input);
      if (!output) throw new Error('Chef received an empty plate.');
      return output;
    } catch (error: any) {
      console.error("Chef Chat Gemini Error:", error.message);

      const isQuotaError = error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED');

      if (isQuotaError && isGroqConfigured()) {
        console.log("Chef: Gemini exhausted. Consulting the fallback Llama scrolls...");
        try {
          const completion = await groqClient.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { 
                role: 'system', 
                content: 'You are a Michelin-star chef. Answer culinary questions. If a recipe is requested, output a structured JSON object. Output ONLY raw JSON.' 
              },
              ... (input.history || []).map(h => ({ role: h.role, content: h.content })),
              { role: 'user', content: input.message }
            ],
            response_format: { type: 'json_object' }
          });

          const content = completion.choices[0]?.message?.content;
          if (!content) throw new Error('Groq fallback failed.');
          return ChefChatOutputSchema.parse(JSON.parse(content));
        } catch (groqError: any) {
          console.error("Chef Fallback Error:", groqError.message);
        }
      }

      return {
        answer: `The kitchen is briefly overwhelmed. (Error: ${error.message || "Unknown mishap"})`,
        suggestions: ["Try again in a moment"]
      };
    }
  }
);
