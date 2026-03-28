import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Index from "@/src/pages/Index";
import Results from "@/src/pages/Results";
import Progress from "@/src/pages/Progress";
import SettingsPage from "@/src/pages/SettingsPage";
import NotFound from "@/src/pages/NotFound";
import { BottomNav } from "@/src/components/BottomNav";
import { useEffect } from "react";
import { STORAGE_KEYS } from "@/src/lib/mockAnalysis";

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    // Initialize dark mode
    const isDark = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === "true";
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/results" element={<Results />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
            <Toaster position="top-center" expand={false} richColors />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
