
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
  // Rice Varieties
  { name: 'Basmati Rice', category: 'Rice Varieties' },
  { name: 'Brown Basmati Rice', category: 'Rice Varieties' },
  { name: 'Jasmine Rice', category: 'Rice Varieties' },
  { name: 'Sona Masuri Rice', category: 'Rice Varieties' },
  { name: 'Arborio Rice', category: 'Rice Varieties' },
  { name: 'Carnaroli Rice', category: 'Rice Varieties' },
  { name: 'Vialone Nano Rice', category: 'Rice Varieties' },
  { name: 'Bomba Rice', category: 'Rice Varieties' },
  { name: 'Sushi Rice (Koshihikari)', category: 'Rice Varieties' },
  { name: 'Black Rice (Forbidden Rice)', category: 'Rice Varieties' },
  { name: 'Red Rice (Matta)', category: 'Rice Varieties' },
  { name: 'Bhutanese Red Rice', category: 'Rice Varieties' },
  { name: 'Sticky Rice (Glutinous)', category: 'Rice Varieties' },
  { name: 'Wild Rice', category: 'Rice Varieties' },
  { name: 'Calrose Rice', category: 'Rice Varieties' },
  { name: 'Poha (Flattened Rice)', category: 'Rice Varieties' },
  { name: 'Murmura (Puffed Rice)', category: 'Rice Varieties' },
  { name: 'Parboiled Rice', category: 'Rice Varieties' },
  { name: 'Long Grain White Rice', category: 'Rice Varieties' },
  { name: 'Short Grain White Rice', category: 'Rice Varieties' },
  { name: 'Broken Rice', category: 'Rice Varieties' },
  { name: 'Bamboo Rice', category: 'Rice Varieties' },
  { name: 'Govindobhog Rice', category: 'Rice Varieties' },
  { name: 'Ponni Rice', category: 'Rice Varieties' },

  // Indian Staples & Spices
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
  { name: 'Saffron', category: 'Spices' },
  { name: 'Star Anise', category: 'Spices' },
  { name: 'Mace (Javitri)', category: 'Spices' },
  { name: 'Black Salt (Kala Namak)', category: 'Spices' },

  // Grains & Flours
  { name: 'All-Purpose Flour', category: 'Pantry' },
  { name: 'Whole Wheat Flour (Atta)', category: 'Pantry' },
  { name: 'Bread Flour', category: 'Pantry' },
  { name: 'Cornmeal', category: 'Pantry' },
  { name: 'Quinoa', category: 'Pantry' },
  { name: 'Couscous', category: 'Pantry' },
  { name: 'Bulgur', category: 'Pantry' },
  { name: 'Buckwheat', category: 'Pantry' },
  { name: 'Semolina', category: 'Pantry' },
  { name: 'Rolled Oats', category: 'Pantry' },

  // Vegetables - Root & Alliums
  { name: 'Onion', category: 'Vegetables' },
  { name: 'Red Onion', category: 'Vegetables' },
  { name: 'Shallots', category: 'Vegetables' },
  { name: 'Leeks', category: 'Vegetables' },
  { name: 'Garlic', category: 'Vegetables' },
  { name: 'Ginger', category: 'Vegetables' },
  { name: 'Potato', category: 'Vegetables' },
  { name: 'Sweet Potato', category: 'Vegetables' },
  { name: 'Carrot', category: 'Vegetables' },
  { name: 'Parsnip', category: 'Vegetables' },
  { name: 'Beetroot', category: 'Vegetables' },
  { name: 'Radish (Mooli)', category: 'Vegetables' },
  { name: 'Turnip', category: 'Vegetables' },
  { name: 'Galangal', category: 'Vegetables' },
  { name: 'Turmeric Root', category: 'Vegetables' },

  // Vegetables - Greens & Cruciferous
  { name: 'Spinach', category: 'Vegetables' },
  { name: 'Kale', category: 'Vegetables' },
  { name: 'Swiss Chard', category: 'Vegetables' },
  { name: 'Bok Choy', category: 'Vegetables' },
  { name: 'Cabbage', category: 'Vegetables' },
  { name: 'Red Cabbage', category: 'Vegetables' },
  { name: 'Broccoli', category: 'Vegetables' },
  { name: 'Cauliflower', category: 'Vegetables' },
  { name: 'Brussels Sprouts', category: 'Vegetables' },
  { name: 'Asparagus', category: 'Vegetables' },
  { name: 'Celery', category: 'Vegetables' },

  // Vegetables - Nightshades & Others
  { name: 'Tomato', category: 'Vegetables' },
  { name: 'Cherry Tomatoes', category: 'Vegetables' },
  { name: 'Eggplant', category: 'Vegetables' },
  { name: 'Bell Pepper (Red)', category: 'Vegetables' },
  { name: 'Bell Pepper (Green)', category: 'Vegetables' },
  { name: 'Zucchini', category: 'Vegetables' },
  { name: 'Okra (Bhindi)', category: 'Vegetables' },
  { name: 'Bitter Gourd (Karela)', category: 'Vegetables' },
  { name: 'Bottle Gourd (Lauki)', category: 'Vegetables' },

  // Chillies
  { name: 'Green Chilli', category: 'Spicy' },
  { name: 'Red Chilli', category: 'Spicy' },
  { name: 'Bird\'s Eye Chilli', category: 'Spicy' },
  { name: 'Jalapeño', category: 'Spicy' },
  { name: 'Habanero', category: 'Spicy' },

  // Proteins
  { name: 'Chicken Breast', category: 'Meat' },
  { name: 'Chicken Thighs', category: 'Meat' },
  { name: 'Lamb Mince', category: 'Meat' },
  { name: 'Ground Beef', category: 'Meat' },
  { name: 'Salmon Fillet', category: 'Seafood' },
  { name: 'Shrimp / Prawns', category: 'Seafood' },
  { name: 'Tofu (Firm)', category: 'Proteins' },
  { name: 'Eggs', category: 'Fridge' },

  // Dairy & Alternatives
  { name: 'Milk', category: 'Dairy' },
  { name: 'Heavy Cream', category: 'Dairy' },
  { name: 'Greek Yogurt', category: 'Dairy' },
  { name: 'Butter (Unsalted)', category: 'Dairy' },
  { name: 'Cheddar Cheese', category: 'Dairy' },
  { name: 'Parmesan', category: 'Dairy' },
  { name: 'Coconut Milk', category: 'Pantry' },

  // Oils & Vinegars
  { name: 'Extra Virgin Olive Oil', category: 'Oils' },
  { name: 'Vegetable Oil', category: 'Oils' },
  { name: 'Sesame Oil (Toasted)', category: 'Oils' },
  { name: 'Mustard Oil', category: 'Oils' },
  { name: 'Balsamic Vinegar', category: 'Vinegars' },
  { name: 'Rice Vinegar', category: 'Vinegars' },

  // Sauces & Condiments
  { name: 'Soy Sauce', category: 'Sauces' },
  { name: 'Fish Sauce', category: 'Sauces' },
  { name: 'Oyster Sauce', category: 'Sauces' },
  { name: 'Sriracha', category: 'Spicy Sauces' },
  { name: 'Gochujang', category: 'Spicy Sauces' },
  { name: 'Miso Paste (White)', category: 'Sauces' },
  { name: 'Honey', category: 'Pantry' },
  { name: 'Maple Syrup', category: 'Pantry' },

  // Herbs (Fresh)
  { name: 'Cilantro (Coriander)', category: 'Herbs' },
  { name: 'Parsley (Flat-leaf)', category: 'Herbs' },
  { name: 'Basil (Genovese)', category: 'Herbs' },
  { name: 'Mint', category: 'Herbs' },
  { name: 'Rosemary', category: 'Herbs' },
  { name: 'Thyme', category: 'Herbs' },

