
import { config } from 'dotenv';
config();

import './flows/generate-recipe-from-pantry';
import './flows/analyze-recipe-nutrition-flow';
import './flows/chef-chat-flow';

console.log("AI Development Environment Initialized (Groq Primary)");
