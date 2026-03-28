import { Crown, Dumbbell, Apple, Sparkles } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";

interface PremiumUpsellProps {
  onUpgrade: () => void;
}

export function PremiumUpsell({ onUpgrade }: PremiumUpsellProps) {
  return (
    <Card className="overflow-hidden border-none shadow-glow">
      <div className="gradient-primary p-6 text-primary-foreground">
        <div className="flex items-center space-x-2 mb-2">
          <Crown size={20} />
          <span className="font-bold uppercase tracking-wider text-xs">Ascension Pro</span>
        </div>
        <h3 className="text-xl font-bold">Unlock Personalized Plans</h3>
        <p className="text-sm opacity-90 mt-1">Get a custom 30-day routine based on your results.</p>
      </div>
      <div className="p-6 bg-card space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Dumbbell size={20} />
            </div>
            <span className="text-[10px] font-medium">Workouts</span>
          </div>
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Apple size={20} />
            </div>
            <span className="text-[10px] font-medium">Nutrition</span>
          </div>
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <span className="text-[10px] font-medium">Skincare</span>
          </div>
        </div>
        <Button onClick={onUpgrade} variant="gradient" className="w-full">
          Upgrade Now
        </Button>
        <p className="text-[10px] text-center text-muted-foreground">
          Unlimited analyses • Cancel anytime
        </p>
      </div>
    </Card>
  );
}
