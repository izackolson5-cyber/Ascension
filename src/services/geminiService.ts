import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AnalysisMetrics } from "@/src/lib/mockAnalysis";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeFaceWithGemini(photoUrl: string): Promise<AnalysisResult> {
  const model = "gemini-3.1-pro-preview";
  
  // Extract base64 data and mime type
  const [header, base64Data] = photoUrl.split(",");
  const mimeType = header.match(/:(.*?);/)?.[1] || "image/jpeg";

  const prompt = `
    You are a world-class expert in facial aesthetics, anthropometry, and facial geometry, specializing in "looksmaxing" analysis.
    Analyze the provided photo with extreme precision. Calculate the following metrics based on facial landmarks, proportions, and geometric angles.
    
    SCALING GUIDELINES:
    - 9.0-10.0 (GigaChad / Model Tier): Elite-tier aesthetics. Near-perfect facial harmony and bone structure.
    - 8.0-8.9 (True Chad): Top 1% aesthetics. Exceptional masculine features and striking presence.
    - 6.5-7.9 (Chadlite): Highly attractive with strong bone structure. Minor deviations from elite perfection.
    - 5.5-6.4 (High-Tier Normie): Above average attractiveness. Good features but lacks striking elite structure.
    - 4.5-5.4 (True Normie): Average human aesthetics. No major flaws, but lacks standout 'halo' traits.
    - 3.0-4.4 (Sub-Five): Below average. Significant facial asymmetries or suboptimal proportions.
    - Below 3.0 (Needs Improvement): Major aesthetic flaws or severe asymmetries detected.
    
    Return a JSON object with the following structure:
    {
      "overallScore": number (1.0-10.0, e.g. 9.2),
      "tierLabel": string (e.g. "Chadlite"),
      "tierDescription": string (A brief, scientific explanation of why they fit this tier),
      "metrics": {
        "facialSymmetry": number (1.0-10.0),
        "jawlineSharpness": number (1.0-10.0),
        "chinToThroatRatio": number (1.0-10.0),
        "midfaceProportions": number (1.0-10.0),
        "skinQuality": number (1.0-10.0),
        "overallHarmony": number (1.0-10.0)
      },
      "details": {
        "symmetryIndex": number (0-100),
        "phiRatio": number (e.g. 1.61),
        "canthalTilt": "Positive" | "Neutral" | "Negative",
        "gonialAngle": number (degrees, e.g. 123),
        "midfaceRatio": number (e.g. 1.0),
        "intercanthalIndex": number (percentage, e.g. 34.5),
        "lowerThirdRatio": number (percentage, e.g. 33.3),
        "nasolabialAngle": number (degrees, e.g. 102),
        "fWHR": number (ratio, e.g. 1.92),
        "bigonialRatio": number (ratio, e.g. 0.9),
        "upperEyelidExposure": "Low" | "Medium" | "High",
        "philtrumLength": number (mm, e.g. 15.2),
        "ramusLength": number (mm, e.g. 52.5),
        "chinToPhiltrumRatio": number (ratio, ideal ~2.0, e.g. 2.1)
      },
      "suggestions": string[] (3-4 actionable looksmaxing tips based on the analysis)
    }
    
    Be objective, scientific, and critical. Do not be overly generous, but recognize true elite-tier aesthetics (like the provided image of Brad Pitt).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { data: base64Data, mimeType } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            tierLabel: { type: Type.STRING },
            tierDescription: { type: Type.STRING },
            metrics: {
              type: Type.OBJECT,
              properties: {
                facialSymmetry: { type: Type.NUMBER },
                jawlineSharpness: { type: Type.NUMBER },
                chinToThroatRatio: { type: Type.NUMBER },
                midfaceProportions: { type: Type.NUMBER },
                skinQuality: { type: Type.NUMBER },
                overallHarmony: { type: Type.NUMBER }
              }
            },
            details: {
              type: Type.OBJECT,
              properties: {
                symmetryIndex: { type: Type.NUMBER },
                phiRatio: { type: Type.NUMBER },
                canthalTilt: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"] },
                gonialAngle: { type: Type.NUMBER },
                midfaceRatio: { type: Type.NUMBER },
                intercanthalIndex: { type: Type.NUMBER },
                lowerThirdRatio: { type: Type.NUMBER },
                nasolabialAngle: { type: Type.NUMBER },
                fWHR: { type: Type.NUMBER },
                bigonialRatio: { type: Type.NUMBER },
                upperEyelidExposure: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                philtrumLength: { type: Type.NUMBER },
                ramusLength: { type: Type.NUMBER },
                chinToPhiltrumRatio: { type: Type.NUMBER }
              }
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["overallScore", "tierLabel", "tierDescription", "metrics", "details", "suggestions"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    return {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      overallScore: data.overallScore,
      percentile: Math.floor(data.overallScore * 9.5),
      tierLabel: data.tierLabel,
      tierDescription: data.tierDescription,
      metrics: data.metrics,
      suggestions: data.suggestions,
      photoUrl,
      details: data.details
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
}
