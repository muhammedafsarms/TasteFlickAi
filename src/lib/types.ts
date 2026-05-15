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
  // Indian Staples
  { name: 'Basmati Rice', category: 'Indian Pantry' },
  { name: 'Paneer', category: 'Dairy' },
  { name: 'Ghee', category: 'Dairy' },
  { name: 'Curry Leaves', category: 'Herbs' },
  { name: 'Mustard Seeds', category: 'Spices' },
  { name: 'Fenugreek Seeds (Methi)', category: 'Spices' },
  { name: 'Asafoetida (Hing)', category: 'Spices' },
  { name: 'Tamarind Paste', category: 'Sauces' },
  { name: 'Garam Masala', category: 'Spices' },
  { name: 'Cardamom Pods', category: 'Spices' },
  { name: 'Cloves', category: 'Spices' },
  { name: 'Coriander Seeds', category: 'Spices' },
  { name: 'Cumin Seeds (Jeera)', category: 'Spices' },
  { name: 'Turmeric Powder', category: 'Spices' },
  { name: 'Red Chili Powder (Kashmiri)', category: 'Spices' },
  { name: 'Besan (Gram Flour)', category: 'Pantry' },
  { name: 'Moong Dal', category: 'Legumes' },
  { name: 'Toor Dal', category: 'Legumes' },
  { name: 'Chana Dal', category: 'Legumes' },
  { name: 'Urad Dal', category: 'Legumes' },
  { name: 'Kalonji (Nigella Seeds)', category: 'Spices' },
  { name: 'Amchur (Mango Powder)', category: 'Spices' },
  { name: 'Kasuri Methi', category: 'Herbs' },

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
  { name: 'Asparagus', category: 'Vegetables' },
  { name: 'Eggplant', category: 'Vegetables' },
  { name: 'Avocado', category: 'Vegetables' },
  { name: 'Cauliflower', category: 'Vegetables' },
  { name: 'Green Beans', category: 'Vegetables' },
  { name: 'Cabbage', category: 'Vegetables' },
  { name: 'Bitter Gourd (Karela)', category: 'Vegetables' },
  { name: 'Okra (Bhindi)', category: 'Vegetables' },
  { name: 'Bottle Gourd (Lauki)', category: 'Vegetables' },
  { name: 'Drumstick (Moringa)', category: 'Vegetables' },
  { name: 'Radish (Mooli)', category: 'Vegetables' },
  { name: 'Shiitake', category: 'Vegetables' },
  { name: 'Portobello', category: 'Vegetables' },

  // Spicy Vegetables
  { name: 'Green Chilli', category: 'Vegetables' },
  { name: 'Red Chilli', category: 'Vegetables' },
  { name: 'Jalapeño Pepper', category: 'Vegetables' },
  { name: 'Habanero Pepper', category: 'Vegetables' },
  { name: 'Thai Bird\'s Eye Chili', category: 'Vegetables' },
  { name: 'Poblano Pepper', category: 'Vegetables' },

  // Fruits
  { name: 'Lemon', category: 'Fruit' },
  { name: 'Lime', category: 'Fruit' },
  { name: 'Mango', category: 'Fruit' },
  { name: 'Pomegranate Seeds', category: 'Fruit' },

  // Proteins
  { name: 'Chicken Breast', category: 'Meat' },
  { name: 'Chicken Thighs', category: 'Meat' },
  { name: 'Lamb Shoulder', category: 'Meat' },
  { name: 'Ground Beef', category: 'Meat' },
  { name: 'Salmon', category: 'Seafood' },
  { name: 'Shrimp', category: 'Seafood' },

  // Sauces & Condiments
  { name: 'Soy Sauce', category: 'Sauces' },
  { name: 'Sriracha', category: 'Sauces' },
  { name: 'Gochujang', category: 'Sauces' },
  { name: 'Mango Chutney', category: 'Sauces' },
  { name: 'Mint Chutney', category: 'Sauces' },
  { name: 'Tamarind Chutney', category: 'Sauces' },
];
