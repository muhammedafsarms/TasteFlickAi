
"use client";

import { useState } from "react";
import { Recipe } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Heart, Scale, Activity, Droplets, Zap, ChevronDown, ChevronUp, ChefHat } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TasteVaultProps {
  recipes: Recipe[];
  onRemove: (id: string) => void;
}

export function TasteVault({ recipes, onRemove }: TasteVaultProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <ChefHat className="h-16 w-16 text-muted-foreground opacity-20 mb-6" />
        <h3 className="text-3xl font-headline">Your Vault is Empty</h3>
        <p className="text-muted-foreground mt-4 max-w-sm font-body leading-relaxed">
          Gourmet secrets are waiting to be flicked. Head over to the Flavor Flick to start building your personal cookbook.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-24">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-headline font-bold text-primary">Taste Vault</h2>
        <p className="text-muted-foreground font-body italic">Your collection of handcrafted gourmet algorithms.</p>
      </div>

      <div className="grid gap-8">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="overflow-hidden border-none shadow-xl bg-white flex flex-col">
            <div className="relative h-64 w-full">
              <Image 
                src={recipe.imageUrl || "https://picsum.photos/seed/vault/800/600"} 
                alt={recipe.recipeName}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                <h3 className="text-2xl font-headline text-white font-bold">{recipe.recipeName}</h3>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-white hover:bg-white/20"
                  onClick={() => onRemove(recipe.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <CardContent className="p-6">
              {recipe.nutrition && (
                <div className="grid grid-cols-4 gap-2 mb-6 p-4 bg-accent/30 rounded-2xl">
                  <div className="flex flex-col items-center text-center">
                    <Zap className="h-4 w-4 text-primary mb-1" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Cals</span>
                    <span className="font-headline font-bold">{recipe.nutrition.calories}</span>
                  </div>
                  <div className="flex flex-col items-center text-center border-l border-border">
                    <Activity className="h-4 w-4 text-secondary mb-1" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Protein</span>
                    <span className="font-headline font-bold">{recipe.nutrition.proteinGrams}g</span>
                  </div>
                  <div className="flex flex-col items-center text-center border-l border-border">
                    <Droplets className="h-4 w-4 text-primary mb-1" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Fat</span>
                    <span className="font-headline font-bold">{recipe.nutrition.fatGrams}g</span>
                  </div>
                  <div className="flex flex-col items-center text-center border-l border-border">
                    <Scale className="h-4 w-4 text-secondary mb-1" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Carbs</span>
                    <span className="font-headline font-bold">{recipe.nutrition.carbohydratesGrams}g</span>
                  </div>
                </div>
              )}

              <p className="text-muted-foreground italic mb-6 leading-relaxed">
                "{recipe.description}"
              </p>

              <Button 
                variant="outline" 
                className="w-full border-primary/20 text-primary hover:bg-primary/5 font-headline"
                onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)}
              >
                {expandedId === recipe.id ? (
                  <>Hide Preparation <ChevronUp className="ml-2 h-4 w-4" /></>
                ) : (
                  <>Full Preparation <ChevronDown className="ml-2 h-4 w-4" /></>
                )}
              </Button>

              {expandedId === recipe.id && (
                <div className="mt-8 space-y-8 animate-in slide-in-from-top-4 duration-300">
                  <div>
                    <h4 className="font-headline text-xl mb-3 text-secondary italic">Ingredients</h4>
                    <ul className="grid grid-cols-1 gap-2">
                      {recipe.ingredientsList.map((ing, i) => (
                        <li key={i} className="flex items-center gap-3 py-2 border-b border-border/50 text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-headline text-xl mb-3 text-secondary italic">Step-by-Step Alchemy</h4>
                    <div className="space-y-6">
                      {recipe.instructions.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <span className="text-3xl font-headline font-bold text-primary/20 italic tabular-nums leading-none">
                            {idx + 1}
                          </span>
                          <p className="text-sm leading-relaxed pt-1">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {recipe.dietaryNotes && (
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Chef's Note</p>
                      <p className="text-sm italic">{recipe.dietaryNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
