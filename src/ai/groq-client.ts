
import OpenAI from 'openai';

/**
 * @fileOverview Groq API client configuration.
 * Uses a defensive initialization to prevent startup crashes when the API key is missing.
 */

const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || '';

export const groqClient = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://api.groq.com/openai/v1',
  dangerouslyAllowBrowser: false,
});

/**
 * Helper to check if the Groq client is properly configured.
 */
export function isGroqConfigured() {
  return !!process.env.GROQ_API_KEY || !!process.env.OPENAI_API_KEY;
}
