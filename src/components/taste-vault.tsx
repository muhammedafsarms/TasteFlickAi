"use client";

import { useState } from "react";
import { Recipe } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Activity, Scale, Zap, Droplets, ChevronDown, ChevronUp, ChefHat, Clock, Star, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

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
        <p className="text-muted-foreground mt-4 max-sm font-body leading-relaxed">
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
          <Card key={recipe.id} className="overflow-hidden border-none shadow-2xl bg-white flex flex-col rounded-[2rem]">
            <div className="relative h-72 w-full">
              <Image 
                src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/800/600`} 
                alt={recipe.recipeName}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute top-4 left-6 flex gap-2">
                 <Badge className="bg-white/20 backdrop-blur-md text-white border-white/10 uppercase tracking-widest text-[9px] font-bold">
                  {recipe.difficulty}
                </Badge>
              </div>
              <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                <div className="space-y-1">
                  <h3 className="text-3xl font-headline text-white font-bold tracking-tight">{recipe.recipeName}</h3>
                  <div className="flex gap-4 text-white/70 text-xs font-body items-center">
                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {recipe.prepTime} Prep</span>
                    <span className="flex items-center gap-1.5"><UtensilsCrossed className="h-3 w-3" /> {recipe.cookTime} Cook</span>
                  </div>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-white hover:bg-destructive/80 h-12 w-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20"
                  onClick={() => onRemove(recipe.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <CardContent className="p-8">
              {recipe.nutrition && (
                <div className="grid grid-cols-4 gap-4 mb-8 p-6 bg-accent/20 rounded-[1.5rem] border border-accent">
                  <div className="flex flex-col items-center text-center">
                    <Zap className="h-5 w-5 text-primary mb-1.5" />
                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Calories</span>
                    <span className="font-headline font-bold text-lg">{recipe.nutrition.calories}</span>
                  </div>
                  <div className="flex flex-col items-center text-center border-l border-border/50">
                    <Activity className="h-5 w-5 text-secondary mb-1.5" />
                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Protein</span>
                    <span className="font-headline font-bold text-lg">{recipe.nutrition.proteinGrams}g</span>
                  </div>
                  <div className="flex flex-col items-center text-center border-l border-border/50">
                    <Droplets className="h-5 w-5 text-primary mb-1.5" />
                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Fat</span>
                    <span className="font-headline font-bold text-lg">{recipe.nutrition.fatGrams}g</span>
                  </div>
                  <div className="flex flex-col items-center text-center border-l border-border/50">
                    <Scale className="h-5 w-5 text-secondary mb-1.5" />
                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Carbs</span>
                    <span className="font-headline font-bold text-lg">{recipe.nutrition.carbohydratesGrams}g</span>
                  </div>
                </div>
              )}

              <p className="text-muted-foreground italic mb-8 leading-relaxed font-body text-base border-l-4 border-primary/20 pl-6">
                "{recipe.description}"
              </p>

              <Button 
                variant="outline" 
                className="w-full h-14 rounded-full border-primary/20 text-primary hover:bg-primary/5 font-headline text-lg group"
                onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)}
              >
                {expandedId === recipe.id ? (
                  <>Hide Preparation <ChevronUp className="ml-2 h-5 w-5" /></>
                ) : (
                  <>Reveal Preparation <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-0.5 transition-transform" /></>
                )}
              </Button>

              {expandedId === recipe.id && (
                <div className="mt-12 space-y-12 animate-in slide-in-from-top-4 duration-500">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Star className="h-5 w-5 text-primary fill-primary" />
                        <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">The Mise en Place</h4>
                      </div>
                      <ul className="space-y-3">
                        {recipe.ingredientsList.map((ing, i) => (
                          <li key={i} className="flex items-center gap-4 py-3 border-b border-border/40 text-sm font-body">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Star className="h-5 w-5 text-primary fill-primary" />
                        <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">The Masterclass</h4>
                      </div>
                      <div className="space-y-8">
                        {recipe.instructions.map((step, idx) => (
                          <div key={idx} className="flex gap-6">
                            <span className="text-4xl font-headline font-bold text-primary/10 italic leading-none tabular-nums">
                              {idx + 1}
                            </span>
                            <p className="text-sm leading-relaxed font-body pt-1">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10">
                    <h4 className="font-headline text-2xl mb-4 text-primary italic">Plating Like a Chef</h4>
                    <p className="text-base italic leading-relaxed text-muted-foreground font-body">
                      {recipe.platingSuggestions}
                    </p>
                  </div>

                  {recipe.dietaryNotes && (
                    <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/10 flex gap-4 items-start">
                      <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                         <ChefHat className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-1">Chef's Dietary Insight</p>
                        <p className="text-sm italic font-body">{recipe.dietaryNotes}</p>
                      </div>
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
