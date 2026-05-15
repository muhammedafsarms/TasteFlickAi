
"use client";

import { useState } from "react";
import { Ingredient, COMMON_INGREDIENTS } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2, Wand2, Check, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface PantryBuilderProps {
  selectedIngredients: string[];
  onIngredientToggle: (name: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function PantryBuilder({ selectedIngredients, onIngredientToggle, onGenerate, isGenerating }: PantryBuilderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const categories = Array.from(new Set(COMMON_INGREDIENTS.map(i => i.category)));

  const filteredIngredients = COMMON_INGREDIENTS.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-headline font-bold text-primary">Smart Pantry Alchemist</h2>
        <p className="text-muted-foreground font-body leading-relaxed">
          Select the items currently in your kitchen. Our Alchemist will transform them into gourmet creations.
        </p>
      </div>

      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search ingredients..." 
          className="pl-10 h-12 rounded-full border-border bg-white shadow-sm focus-visible:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="flex flex-col gap-8 pb-32">
          {categories.map(category => {
            const categoryIngredients = filteredIngredients.filter(i => i.category === category);
            if (categoryIngredients.length === 0) return null;

            return (
              <div key={category} className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-secondary/60 ml-2">
                  {category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categoryIngredients.map((ingredient) => {
                    const isSelected = selectedIngredients.includes(ingredient.name);
                    return (
                      <Card 
                        key={ingredient.name}
                        className={cn(
                          "cursor-pointer transition-all duration-300 border-2 select-none h-24 flex items-center justify-center p-2 text-center",
                          isSelected 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-transparent bg-white hover:border-primary/20 shadow-sm"
                        )}
                        onClick={() => onIngredientToggle(ingredient.name)}
                      >
                        <CardContent className="p-0 flex flex-col items-center gap-2">
                          <span className={cn(
                            "font-headline text-lg leading-tight",
                            isSelected ? "text-primary font-bold" : "text-foreground"
                          )}>
                            {ingredient.name}
                          </span>
                          {isSelected && <Check className="h-4 w-4 text-primary animate-in zoom-in" />}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="fixed bottom-24 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent md:relative md:bottom-auto md:bg-none md:p-0">
        <Button 
          className="w-full h-16 rounded-full text-lg font-headline shadow-xl hover:shadow-2xl transition-all gap-3 bg-primary group overflow-hidden relative"
          onClick={onGenerate}
          disabled={selectedIngredients.length === 0 || isGenerating}
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-6 w-6 animate-pulse" />
              Manifesting Gourmet Flavour...
            </>
          ) : (
            <>
              <Wand2 className="h-6 w-6 group-hover:rotate-12 transition-transform" />
              Alchemy Start ({selectedIngredients.length} Items)
            </>
          )}
          {isGenerating && (
            <div className="absolute inset-0 bg-white/10 animate-pulse" />
          )}
        </Button>
      </div>
    </div>
  );
}
