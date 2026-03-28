import { motion, AnimatePresence } from "motion/react";
import { Crown, Check, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const handleUpgrade = () => {
    // In a real app, this would call the Supabase edge function
    window.open("https://stripe.com", "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md rounded-t-[2.5rem] bg-card p-8 shadow-2xl sm:rounded-[2.5rem]"
          >
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 rounded-full bg-muted p-2 text-muted-foreground hover:bg-muted/80"
            >
              <X size={20} />
            </button>

            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-glow">
                <Crown size={32} />
              </div>
              <h2 className="text-2xl font-bold">Ascension Pro</h2>
              <p className="text-muted-foreground">Unlock your full aesthetic potential</p>
            </div>

            <div className="mb-8 space-y-4">
              {[
                "Unlimited facial analyses",
                "Personalized 30-day looksmaxing plans",
                "Advanced AI-powered symmetry insights",
                "Progress tracking & trend analysis",
              ].map((feature, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Button 
                disabled
                variant="outline" 
                size="xl" 
                className="w-full border-primary/20 text-muted-foreground"
              >
                Pro Plan — Coming Soon
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                We're currently refining our premium features. Stay tuned!
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
