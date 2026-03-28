import { motion } from "motion/react";
import { Lightbulb } from "lucide-react";
import { Card } from "@/src/components/ui/card";

interface SuggestionsProps {
  suggestions: string[];
}

export function Suggestions({ suggestions }: SuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Improvement Plan</h3>
      <div className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.15 }}
          >
            <Card className="flex items-start space-x-4 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Lightbulb size={18} />
              </div>
              <p className="text-sm leading-relaxed">{suggestion}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
