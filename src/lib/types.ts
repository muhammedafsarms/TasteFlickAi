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
  // Pantry Essentials
  { name: 'All-Purpose Flour', category: 'Pantry' },
  { name: 'White Rice', category: 'Pantry' },
  { name: 'Brown Rice', category: 'Pantry' },
  { name: 'Quinoa', category: 'Pantry' },
  { name: 'Pasta', category: 'Pantry' },
  { name: 'Rolled Oats', category: 'Pantry' },
  { name: 'Sugar', category: 'Pantry' },
  { name: 'Brown Sugar', category: 'Pantry' },
  { name: 'Honey', category: 'Pantry' },
  { name: 'Maple Syrup', category: 'Pantry' },
  { name: 'Baking Powder', category: 'Pantry' },
  { name: 'Baking Soda', category: 'Pantry' },
  { name: 'Cornstarch', category: 'Pantry' },
  { name: 'Breadcrumbs', category: 'Pantry' },
  
  // Oils & Vinegars
  { name: 'Olive Oil', category: 'Oils & Vinegars' },
  { name: 'Vegetable Oil', category: 'Oils & Vinegars' },
  { name: 'Sesame Oil', category: 'Oils & Vinegars' },
  { name: 'Coconut Oil', category: 'Oils & Vinegars' },
  { name: 'Balsamic Vinegar', category: 'Oils & Vinegars' },
  { name: 'Apple Cider Vinegar', category: 'Oils & Vinegars' },
  { name: 'Rice Vinegar', category: 'Oils & Vinegars' },
  { name: 'Red Wine Vinegar', category: 'Oils & Vinegars' },

  // Fridge & Dairy
  { name: 'Milk', category: 'Dairy' },
  { name: 'Heavy Cream', category: 'Dairy' },
  { name: 'Butter', category: 'Dairy' },
  { name: 'Eggs', category: 'Fridge' },
  { name: 'Greek Yogurt', category: 'Dairy' },
  { name: 'Cheddar Cheese', category: 'Dairy' },
  { name: 'Parmesan Cheese', category: 'Dairy' },
  { name: 'Mozzarella', category: 'Dairy' },
  { name: 'Feta Cheese', category: 'Dairy' },
  { name: 'Cream Cheese', category: 'Dairy' },
  { name: 'Tofu', category: 'Fridge' },
  
  // Vegetables
  { name: 'Onion', category: 'Vegetables' },
  { name: 'Garlic', category: 'Vegetables' },
  { name: 'Ginger', category: 'Vegetables' },
  { name: 'Potato', category: 'Vegetables' },
  { name: 'Sweet Potato', category: 'Vegetables' },
  { name: 'Carrot', category: 'Vegetables' },
  { name: 'Bell Pepper', category: 'Vegetables' },
  { name: 'Broccoli', category: 'Vegetables' },
  { name: 'Spinach', category: 'Vegetables' },
  { name: 'Kale', category: 'Vegetables' },
  { name: 'Zucchini', category: 'Vegetables' },
  { name: 'Tomato', category: 'Vegetables' },
  { name: 'Cucumber', category: 'Vegetables' },
  { name: 'Celery', category: 'Vegetables' },
  { name: 'Mushrooms', category: 'Vegetables' },
  { name: 'Asparagus', category: 'Vegetables' },
  { name: 'Eggplant', category: 'Vegetables' },
  { name: 'Avocado', category: 'Vegetables' },
  { name: 'Cauliflower', category: 'Vegetables' },
  { name: 'Green Beans', category: 'Vegetables' },
  { name: 'Cabbage', category: 'Vegetables' },
  
  // Fruits
  { name: 'Lemon', category: 'Fruit' },
  { name: 'Lime', category: 'Fruit' },
  { name: 'Orange', category: 'Fruit' },
  { name: 'Apple', category: 'Fruit' },
  { name: 'Banana', category: 'Fruit' },
  { name: 'Blueberries', category: 'Fruit' },
  { name: 'Strawberries', category: 'Fruit' },
  { name: 'Pineapple', category: 'Fruit' },
  { name: 'Mango', category: 'Fruit' },

  // Proteins
  { name: 'Chicken Breast', category: 'Meat' },
  { name: 'Chicken Thighs', category: 'Meat' },
  { name: 'Ground Beef', category: 'Meat' },
  { name: 'Steak', category: 'Meat' },
  { name: 'Pork Chops', category: 'Meat' },
  { name: 'Bacon', category: 'Meat' },
  { name: 'Salmon', category: 'Seafood' },
  { name: 'Shrimp', category: 'Seafood' },
  { name: 'Canned Tuna', category: 'Seafood' },
  { name: 'White Fish', category: 'Seafood' },

  // Spices & Herbs
  { name: 'Salt', category: 'Spices' },
  { name: 'Black Pepper', category: 'Spices' },
  { name: 'Cinnamon', category: 'Spices' },
  { name: 'Cumin', category: 'Spices' },
  { name: 'Paprika', category: 'Spices' },
  { name: 'Turmeric', category: 'Spices' },
  { name: 'Chili Powder', category: 'Spices' },
  { name: 'Dried Oregano', category: 'Spices' },
  { name: 'Dried Thyme', category: 'Spices' },
  { name: 'Dried Basil', category: 'Spices' },
  { name: 'Garlic Powder', category: 'Spices' },
  { name: 'Onion Powder', category: 'Spices' },
  { name: 'Cayenne Pepper', category: 'Spices' },
  { name: 'Fresh Cilantro', category: 'Herbs' },
  { name: 'Fresh Parsley', category: 'Herbs' },
  { name: 'Fresh Basil', category: 'Herbs' },
  { name: 'Fresh Rosemary', category: 'Herbs' },
  { name: 'Fresh Thyme', category: 'Herbs' },

  // Legumes & Nuts
  { name: 'Chickpeas', category: 'Legumes' },
  { name: 'Black Beans', category: 'Legumes' },
  { name: 'Lentils', category: 'Legumes' },
  { name: 'Kidney Beans', category: 'Legumes' },
  { name: 'Peanut Butter', category: 'Pantry' },
  { name: 'Almonds', category: 'Nuts' },
  { name: 'Walnuts', category: 'Nuts' },
  { name: 'Cashews', category: 'Nuts' },

  // Sauces & Condiments
  { name: 'Soy Sauce', category: 'Sauces' },
  { name: 'Mayonnaise', category: 'Sauces' },
  { name: 'Mustard', category: 'Sauces' },
  { name: 'Ketchup', category: 'Sauces' },
  { name: 'Hot Sauce', category: 'Sauces' },
  { name: 'Sriracha', category: 'Sauces' },
  { name: 'Miso Paste', category: 'Sauces' },
  { name: 'Tomato Paste', category: 'Sauces' },
  { name: 'Coconut Milk', category: 'Pantry' },
  { name: 'Chicken Broth', category: 'Pantry' },
  { name: 'Beef Broth', category: 'Pantry' },
  { name: 'Vegetable Broth', category: 'Pantry' },
];
