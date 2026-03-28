import { motion } from "motion/react";
import { 
  Crown, 
  Moon, 
  Sun, 
  Shield, 
  Trash2, 
  Info, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePremium } from "@/src/hooks/usePremium";
import { STORAGE_KEYS } from "@/src/lib/mockAnalysis";
import { Card } from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
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
import { toast } from "sonner";

export default function SettingsPage() {
  const { isPremium, remainingFree } = usePremium();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.DARK_MODE) === "true";
  });
  const [storePhotos, setStorePhotos] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.PHOTO_CONSENT) === "true";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PHOTO_CONSENT, String(storePhotos));
  }, [storePhotos]);

  const handleClearData = () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    toast.success("All data cleared successfully");
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="min-h-screen pb-24">
      <main className="mx-auto max-w-md px-6 pt-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account & preferences</p>

        <div className="mt-8 space-y-6">
          {/* Plan Section */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Your Plan</h3>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Crown size={24} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold">{isPremium ? "Ascension Pro" : "Free Plan"}</h4>
                      {isPremium && <Badge className="bg-primary text-primary-foreground text-[10px] h-4 px-1">PRO</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isPremium ? "$9.99/mo subscription" : `${remainingFree} analysis remaining`}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  {isPremium ? "Manage" : "Upgrade"}
                </Button>
              </div>
            </Card>
          </section>

          {/* Preferences Section */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Preferences</h3>
            <Card className="divide-y">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-muted-foreground">
                    {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <span className="text-sm font-medium">Dark Mode</span>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-muted-foreground">
                    <Shield size={20} />
                  </div>
                  <span className="text-sm font-medium">Store Analysis Photos</span>
                </div>
                <Switch checked={storePhotos} onCheckedChange={setStorePhotos} />
              </div>
            </Card>
          </section>

          {/* Data Management */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Data & Privacy</h3>
            <Card className="divide-y">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex w-full items-center justify-between p-4 text-destructive hover:bg-destructive/5 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Trash2 size={20} />
                      <span className="text-sm font-medium">Clear All Data</span>
                    </div>
                    <ChevronRight size={16} className="opacity-50" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      analysis history and reset all preferences.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Card>
          </section>

          {/* About Section */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">About</h3>
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Info size={20} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Version</span>
                </div>
                <Badge variant="secondary" className="text-[10px]">v1.0.0</Badge>
              </div>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                Ascension AI uses advanced computer vision to provide aesthetic insights. 
                Ratings are objective and based on facial geometry. Not medical advice.
              </p>
              <div className="pt-2">
                <Button variant="link" className="p-0 h-auto text-xs text-primary flex items-center">
                  Terms of Service <ExternalLink size={12} className="ml-1" />
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
