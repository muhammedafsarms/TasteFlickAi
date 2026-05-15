
"use client";

import { useState, useMemo } from "react";
import { Recipe } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, Clock, ChefHat, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { analyzeRecipeNutrition } from "@/ai/flows/analyze-recipe-nutrition-flow";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { getRecipeImageData } from "@/lib/image-utils";

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
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentRecipe = suggestions[currentIndex];

  const imageData = useMemo(() => {
    if (!currentRecipe) return null;
    return getRecipeImageData(currentRecipe.recipeName, currentRecipe.imageHint);
  }, [currentRecipe]);

  if (!currentRecipe || !imageData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <Star className="h-12 w-12 text-primary/40 mb-4" />
        <h3 className="text-2xl font-headline">No More Flavour Suggestions</h3>
        <p className="text-muted-foreground mt-2 max-w-xs font-body">
          Head back to the Pantry to conjure some fresh gourmet alchemy!
        </p>
      </div>
    );
  }

  const handleFlick = async (direction: 'left' | 'right') => {
    setIsFlicking(direction);
    
    setTimeout(async () => {
      if (direction === 'right') {
        setIsAnalyzing(true);
        try {
          const nutrition = await analyzeRecipeNutrition({
            recipeName: currentRecipe.recipeName,
            ingredients: currentRecipe.ingredientsList,
            instructions: currentRecipe.instructions
          });
          onSave({ ...currentRecipe, nutrition, imageUrl: imageData.url });
        } catch (e) {
          onSave({ ...currentRecipe, imageUrl: imageData.url });
        } finally {
          setIsAnalyzing(false);
        }
      } else {
        onDismiss(currentRecipe.id);
      }
      
      setCurrentIndex(prev => prev + 1);
      setIsFlicking(null);
      setShowDetails(false);
      setImageLoaded(false);
    }, 300);
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-[70vh] flex flex-col items-center justify-center overflow-hidden">
      <div className={cn(
        "relative w-full aspect-[3/4] transition-all duration-300 transform",
        isFlicking === 'right' && "animate-flick-right",
        isFlicking === 'left' && "animate-flick-left",
        !isFlicking && "animate-appear"
      )}>
        <Card className="h-full w-full overflow-hidden shadow-2xl border-none bg-black">
          <div className="relative h-full w-full group">
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 z-10 bg-muted/20 animate-pulse" />
            )}
            <Image
              src={imageData.url}
              alt={currentRecipe.recipeName}
              fill
              className={cn(
                "object-cover transition-all duration-700 group-hover:scale-110",
                imageLoaded ? "opacity-90" : "opacity-0"
              )}
              priority
              onLoad={() => setImageLoaded(true)}
              data-ai-hint={imageData.hint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-20">
              <Badge className="bg-primary/90 text-white backdrop-blur-md border-none px-3 py-1 uppercase tracking-widest text-[10px] font-bold">
                {currentRecipe.difficulty}
              </Badge>
              <Badge variant="secondary" className="bg-black/40 text-white backdrop-blur-md border-none flex gap-1.5 items-center">
                <Clock className="h-3 w-3" />
                {currentRecipe.cookTime}
              </Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
              <h2 className="text-4xl font-headline font-bold mb-3 leading-tight tracking-tight">
                {currentRecipe.recipeName}
              </h2>
              <p className="text-white/70 line-clamp-2 font-body text-base mb-6 leading-relaxed italic border-l-2 border-primary pl-4">
                {currentRecipe.description}
              </p>
              
              <div className="flex items-center justify-between gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10 px-4 h-12 rounded-full border border-white/20 backdrop-blur-sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <ChefHat className="h-5 w-5 mr-2" />
                  Method
                </Button>
                <div className="flex gap-4">
                  <Button 
                    size="icon" 
                    className="rounded-full bg-white/10 hover:bg-destructive/80 h-14 w-14 backdrop-blur-md border border-white/20 transition-colors"
                    onClick={() => handleFlick('left')}
                  >
                    <X className="h-8 w-8 text-white" />
                  </Button>
                  <Button 
                    size="icon" 
                    className="rounded-full bg-primary hover:bg-primary/90 h-14 w-14 shadow-lg shadow-primary/40 border-2 border-white/20 transition-all"
                    onClick={() => handleFlick('right')}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? <Loader2 className="h-8 w-8 text-white animate-spin" /> : <Heart className="h-8 w-8 text-white" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {showDetails && (
          <div className="absolute inset-0 z-30 bg-white p-8 overflow-y-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-headline text-primary font-bold">Culinary Secrets</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-accent" 
                onClick={() => setShowDetails(false)}
              >
                <X className="h-6 w-6 text-foreground" />
              </Button>
            </div>

            <div className="space-y-10">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                  <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">The Ingredients</h4>
                </div>
                <ul className="grid grid-cols-1 gap-3">
                  {currentRecipe.ingredientsList.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-sm p-3 rounded-xl bg-accent/30 border border-border/50 font-body">
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                  <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">The Process</h4>
                </div>
                <div className="space-y-8">
                  {currentRecipe.instructions.map((step, idx) => (
                    <div key={idx} className="flex gap-6">
                      <span className="text-5xl font-headline font-bold text-primary/10 italic leading-none shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-foreground/90 font-body">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="p-6 bg-primary/5 rounded-3xl border border-primary/20">
                <h4 className="font-headline text-xl mb-3 text-primary italic">Plating Like a Master</h4>
                <p className="text-sm italic leading-relaxed text-muted-foreground font-body">
                  {currentRecipe.platingSuggestions}
                </p>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
