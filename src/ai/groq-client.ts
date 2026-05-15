
import OpenAI from 'openai';

/**
 * @fileOverview Groq API client configuration.
 * Uses a defensive initialization to prevent startup crashes when the API key is missing.
 */

const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || '';

if (!apiKey) {
  console.warn("Chef's Warning: No GROQ_API_KEY or OPENAI_API_KEY found in environment variables. AI features will be limited.");
} else {
  console.log("Chef's Update: AI client initialized with key starting with:", apiKey.substring(0, 7) + "...");
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
  const configured = !!process.env.GROQ_API_KEY || !!process.env.OPENAI_API_KEY;
  if (!configured) {
    console.error("Chef's Error: API Key configuration missing. Check your environment variables.");
  }
  return configured;
}
