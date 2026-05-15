
"use client";

import { useState, useMemo } from "react";
import { Recipe } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Share2, Printer, CheckCircle2 } from "lucide-react";

interface GroceryGeneratorProps {
  savedRecipes: Recipe[];
  pantryIngredients: string[];
}

export function GroceryGenerator({ savedRecipes, pantryIngredients }: GroceryGeneratorProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const missingIngredients = useMemo(() => {
    const allIngredients: string[] = [];
    savedRecipes.forEach(recipe => {
      recipe.ingredientsList.forEach(item => {
        // Simple logic: if a common pantry item isn't strictly in the name, we might need it
        // In a real app, this would use a more complex parser
        const isAlreadyInPantry = pantryIngredients.some(p => 
          item.toLowerCase().includes(p.toLowerCase())
        );
        if (!isAlreadyInPantry) {
          allIngredients.push(item);
        }
      });
    });
    return Array.from(new Set(allIngredients));
  }, [savedRecipes, pantryIngredients]);

  const toggleItem = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  if (savedRecipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <ShoppingCart className="h-16 w-16 text-muted-foreground opacity-20 mb-6" />
        <h3 className="text-2xl font-headline">No Shopping Necessary</h3>
        <p className="text-muted-foreground mt-4 font-body">Save some recipes to automatically generate your gourmet shopping list.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-24">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-headline font-bold text-primary">One-Tap Grocery Generator</h2>
        <p className="text-muted-foreground font-body italic">Everything you're missing for your saved masterpieces.</p>
      </div>

      <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
        <div className="bg-primary/5 p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-headline font-bold">Shopping Checklist</h3>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10">
                <Printer className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            {missingIngredients.map((item, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "flex items-center space-x-4 p-3 rounded-xl transition-colors cursor-pointer",
                  checkedItems[item] ? "bg-muted/30" : "hover:bg-primary/5"
                )}
                onClick={() => toggleItem(item)}
              >
                <Checkbox 
                  id={`item-${idx}`} 
                  checked={checkedItems[item] || false}
                  className="h-6 w-6 rounded-full border-2 border-primary data-[state=checked]:bg-primary"
                />
                <label
                  htmlFor={`item-${idx}`}
                  className={cn(
                    "text-lg font-body flex-1 cursor-pointer",
                    checkedItems[item] && "line-through text-muted-foreground"
                  )}
                >
                  {item}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-accent/30 rounded-2xl flex flex-col items-center text-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-secondary" />
            <p className="font-body text-sm">
              You are {missingIngredients.length - Object.values(checkedItems).filter(Boolean).length} items away from gourmet perfection.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { cn } from "@/lib/utils";
