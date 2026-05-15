"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { chefChat } from "@/ai/flows/chef-chat-flow";
import { cn } from "@/lib/utils";

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function ChefChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chefChat({
        message: userMessage,
        history: messages
      });

      setMessages(prev => [...prev, { role: 'model', content: response.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Forgive me, my culinary scrolls are a bit tangled. Please ask again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-headline font-bold text-primary">Chef's Consulting Table</h2>
        <p className="text-muted-foreground font-body leading-relaxed">
          Ask our Alchemist anything. From "What's a substitute for Tamarind?" to "How do I temper chocolate?"
        </p>
      </div>

      <Card className="flex-1 overflow-hidden border-none shadow-xl bg-white rounded-3xl flex flex-col">
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
          <ScrollArea ref={scrollRef} className="flex-1 p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-40 mt-12">
                <MessageSquare className="h-12 w-12 mb-4" />
                <p className="font-headline text-lg italic">Your culinary dialogue begins here...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((m, i) => (
                  <div key={i} className={cn(
                    "flex gap-4 max-w-[85%]",
                    m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}>
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                      m.role === 'user' ? "bg-primary/20" : "bg-secondary/10"
                    )}>
                      {m.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5 text-secondary" />}
                    </div>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed font-body shadow-sm",
                      m.role === 'user' 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted/50 text-foreground rounded-tl-none"
                    )}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 mr-auto animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-secondary" />
                    </div>
                    <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none">
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

          <div className="p-4 border-t border-border bg-muted/20">
            <div className="flex gap-2 relative">
              <Input 
                placeholder="Ask the Alchemist..." 
                className="rounded-full h-12 pr-14 bg-white border-border focus-visible:ring-primary"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                size="icon" 
                className="absolute right-1 top-1 h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
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
