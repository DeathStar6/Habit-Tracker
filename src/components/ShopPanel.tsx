"use client";

import { useHabits } from "../context/HabitContext";
import { Store, Coins, Lock } from "lucide-react";
import { cn } from "../lib/utils";

const SHOP_ITEMS = [
  { id: "👨‍🚀", name: "Astronaut", cost: 0 },
  { id: "🧙‍♂️", name: "Wizard", cost: 50 },
  { id: "🥷", name: "Ninja", cost: 100 },
  { id: "🧚", name: "Fairy", cost: 150 },
  { id: "🦸‍♂️", name: "Hero", cost: 200 },
  { id: "👑", name: "King", cost: 500 },
  { id: "🦊", name: "Fox", cost: 750 },
  { id: "🐉", name: "Dragon", cost: 1000 },
];

export default function ShopPanel() {
  const { coins, unlockedAvatars, activeAvatar, purchaseItem, equipAvatar } = useHabits();

  const handleAction = (item: typeof SHOP_ITEMS[0]) => {
    if (unlockedAvatars?.includes(item.id)) {
      if (activeAvatar !== item.id) {
        equipAvatar(item.id);
      }
    } else {
      if (coins >= item.cost) {
        purchaseItem(item.cost, item.id);
      }
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border flex flex-col gap-4 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Store className="text-primary" /> Avatar Shop
        </h2>
        <div className="flex items-center gap-1 font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full text-sm">
          <Coins size={16} />
          <span>{coins} Coins</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {SHOP_ITEMS.map((item) => {
          const isUnlocked = unlockedAvatars?.includes(item.id);
          const isEquipped = activeAvatar === item.id;
          const canAfford = coins >= item.cost;

          return (
            <button
              key={item.id}
              onClick={() => handleAction(item)}
              disabled={!isUnlocked && !canAfford}
              className={cn(
                "relative flex flex-col items-center p-3 rounded-xl border-2 transition-all overflow-hidden",
                isEquipped ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 bg-secondary/30",
                !isUnlocked && !canAfford && "opacity-50 cursor-not-allowed hover:border-border"
              )}
            >
              <div className="text-3xl mb-1">{item.id}</div>
              
              {!isUnlocked ? (
                <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 dark:text-yellow-500">
                  <Coins size={10} /> {item.cost}
                </div>
              ) : isEquipped ? (
                <div className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                  Active
                </div>
              ) : (
                <div className="text-[10px] uppercase font-bold text-muted-foreground">
                  Equip
                </div>
              )}
              
              {!isUnlocked && !canAfford && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <Lock size={24} className="text-muted-foreground drop-shadow-md" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
