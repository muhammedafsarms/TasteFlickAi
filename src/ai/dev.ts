import { config } from 'dotenv';
config();

import '@/ai/flows/generate-recipe-from-pantry.ts';
import '@/ai/flows/analyze-recipe-nutrition-flow.ts';
import '@/ai/flows/chef-chat-flow.ts';
import '@/ai/flows/generate-recipe-image-flow.ts';
