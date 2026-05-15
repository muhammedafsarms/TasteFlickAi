
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Loader2, MessageSquare, BookMarked, ChefHat, Clock } from "lucide-react";
import { chefChat } from "@/ai/flows/chef-chat-flow";
import { cn } from "@/lib/utils";
import { Recipe } from "@/lib/types";

type Message = {
  role: 'user' | 'model';
  content: string;
  recipe?: any;
};

interface ChefChatProps {
  onSaveRecipe?: (recipe: Recipe) => void;
}

export function ChefChat({ onSaveRecipe }: ChefChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const historyForBackend = messages.map(m => ({
        role: m.role === 'model' ? 'assistant' as const : 'user' as const,
        content: m.content
      }));

      const response = await chefChat({
        message: userMessage,
        history: historyForBackend
      });

      setMessages(prev => [...prev, { 
        role: 'model', 
        content: response.answer,
        recipe: response.recipe
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: `My apologies, the kitchen scrolls are slightly tangled. (Error: ${error.message})` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = (recipeData: any) => {
    if (!onSaveRecipe) return;
    
    const recipe: Recipe = {
      ...recipeData,
      id: Math.random().toString(36).substring(2, 11),
    };
    onSaveRecipe(recipe);
  };

  return (
    <div className="flex flex-col h-[75vh] gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-headline font-bold text-primary">Chef's Consulting Table</h2>
        <p className="text-muted-foreground font-body leading-relaxed">
          Ask for recipes, techniques, or substitutions. The Alchemist manifests your culinary desires.
        </p>
      </div>

      <Card className="flex-1 overflow-hidden border-none shadow-xl bg-white rounded-3xl flex flex-col">
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
          <ScrollArea ref={scrollRef} className="flex-1 p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-40 mt-12">
                <MessageSquare className="h-12 w-12 mb-4" />
                <p className="font-headline text-lg italic">"Chef, I have a kilo of basmati and no ideas..."</p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((m, i) => (
                  <div key={i} className={cn(
                    "flex gap-4 max-w-[90%]",
                    m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}>
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                      m.role === 'user' ? "bg-primary text-white" : "bg-secondary text-white"
                    )}>
                      {m.role === 'user' ? <User className="h-5 w-5" /> : <ChefHat className="h-5 w-5" />}
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className={cn(
                        "p-4 rounded-2xl text-sm leading-relaxed font-body shadow-sm whitespace-pre-wrap",
                        m.role === 'user' 
                          ? "bg-primary/5 text-foreground rounded-tr-none border border-primary/10" 
                          : "bg-muted/30 text-foreground rounded-tl-none border border-border/50"
                      )}>
                        {m.content}
                      </div>

                      {m.recipe && (
                        <Card className="border border-primary/20 bg-primary/5 rounded-2xl overflow-hidden shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-headline font-bold text-lg text-primary">{m.recipe.recipeName}</h4>
                                <div className="flex gap-3 mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {m.recipe.prepTime}</span>
                                  <span>•</span>
                                  <span>{m.recipe.difficulty}</span>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all h-8 px-3"
                                onClick={() => handleSaveRecipe(m.recipe)}
                              >
                                <BookMarked className="h-3.5 w-3.5 mr-2" />
                                Save to Vault
                              </Button>
                            </div>
                            <p className="text-xs italic text-muted-foreground line-clamp-2 mb-0">
                              {m.recipe.description}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 mr-auto animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-secondary" />
                    </div>
                    <div className="bg-muted/30 p-4 rounded-2xl rounded-tl-none border border-border/50 w-24">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t border-border bg-muted/10">
            <div className="flex gap-2 relative">
              <Input 
                placeholder="Ask the Alchemist for a detailed recipe..." 
                className="rounded-full h-12 pr-14 bg-white border-border focus-visible:ring-primary shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                size="icon" 
                className="absolute right-1 top-1 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-md"
                onClick={handleSend}
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
