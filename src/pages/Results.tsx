import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Share2, Sparkles, Upload, Info } from "lucide-react";
import { ScoreDisplay } from "@/src/components/ScoreDisplay";
import { MetricsRadar } from "@/src/components/MetricsRadar";
import { Suggestions } from "@/src/components/Suggestions";
import { PremiumUpsell } from "@/src/components/PremiumUpsell";
import { Button } from "@/src/components/ui/button";
import { Progress } from "@/src/components/ui/progress";
import { Card } from "@/src/components/ui/card";
import { usePremium } from "@/src/hooks/usePremium";
import { AnalysisResult } from "@/src/lib/mockAnalysis";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UpgradeModal } from "@/src/components/UpgradeModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isPremium, setPremium } = usePremium();
  const [showUpgrade, setShowUpgrade] = useState(false);
  
  const result: AnalysisResult | null = location.state?.result;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("premium") === "success") {
      setPremium(true);
      toast.success("Welcome to Ascension Pro!");
    }
  }, [location.search, setPremium]);

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold">No results found</h2>
        <p className="text-muted-foreground mt-2 mb-6">Please scan your face first.</p>
        <Button onClick={() => navigate("/")} variant="gradient">Go to Scan</Button>
      </div>
    );
  }

  const metricLabels: Record<string, string> = {
    facialSymmetry: "Facial Symmetry",
    jawlineSharpness: "Jawline Sharpness",
    chinToThroatRatio: "Chin-to-Throat",
    midfaceProportions: "Midface Proportions",
    skinQuality: "Skin Quality",
    overallHarmony: "Overall Harmony",
  };

  const geometricDescriptions: Record<string, string> = {
    symmetryIndex: "Measures bilateral balance between the left and right sides of the face.",
    phiRatio: "Compares facial proportions to the Golden Ratio (1.618) for ideal harmony.",
    canthalTilt: "The angle between the inner and outer corners of the eyes.",
    gonialAngle: "The angle of the jawline; ideal for men is typically 120-130°.",
    midfaceRatio: "The vertical proportion of the middle third of the face.",
    intercanthalIndex: "Ratio of the distance between eyes to total eye width.",
    lowerThirdRatio: "Proportion of the lower face relative to total face height.",
    nasolabialAngle: "Angle between the nose and upper lip; affects profile sharpness.",
    fWHR: "Facial Height-to-Width Ratio; a key metric for perceived dominance.",
    bigonialRatio: "Ratio of jaw width to cheekbone width.",
    upperEyelidExposure: "The amount of eyelid visible; minimal exposure is ideal for 'Hunter Eyes'.",
    philtrumLength: "The vertical distance between the nose and the upper lip.",
    ramusLength: "The vertical part of the jawbone; longer is generally more masculine.",
    chinToPhiltrumRatio: "Ratio of chin height to philtrum length; ideal is typically 2:1.",
  };

  return (
    <div className="min-h-screen pb-24">
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
      
      <TooltipProvider>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between bg-background/80 px-6 py-4 backdrop-blur-md">
          <button onClick={() => navigate("/")} className="p-2 -ml-2 rounded-full hover:bg-muted">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold">Your Results</h1>
          <button className="p-2 -mr-2 rounded-full hover:bg-muted">
            <Share2 size={20} />
          </button>
        </header>

        <main className="mx-auto max-w-md px-6 space-y-8 pt-4">
          {/* Score Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Card className="p-8 flex flex-col items-center space-y-6">
              <ScoreDisplay score={result.overallScore} percentile={result.percentile} />
              
              {result.tierLabel && (
                <div className="w-full text-center space-y-2 pt-4 border-t border-muted">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={12} />
                    {result.tierLabel}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed px-4">
                    {result.tierDescription}
                  </p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Radar Chart Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Metric Breakdown</h3>
              <MetricsRadar metrics={result.metrics} />
              
              <div className="mt-8 space-y-5">
                {Object.entries(result.metrics).map(([key, value], i) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="text-muted-foreground">{metricLabels[key]}</span>
                      <span>{value.toFixed(1)}</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                    >
                      <Progress value={value * 10} className="h-1.5" />
                    </motion.div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Suggestions */}
          <Suggestions suggestions={result.suggestions} />

          {/* Geometric Analysis Details */}
          {result.details && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-primary" size={20} />
                  <h3 className="text-lg font-bold">Geometric Analysis</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(result.details).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <Tooltip>
                          <TooltipTrigger className="text-muted-foreground/50 hover:text-primary transition-colors">
                            <Info size={10} />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px] text-[10px]">
                            {geometricDescriptions[key]}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className={`text-xl font-mono ${key === 'canthalTilt' ? (value === 'Positive' ? 'text-score-excellent' : value === 'Negative' ? 'text-score-below' : '') : ''}`}>
                        {typeof value === 'number' ? (
                          key === 'phiRatio' || key === 'fWHR' || key === 'bigonialRatio' || key === 'midfaceRatio' || key === 'chinToPhiltrumRatio'
                            ? value.toFixed(2) 
                            : (key === 'gonialAngle' || key === 'nasolabialAngle' ? `${value}°` : (key === 'philtrumLength' || key === 'ramusLength' ? `${value}mm` : `${value}%`))
                        ) : value}
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-[11px] text-muted-foreground leading-relaxed italic border-t pt-4">
                  * Analysis based on facial landmark detection and anthropometric measurements.
                </p>
              </Card>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {isPremium ? (
              <Button variant="gradient" size="xl" className="w-full">
                <Sparkles size={18} className="mr-2" />
                Generate My 30-Day Plan
              </Button>
            ) : (
              <PremiumUpsell onUpgrade={() => setShowUpgrade(true)} />
            )}
            
            <Button 
              onClick={() => navigate("/")} 
              variant="outline" 
              size="xl" 
              className="w-full border-primary text-primary hover:bg-primary/5"
            >
              <Upload size={18} className="mr-2" />
              Upload New Photo
            </Button>
          </div>
        </main>
      </TooltipProvider>
    </div>
  );
}
