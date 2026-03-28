export interface AnalysisMetrics {
  facialSymmetry: number;      // 1.0-10.0
  jawlineSharpness: number;    // 1.0-10.0
  chinToThroatRatio: number;   // 1.0-10.0
  midfaceProportions: number;  // 1.0-10.0
  skinQuality: number;         // 1.0-10.0
  overallHarmony: number;      // 1.0-10.0
}

export interface AnalysisResult {
  id: string;           // crypto.randomUUID()
  timestamp: string;    // ISO string
  overallScore: number; // average of 6 metrics, 1 decimal
  percentile: number;   // 1-99
  tierLabel?: string;   // e.g. "Chadlite", "High-Tier Normie"
  tierDescription?: string; // Short description of the tier
  metrics: AnalysisMetrics;
  suggestions: string[];  // 0-4 items
  photoUrl: string;       // base64 data URL
  details?: {
    symmetryIndex: number; // 0-100%
    phiRatio: number;      // e.g. 1.58 (ideal 1.618)
    canthalTilt: "Positive" | "Neutral" | "Negative";
    gonialAngle: number;   // degrees
    midfaceRatio: number;  // ideal is 1.0
    intercanthalIndex: number; // ideal ~33-35%
    lowerThirdRatio: number;   // ideal ~33%
    nasolabialAngle: number;   // degrees (90-105)
    fWHR: number;              // Facial Height-to-Width Ratio
    bigonialRatio: number;     // Jaw width vs Cheekbone width
    upperEyelidExposure: "Low" | "Medium" | "High";
    philtrumLength: number;    // mm (simulated)
    ramusLength: number;       // mm (simulated)
    chinToPhiltrumRatio: number; // ideal ~2.0
  };
}

export const SCORE_LABELS = [
  { min: 9, label: "Elite", color: "text-score-excellent" },
  { min: 8, label: "Excellent", color: "text-score-excellent" },
  { min: 7, label: "Above Average", color: "text-score-good" },
  { min: 6, label: "Average", color: "text-score-good" },
  { min: 5, label: "Below Average", color: "text-score-average" },
  { min: 0, label: "Needs Improvement", color: "text-score-below" },
];

export function getScoreInfo(score: number) {
  return SCORE_LABELS.find((l) => score >= l.min) || SCORE_LABELS[SCORE_LABELS.length - 1];
}

const SUGGESTION_POOL = [
  "Focus on jawline exercises to improve definition.",
  "Maintain a consistent skincare routine for better texture.",
  "Consider a new hairstyle that complements your face shape.",
  "Improve your posture to enhance your chin-to-throat ratio.",
  "Stay hydrated to improve overall skin glow.",
  "Try facial yoga to improve symmetry over time.",
  "Use a high-quality moisturizer to even out skin tone.",
  "Focus on tongue posture (mewing) for better jaw definition.",
  "Get adequate sleep to reduce under-eye puffiness.",
  "Consider grooming your eyebrows for better facial harmony."
];

// Simple hash function to generate a seed from a string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Deterministic random-like value from a seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function getTierInfo(score: number) {
  if (score >= 9.0) return { label: "GigaChad / Model Tier", description: "Elite-tier aesthetics. Near-perfect facial harmony and bone structure." };
  if (score >= 8.0) return { label: "True Chad", description: "Top 1% aesthetics. Exceptional masculine features and striking presence." };
  if (score >= 6.5) return { label: "Chadlite", description: "Highly attractive with strong bone structure. Minor deviations from elite perfection." };
  if (score >= 5.5) return { label: "High-Tier Normie", description: "Above average attractiveness. Good features but lacks striking elite structure." };
  if (score >= 4.5) return { label: "True Normie", description: "Average human aesthetics. No major flaws, but lacks standout 'halo' traits." };
  if (score >= 3.0) return { label: "Sub-Five", description: "Below average. Significant facial asymmetries or suboptimal proportions." };
  return { label: "Needs Improvement", description: "Major aesthetic flaws or severe asymmetries detected." };
}

export function generateMockAnalysis(photoUrl: string): AnalysisResult {
  const seed = hashString(photoUrl);
  let currentSeed = seed;

  const nextRandom = () => {
    const val = seededRandom(currentSeed);
    currentSeed += 1;
    return val;
  };

  // Calibrate base score: 5.5 to 9.5 range for a more realistic "looksmaxing" distribution
  const baseScore = 5.5 + nextRandom() * 4;
  const metrics: AnalysisMetrics = {
    facialSymmetry: Math.min(10, Math.max(1, baseScore + (nextRandom() * 2 - 1))),
    jawlineSharpness: Math.min(10, Math.max(1, baseScore + (nextRandom() * 2 - 1))),
    chinToThroatRatio: Math.min(10, Math.max(1, baseScore + (nextRandom() * 2 - 1))),
    midfaceProportions: Math.min(10, Math.max(1, baseScore + (nextRandom() * 2 - 1))),
    skinQuality: Math.min(10, Math.max(1, baseScore + (nextRandom() * 2 - 1))),
    overallHarmony: Math.min(10, Math.max(1, baseScore + (nextRandom() * 2 - 1))),
  };

  const scores = Object.values(metrics);
  const overallScore = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));
  const percentile = Math.floor(overallScore * 9.5);

  const suggestions = SUGGESTION_POOL
    .map((s) => ({ s, sort: nextRandom() }))
    .sort((a, b) => a.sort - b.sort)
    .map((x) => x.s)
    .slice(0, Math.floor(nextRandom() * 3) + 1);

  // Simulated scientific "math" details
  const details = {
    symmetryIndex: Math.floor(75 + nextRandom() * 20),
    phiRatio: Number((1.5 + nextRandom() * 0.2).toFixed(2)),
    canthalTilt: (["Positive", "Neutral", "Negative"] as const)[Math.floor(nextRandom() * 3)],
    gonialAngle: Math.floor(115 + nextRandom() * 25),
    midfaceRatio: Number((0.9 + nextRandom() * 0.3).toFixed(2)),
    intercanthalIndex: Number((31 + nextRandom() * 8).toFixed(1)),
    lowerThirdRatio: Number((30 + nextRandom() * 10).toFixed(1)),
    nasolabialAngle: Math.floor(85 + nextRandom() * 30),
    fWHR: Number((1.6 + nextRandom() * 0.6).toFixed(2)),
    bigonialRatio: Number((0.7 + nextRandom() * 0.3).toFixed(2)),
    upperEyelidExposure: (["Low", "Medium", "High"] as const)[Math.floor(nextRandom() * 3)],
    philtrumLength: Number((10 + nextRandom() * 10).toFixed(1)),
    ramusLength: Number((40 + nextRandom() * 20).toFixed(1)),
    chinToPhiltrumRatio: Number((1.5 + nextRandom() * 1.0).toFixed(2)),
  };

  const tierInfo = getTierInfo(overallScore);

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    overallScore,
    percentile,
    tierLabel: tierInfo.label,
    tierDescription: tierInfo.description,
    metrics,
    suggestions,
    photoUrl,
    details,
  };
}

export const STORAGE_KEYS = {
  AGE_VERIFIED: "ascension-ai-age-verified",
  ANALYSES: "ascension-ai-analyses",
  FREE_ANALYSES: "ascension-free-analyses",
  IS_PREMIUM: "ascension-is-premium",
  DARK_MODE: "ascension-dark-mode",
  PHOTO_CONSENT: "ascension-photo-consent",
};
