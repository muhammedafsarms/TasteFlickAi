'use server';
/**
 * @fileOverview Culinary advice and recipe manifestation chat flow using Groq Llama 3.
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
    if (!isGroqConfigured()) {
      return { 
        answer: "The chef's kitchen is missing its secret key. Please configure GROQ_API_KEY to begin our culinary dialogue.", 
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

        const completion = await groqClient.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are a world-class Michelin-star chef. 
              
              - If the user asks for a recipe, provide a highly detailed gourmet manifestation. 
              - If the user asks for advice, provide eloquent culinary wisdom.
              - For any "recipeName", create a descriptive, evocative, and technically accurate gourmet name that is EXACTLY one, two, or three words long.
              
              STRICT FORMATTING:
              You MUST respond in a valid JSON object format:
              - "answer": (string) Your conversational response.
              - "suggestions": (array of strings) 2-3 follow-up topics.
              - "recipe": (optional object) Only if appropriate. Fields: recipeName (1-3 words), description, prepTime, cookTime, difficulty, instructions, ingredientsList, platingSuggestions, dietaryNotes.`
            },
            ...historyMessages as any,
            {
              role: 'user',
              content: input.message
            }
          ],
          temperature: 0.7,
          max_tokens: 3000,
          response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error('Chef received an empty plate.');
        
        const data = JSON.parse(content);
        return {
          answer: data.answer || "I'm sorry, I couldn't process that culinary request.",
          suggestions: data.suggestions || [],
          recipe: data.recipe || undefined
        };

      } catch (error: any) {
        if (error.status === 429 && attempt < RETRY_DELAY.length) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY[attempt]));
          attempt++;
          continue;
        }

        return {
          answer: `The kitchen is briefly overwhelmed. (Error: ${error.message || "Unknown mishap"})`,
          suggestions: ["Try again in a moment"]
        };
      }
    }
    return { answer: "The kitchen is currently closed for cleaning. Please try again later.", suggestions: [] };
  }
);
