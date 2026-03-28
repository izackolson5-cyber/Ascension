import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { STORAGE_KEYS } from "@/src/lib/mockAnalysis";

export function AgeGate() {
  const [isVisible, setIsVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem(STORAGE_KEYS.AGE_VERIFIED);
    if (!verified) {
      setIsVisible(true);
    }
  }, []);

  const handleContinue = () => {
    if (isChecked) {
      localStorage.setItem(STORAGE_KEYS.AGE_VERIFIED, "true");
      setIsVisible(false);
    }
  };

  const handleUnder18 = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-3xl bg-card p-8 text-center shadow-2xl"
          >
            <div className="mb-6 flex justify-center">
              <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                <ShieldCheck size={48} />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold">Age Verification</h2>
            <p className="mb-8 text-muted-foreground">
              Ascension AI is designed for adults. Please verify your age to continue.
            </p>
            
            <div className="mb-8 flex items-start space-x-3 text-left">
              <Checkbox 
                id="age-check" 
                checked={isChecked} 
                onCheckedChange={(checked) => setIsChecked(checked === true)}
                className="mt-1"
              />
              <label 
                htmlFor="age-check" 
                className="text-sm font-medium leading-tight cursor-pointer"
              >
                I am 18 years or older and agree to the Terms of Service.
              </label>
            </div>

            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleContinue} 
                disabled={!isChecked}
                variant="gradient"
                size="xl"
                className="w-full"
              >
                Continue
              </Button>
              <Button 
                onClick={handleUnder18} 
                variant="ghost"
                className="text-muted-foreground"
              >
                I am under 18
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
