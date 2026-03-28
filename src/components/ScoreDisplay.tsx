import { motion } from "motion/react";
import { getScoreInfo } from "@/src/lib/mockAnalysis";
import { cn } from "@/src/lib/utils";

interface ScoreDisplayProps {
  score: number;
  percentile: number;
}

export function ScoreDisplay({ score, percentile }: ScoreDisplayProps) {
  const scoreInfo = getScoreInfo(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120" className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="hsl(var(--secondary))"
            strokeWidth="8"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            className={cn("transition-colors duration-500", scoreInfo.color)}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-baseline"
          >
            <span className="text-4xl font-bold font-display">{score.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground ml-0.5">/10</span>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-4 text-center"
      >
        <h3 className={cn("text-xl font-bold uppercase tracking-wider", scoreInfo.color)}>
          {scoreInfo.label}
        </h3>
        <p className="text-sm text-muted-foreground">
          Top {100 - percentile}% of users
        </p>
      </motion.div>
    </div>
  );
}
