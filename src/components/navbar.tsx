
"use client";

import { Flame, BookOpen, ShoppingBasket, HandPlatter } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'flick', label: 'Flick', icon: Flame },
  { id: 'pantry', label: 'Pantry', icon: HandPlatter },
  { id: 'vault', label: 'Vault', icon: BookOpen },
  { id: 'grocery', label: 'Grocery', icon: ShoppingBasket },
];

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border px-4 py-2 flex justify-around items-center md:top-0 md:bottom-auto md:border-b md:border-t-0 md:px-12 md:py-4">
      <div className="hidden md:block">
        <h1 className="text-2xl font-headline font-bold text-primary">TasteFlick</h1>
      </div>
      <div className="flex w-full md:w-auto justify-around gap-2 md:gap-8">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-all duration-200",
              activeTab === item.id 
                ? "text-primary scale-110" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-[10px] uppercase tracking-widest font-bold md:text-xs">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
