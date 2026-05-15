
import { PlaceHolderImages } from './placeholder-images';

/**
 * Utility to get a relevant image URL and hint for a recipe.
 * Prioritizes curated placeholders, then falls back to a seeded picsum URL with a descriptive hint.
 */
export function getRecipeImageData(recipeName: string, imageHint?: string) {
  const nameLower = recipeName.toLowerCase();
  
  // 1. Try to find a curated match in our local library
  const curatedMatch = PlaceHolderImages.find(img => 
    nameLower.includes(img.id.split('-')[0]) || 
    (img.imageHint && nameLower.includes(img.imageHint.toLowerCase()))
  );

  if (curatedMatch) {
    return {
      url: curatedMatch.imageUrl,
      hint: curatedMatch.imageHint
    };
  }

  // 2. Fallback to picsum with the AI-generated hint for Unsplash replacement
  // We use the recipe name as a seed to ensure the image is unique but consistent for that dish
  return {
    url: `https://picsum.photos/seed/${encodeURIComponent(recipeName)}/800/600`,
    hint: imageHint || recipeName.split(' ').slice(0, 2).join(' ')
  };
}