// Dry Fruits & Nuts
{ name: 'Almonds', category: 'Dry Fruits & Nuts' },
{ name: 'Cashews', category: 'Dry Fruits & Nuts' },
{ name: 'Pistachios', category: 'Dry Fruits & Nuts' },
{ name: 'Walnuts', category: 'Dry Fruits & Nuts' },
{ name: 'Raisins', category: 'Dry Fruits & Nuts' },
{ name: 'Dates', category: 'Dry Fruits & Nuts' },
{ name: 'Dry Figs', category: 'Dry Fruits & Nuts' },
{ name: 'Apricots (Dried)', category: 'Dry Fruits & Nuts' },
{ name: 'Hazelnuts', category: 'Dry Fruits & Nuts' },
{ name: 'Pecans', category: 'Dry Fruits & Nuts' },
{ name: 'Macadamia Nuts', category: 'Dry Fruits & Nuts' },
{ name: 'Brazil Nuts', category: 'Dry Fruits & Nuts' },
{ name: 'Chestnuts', category: 'Dry Fruits & Nuts' },
{ name: 'Pine Nuts', category: 'Dry Fruits & Nuts' },
{ name: 'Peanuts', category: 'Dry Fruits & Nuts' },
{ name: 'Dried Cranberries', category: 'Dry Fruits & Nuts' },
{ name: 'Dried Blueberries', category: 'Dry Fruits & Nuts' },
{ name: 'Prunes', category: 'Dry Fruits & Nuts' },
{ name: 'Anjeer', category: 'Dry Fruits & Nuts' },
{ name: 'Chironji', category: 'Dry Fruits & Nuts' },
];