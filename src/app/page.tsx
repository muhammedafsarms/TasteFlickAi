
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { FlavorFlick } from "@/components/flavor-flick";
import { PantryBuilder } from "@/components/pantry-builder";
import { TasteVault } from "@/components/taste-vault";
import { GroceryGenerator } from "@/components/grocery-generator";
import { Recipe } from "@/lib/types";
import { generateRecipeFromPantry } from "@/ai/flows/generate-recipe-from-pantry";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";

export default function TasteFlickApp() {
  const [activeTab, setActiveTab] = useState("pantry");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('tasteflick_vault');
    if (saved) {
      try {
        setSavedRecipes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse vault", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('tasteflick_vault', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  const handleIngredientToggle = (name: string) => {
    setSelectedIngredients(prev => 
      prev.includes(name) 
        ? prev.filter(i => i !== name) 
        : [...prev, name]
    );
  };

  const handleGenerateRecipe = async () => {
    if (selectedIngredients.length === 0) return;
    
    setIsGenerating(true);
    try {
      const newRecipe = await generateRecipeFromPantry({
        ingredients: selectedIngredients
      });
      
      const recipeWithId: Recipe = {
        ...newRecipe,
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/600/800`,
      };

      setSuggestions(prev => [recipeWithId, ...prev]);
      setActiveTab("flick");
    } catch (error) {
      console.error(error);
      toast({
        title: "Alchemy Failed",
        description: "The kitchen spirits are restless. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveRecipe = (recipe: Recipe) => {
    setSavedRecipes(prev => [recipe, ...prev]);
    setSuggestions(prev => prev.filter(r => r.id !== recipe.id));
    toast({
      title: "Recipe Saved",
      description: `${recipe.recipeName} is now in your Vault.`
    });
  };

  const dismissRecipe = (id: string) => {
    setSuggestions(prev => prev.filter(r => r.id !== id));
  };

  const removeSavedRecipe = (id: string) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== id));
  };

  return (
    <main className="min-h-screen pb-24 pt-4 md:pt-24 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="mb-12 flex justify-between items-center md:hidden">
        <h1 className="text-3xl font-headline font-bold text-primary">TasteFlick</h1>
        <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="animate-in fade-in duration-700">
        {activeTab === "flick" && (
          <FlavorFlick 
            suggestions={suggestions} 
            onSave={saveRecipe} 
            onDismiss={dismissRecipe} 
          />
        )}

        {activeTab === "pantry" && (
          <PantryBuilder 
            selectedIngredients={selectedIngredients}
            onIngredientToggle={handleIngredientToggle}
            onGenerate={handleGenerateRecipe}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === "vault" && (
          <TasteVault 
            recipes={savedRecipes} 
            onRemove={removeSavedRecipe} 
          />
        )}

        {activeTab === "grocery" && (
          <GroceryGenerator 
            savedRecipes={savedRecipes} 
            pantryIngredients={selectedIngredients} 
          />
        )}
      </div>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {isGenerating && (
        <div className="fixed inset-0 z-[100] bg-background/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <h2 className="text-2xl font-headline font-bold">The Alchemist is Cooking...</h2>
            <p className="text-muted-foreground font-body max-w-[200px]">Blending your ingredients into gourmet perfection.</p>
          </div>
        </div>
      )}
    </main>
  );
}
