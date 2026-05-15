"use client";

import { useState } from "react";
import { Recipe } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, Info, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { analyzeRecipeNutrition } from "@/ai/flows/analyze-recipe-nutrition-flow";
import { cn } from "@/lib/utils";

interface FlavorFlickProps {
  suggestions: Recipe[];
  onSave: (recipe: Recipe) => void;
  onDismiss: (recipeId: string) => void;
}

export function FlavorFlick({ suggestions, onSave, onDismiss }: FlavorFlickProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlicking, setIsFlicking] = useState<'left' | 'right' | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentRecipe = suggestions[currentIndex];

  if (!currentRecipe) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <Sparkles className="h-12 w-12 text-primary/40 mb-4" />
        <h3 className="text-2xl font-headline">No More Flavour Suggestions</h3>
        <p className="text-muted-foreground mt-2 max-w-xs">
          Head back to the Pantry to conjure some fresh gourmet alchemy!
        </p>
      </div>
    );
  }

  const handleFlick = async (direction: 'left' | 'right') => {
    setIsFlicking(direction);
    
    // Simulate animation delay
    setTimeout(async () => {
      if (direction === 'right') {
        setIsAnalyzing(true);
        // Enrich with nutrition before saving
        try {
          const nutrition = await analyzeRecipeNutrition({
            recipeName: currentRecipe.recipeName,
            ingredients: currentRecipe.ingredientsList,
            instructions: currentRecipe.instructions
          });
          onSave({ ...currentRecipe, nutrition });
        } catch (e) {
          onSave(currentRecipe);
        } finally {
          setIsAnalyzing(false);
        }
      } else {
        onDismiss(currentRecipe.id);
      }
      
      setCurrentIndex(prev => prev + 1);
      setIsFlicking(null);
      setShowDetails(false);
    }, 300);
  };

  // Deterministic placeholder based on recipe name
  const placeholderUrl = `https://picsum.photos/seed/${currentRecipe.recipeName.length}/600/800`;

  return (
    <div className="relative w-full max-w-md mx-auto h-[70vh] flex flex-col items-center justify-center overflow-hidden">
      <div className={cn(
        "relative w-full aspect-[3/4] transition-all duration-300 transform",
        isFlicking === 'right' && "animate-flick-right",
        isFlicking === 'left' && "animate-flick-left",
        !isFlicking && "animate-appear"
      )}>
        <Card className="h-full w-full overflow-hidden shadow-2xl border-none">
          <div className="relative h-full w-full group">
            <Image
              src={currentRecipe.imageUrl || placeholderUrl}
              alt={currentRecipe.recipeName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              data-ai-hint="gourmet food"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <Badge className="mb-2 bg-primary hover:bg-primary border-none text-white px-3 py-1 text-xs tracking-widest font-bold uppercase">
                Gourmet Suggestion
              </Badge>
              <h2 className="text-3xl font-headline font-bold mb-2 leading-tight">
                {currentRecipe.recipeName}
              </h2>
              <p className="text-white/80 line-clamp-2 font-body text-sm mb-4 leading-relaxed italic">
                {currentRecipe.description}
              </p>
              
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20 px-0"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <Info className="h-5 w-5 mr-2" />
                  View Details
                </Button>
                <div className="flex gap-4">
                  <Button 
                    size="icon" 
                    className="rounded-full bg-secondary hover:bg-secondary/90 h-14 w-14 shadow-lg border-2 border-white/20"
                    onClick={() => handleFlick('left')}
                  >
                    <X className="h-8 w-8 text-white" />
                  </Button>
                  <Button 
                    size="icon" 
                    className="rounded-full bg-primary hover:bg-primary/90 h-14 w-14 shadow-lg border-2 border-white/20"
                    onClick={() => handleFlick('right')}
                    disabled={isAnalyzing}
                  >
                    <Heart className={cn("h-8 w-8 text-white", isAnalyzing && "animate-pulse")} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {showDetails && (
          <div className="absolute inset-0 z-10 bg-background/95 backdrop-blur-md p-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4" 
              onClick={() => setShowDetails(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <h3 className="text-2xl font-headline mb-4 text-primary">Ingredients</h3>
            <ul className="space-y-2 mb-6">
              {currentRecipe.ingredientsList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-primary font-bold mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="text-2xl font-headline mb-4 text-primary">Instructions</h3>
            <div className="space-y-4">
              {currentRecipe.instructions.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="text-secondary font-headline text-2xl font-bold opacity-30 italic">
                    {idx + 1}
                  </span>
                  <p className="text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-8 items-center text-muted-foreground">
        <div className="flex flex-col items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          <span className="text-[10px] uppercase font-bold tracking-tighter">Dismiss</span>
        </div>
        <div className="h-px w-24 bg-border" />
        <div className="flex flex-col items-center gap-1">
          <ChevronRight className="h-4 w-4" />
          <span className="text-[10px] uppercase font-bold tracking-tighter">Save</span>
        </div>
      </div>
    </div>
  );
}
