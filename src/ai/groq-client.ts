
import OpenAI from 'openai';

/**
 * @fileOverview Primary Groq API client configuration.
 * Using llama-3.3-70b-versatile for all gourmet manifestations.
 */

console.log("Using Groq provider: llama-3.3-70b-versatile");

const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || '';

if (!apiKey) {
  console.error("ALCHEMIST ERROR: No GROQ_API_KEY found. AI features will fail.");
}

export const groqClient = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://api.groq.com/openai/v1',
  dangerouslyAllowBrowser: false,
});

/**
 * Helper to check if the Groq client is properly configured.
 */
export function isGroqConfigured() {
  return !!apiKey;
}
