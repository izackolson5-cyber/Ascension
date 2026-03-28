import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "@/src/lib/mockAnalysis";

const TEST_MODE = false;

export function usePremium() {
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    if (TEST_MODE) return true;
    return localStorage.getItem(STORAGE_KEYS.IS_PREMIUM) === "true";
  });

  const [remainingFree, setRemainingFree] = useState<number>(() => {
    if (TEST_MODE) return 999;
    const stored = localStorage.getItem(STORAGE_KEYS.FREE_ANALYSES);
    return stored ? parseInt(stored, 10) : 1;
  });

  useEffect(() => {
    if (!TEST_MODE) {
      localStorage.setItem(STORAGE_KEYS.IS_PREMIUM, String(isPremium));
    }
  }, [isPremium]);

  useEffect(() => {
    if (!TEST_MODE) {
      localStorage.setItem(STORAGE_KEYS.FREE_ANALYSES, String(remainingFree));
    }
  }, [remainingFree]);

  const decrementFree = () => {
    if (TEST_MODE) return;
    setRemainingFree((prev) => Math.max(0, prev - 1));
  };

  const setPremium = (value: boolean) => {
    setIsPremium(value);
  };

  const canAnalyze = isPremium || remainingFree > 0;

  return {
    isPremium,
    remainingFree,
    canAnalyze,
    decrementFree,
    setPremium,
  };
}
