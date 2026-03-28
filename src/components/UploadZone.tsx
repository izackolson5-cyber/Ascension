import * as React from "react";
import { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Upload, X, Lock } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

interface UploadZoneProps {
  onAnalyze: (front: string, side?: string) => void;
  isAnalyzing: boolean;
  analysisProgress: number;
  disabled: boolean;
  onUpgradeClick: () => void;
}

export function UploadZone({ 
  onAnalyze, 
  isAnalyzing, 
  analysisProgress, 
  disabled, 
  onUpgradeClick 
}: UploadZoneProps) {
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [sidePhoto, setSidePhoto] = useState<string | null>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'side') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Max 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'front') setFrontPhoto(base64);
        else setSidePhoto(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (frontPhoto) {
      onAnalyze(frontPhoto, sidePhoto || undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {/* Front Photo */}
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center">
            Front Photo <span className="text-destructive ml-1">*</span>
          </label>
          <div 
            onClick={() => !frontPhoto && frontInputRef.current?.click()}
            className={cn(
              "relative h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden",
              frontPhoto ? "border-primary/50 bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"
            )}
            role="region"
            aria-label="Front photo upload"
          >
            {frontPhoto ? (
              <>
                <img src={frontPhoto} alt="Front" className="h-full w-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setFrontPhoto(null); }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white backdrop-blur-md"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                  <Camera size={24} />
                </div>
                <span className="text-sm font-medium">Upload Front Profile</span>
                <span className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</span>
              </>
            )}
            <input 
              type="file" 
              ref={frontInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => handleFileChange(e, 'front')} 
            />
          </div>
        </div>

        {/* Side Photo */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Side Profile (Optional)</label>
          <div 
            onClick={() => !sidePhoto && sideInputRef.current?.click()}
            className={cn(
              "relative h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden",
              sidePhoto ? "border-primary/50 bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"
            )}
            role="region"
            aria-label="Side photo upload"
          >
            {sidePhoto ? (
              <>
                <img src={sidePhoto} alt="Side" className="h-full w-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setSidePhoto(null); }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white backdrop-blur-md"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <div className="p-2 rounded-full bg-muted text-muted-foreground mb-1">
                  <ImageIcon size={20} />
                </div>
                <span className="text-xs font-medium">Upload Side Profile</span>
              </>
            )}
            <input 
              type="file" 
              ref={sideInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => handleFileChange(e, 'side')} 
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        {disabled ? (
          <Button 
            onClick={onUpgradeClick}
            variant="outline" 
            size="xl" 
            className="w-full border-primary text-primary hover:bg-primary/5"
          >
            <Lock size={18} className="mr-2" />
            Upgrade to Analyze
          </Button>
        ) : (
          <Button 
            onClick={handleAnalyze}
            disabled={!frontPhoto || isAnalyzing}
            variant="gradient" 
            size="xl" 
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Upload size={18} className="mr-2 animate-spin" />
                Analyzing... {analysisProgress}%
              </>
            ) : (
              "Analyze My Face"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
