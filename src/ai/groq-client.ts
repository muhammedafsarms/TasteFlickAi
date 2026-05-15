
import OpenAI from 'openai';

/**
 * @fileOverview Groq API client configuration.
 */

export const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
  dangerouslyAllowBrowser: false,
});
