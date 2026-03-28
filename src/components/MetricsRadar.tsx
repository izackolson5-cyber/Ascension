import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from "recharts";
import { AnalysisMetrics } from "@/src/lib/mockAnalysis";

interface MetricsRadarProps {
  metrics: AnalysisMetrics;
}

export function MetricsRadar({ metrics }: MetricsRadarProps) {
  const data = [
    { subject: "Symmetry", A: metrics.facialSymmetry },
    { subject: "Jawline", A: metrics.jawlineSharpness },
    { subject: "Chin Ratio", A: metrics.chinToThroatRatio },
    { subject: "Midface", A: metrics.midfaceProportions },
    { subject: "Skin", A: metrics.skinQuality },
    { subject: "Harmony", A: metrics.overallHarmony },
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 500 }}
          />
          <Radar
            name="Face Metrics"
            dataKey="A"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
