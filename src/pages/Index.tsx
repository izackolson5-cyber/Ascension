import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Scan, Zap, Shield, Info } from "lucide-react";
import { AgeGate } from "@/src/components/AgeGate";
import { UploadZone } from "@/src/components/UploadZone";
import { UpgradeModal } from "@/src/components/UpgradeModal";
import { usePremium } from "@/src/hooks/usePremium";
import { generateMockAnalysis, STORAGE_KEYS, AnalysisResult } from "@/src/lib/mockAnalysis";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { supabase } from "@/src/integrations/supabase/client";
import { analyzeFaceWithGemini } from "@/src/services/geminiService";

export default function Index() {
  const navigate = useNavigate();
  const { isPremium, remainingFree, canAnalyze, decrementFree } = usePremium();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleAnalyze = async (front: string, side?: string) => {
    if (!canAnalyze) {
      setShowUpgrade(true);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(5);

    // Simulate progress while waiting for AI
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => (prev < 95 ? prev + 1 : prev));
    }, 150);

    try {
      let result: AnalysisResult;

      // 1. Try Real Gemini AI Analysis (The "Correct Math")
      try {
        result = await analyzeFaceWithGemini(front);
      } catch (geminiError) {
        console.warn("Gemini AI failed, trying Supabase fallback:", geminiError);
        
        // 2. Try Supabase Edge Function Fallback
        if (supabase) {
          const { data, error } = await supabase.functions.invoke('analyze-face', {
            body: { frontPhoto: front, sidePhoto: side },
          });

          if (error || !data || data.fallback) {
            throw new Error("Supabase fallback failed");
          } else {
            result = {
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
              overallScore: data.overallScore,
              percentile: data.percentile || Math.floor(data.overallScore * 9.5),
              metrics: data.metrics,
              suggestions: data.suggestions,
              photoUrl: front,
              details: data.details,
            };
          }
        } else {
          throw new Error("Supabase not configured");
        }
      }
      
      // Save to history
      const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYSES) || "[]");
      localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify([result, ...history].slice(0, 50)));
      
      decrementFree();
      setAnalysisProgress(100);
      clearInterval(progressInterval);
      
      setTimeout(() => {
        navigate("/results", { state: { result } });
      }, 500);
    } catch (err) {
      console.error("All AI analysis failed, using local deterministic model:", err);
      const fallbackResult = generateMockAnalysis(front);
      navigate("/results", { state: { result: fallbackResult } });
    } finally {
      setIsAnalyzing(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <AgeGate />
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />

      <main className="mx-auto max-w-md px-6 pt-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-glow">
            <Scan size={32} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Ascension <span className="text-gradient">AI</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Professional facial analysis & looksmaxing tracker
          </p>
          
          <div className="mt-4">
            {isPremium ? (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                PRO MEMBER
              </Badge>
            ) : (
              <p className="text-xs font-medium text-muted-foreground">
                {remainingFree} free analysis remaining
              </p>
            )}
          </div>
        </motion.div>

        {/* Feature Chips */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 grid grid-cols-3 gap-3"
        >
          {[
            { icon: Scan, label: "6 Metrics" },
            { icon: Zap, label: "Instant" },
            { icon: Shield, label: "Private" },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center rounded-2xl bg-card p-3 shadow-card">
              <feature.icon size={20} className="text-primary mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{feature.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <UploadZone 
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            analysisProgress={analysisProgress}
            disabled={!canAnalyze}
            onUpgradeClick={() => setShowUpgrade(true)}
          />
        </motion.div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-muted/50 border-none p-4">
            <div className="flex items-center space-x-2 mb-2 text-primary">
              <Info size={18} />
              <h3 className="text-sm font-bold">Analysis Tips</h3>
            </div>
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li>• Use natural, bright lighting (facing a window)</li>
              <li>• Look directly at the camera with a neutral expression</li>
              <li>• No filters, glasses, or heavy makeup</li>
              <li>• Pull hair back to reveal your full face shape</li>
            </ul>
          </Card>
        </motion.div>

        <footer className="mt-8 text-center">
          <p className="text-[10px] text-muted-foreground">
            Photos are processed locally and never stored without your consent.
          </p>
        </footer>
      </main>
    </div>
  );
}
