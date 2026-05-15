
import { GenerateRecipeFromPantryOutput } from '@/ai/flows/generate-recipe-from-pantry';
import { AnalyzeRecipeNutritionOutput } from '@/ai/flows/analyze-recipe-nutrition-flow';

export type Recipe = GenerateRecipeFromPantryOutput & {
  id: string;
  nutrition?: AnalyzeRecipeNutritionOutput;
  imageUrl?: string;
  savedAt?: number;
};

export type Ingredient = {
  name: string;
  category: string;
};

export const COMMON_INGREDIENTS: Ingredient[] = [
  { name: 'Flour', category: 'Pantry' },
  { name: 'Eggs', category: 'Fridge' },
  { name: 'Milk', category: 'Fridge' },
  { name: 'Butter', category: 'Fridge' },
  { name: 'Onion', category: 'Vegetables' },
  { name: 'Garlic', category: 'Vegetables' },
  { name: 'Chicken Breast', category: 'Meat' },
  { name: 'Pasta', category: 'Pantry' },
  { name: 'Rice', category: 'Pantry' },
  { name: 'Tomato', category: 'Vegetables' },
  { name: 'Lemon', category: 'Fruit' },
  { name: 'Olive Oil', category: 'Pantry' },
  { name: 'Salt', category: 'Spices' },
  { name: 'Pepper', category: 'Spices' },
  { name: 'Honey', category: 'Pantry' },
  { name: 'Cheese', category: 'Fridge' },
  { name: 'Spinach', category: 'Vegetables' },
  { name: 'Salmon', category: 'Meat' },
  { name: 'Beef', category: 'Meat' },
  { name: 'Potato', category: 'Vegetables' },
];
