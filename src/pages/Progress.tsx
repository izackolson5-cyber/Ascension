import { motion } from "motion/react";
import { TrendingUp, Trash2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { AnalysisResult, STORAGE_KEYS, getScoreInfo } from "@/src/lib/mockAnalysis";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";

export default function Progress() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ANALYSES);
    if (stored) {
      setAnalyses(JSON.parse(stored));
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = analyses.filter((a) => a.id !== id);
    setAnalyses(updated);
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(updated));
  };

  const chartData = [...analyses]
    .reverse()
    .map((a) => ({
      date: new Date(a.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: a.overallScore,
    }));

  return (
    <div className="min-h-screen pb-24">
      <main className="mx-auto max-w-md px-6 pt-8">
        <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
        <p className="text-muted-foreground mt-1">Track your aesthetic evolution</p>

        {analyses.length === 0 ? (
          <div className="mt-20 flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-muted p-6 text-muted-foreground">
              <TrendingUp size={48} />
            </div>
            <h3 className="text-lg font-bold">No analyses yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Start your first scan to see your progress chart.
            </p>
            <Button onClick={() => navigate("/")} variant="gradient">Start Scan</Button>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {/* Trend Chart */}
            {analyses.length >= 2 && (
              <Card className="p-4">
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">Score Trend</h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis 
                        domain={[0, 10]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          borderColor: "hsl(var(--border))",
                          borderRadius: "12px",
                          fontSize: "12px"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3} 
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Gallery */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Past Analyses</h3>
              <div className="grid grid-cols-2 gap-4">
                {analyses.map((analysis, i) => {
                  const scoreInfo = getScoreInfo(analysis.overallScore);
                  return (
                    <motion.div
                      key={analysis.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="group relative overflow-hidden">
                        <div 
                          className="aspect-[3/4] cursor-pointer overflow-hidden"
                          onClick={() => navigate("/results", { state: { result: analysis } })}
                        >
                          <img 
                            src={analysis.photoUrl} 
                            alt="Analysis" 
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                            <div>
                              <p className="text-[10px] text-white/70">
                                {new Date(analysis.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </p>
                              <p className={`text-lg font-bold font-display ${scoreInfo.color}`}>
                                {analysis.overallScore.toFixed(1)}
                              </p>
                            </div>
                            <ChevronRight size={16} className="text-white/50" />
                          </div>
                        </div>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={14} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Analysis?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove this analysis from your history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(analysis.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
