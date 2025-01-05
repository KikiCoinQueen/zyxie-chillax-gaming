import { pipeline } from "@huggingface/transformers";
import { toast } from "sonner";

export interface AnalysisResult {
  symbol: string;
  sentiment: number;
  riskScore: number;
  socialScore: number;
  prediction: string;
  confidence: number;
}

export interface TextClassificationOutput {
  label: string;
  score: number;
}

let classifier: any = null;

export const initializeAnalyzer = async () => {
  try {
    classifier = await pipeline(
      "text-classification",
      "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
      { device: "webgpu" }
    );
    return true;
  } catch (error) {
    console.error("Failed to initialize analyzer:", error);
    toast.error("Failed to initialize AI model");
    return false;
  }
};

export const analyzeToken = async (token: string): Promise<AnalysisResult> => {
  try {
    if (!classifier) {
      const initialized = await initializeAnalyzer();
      if (!initialized) {
        throw new Error("Analyzer not initialized");
      }
    }

    const result = await classifier(token) as TextClassificationOutput[];
    const sentiment = result[0].score;

    // Generate pseudo-random but consistent scores based on the token string
    const hash = token.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const normalizedHash = (hash % 100) / 100;

    return {
      symbol: token,
      sentiment: sentiment * 100,
      riskScore: 2.5 + (normalizedHash * 2.5), // Scale from 2.5 to 5
      socialScore: 1 + (normalizedHash * 4), // Scale from 1 to 5
      prediction: sentiment > 0.6 ? "Bullish 🚀" : "Bearish 🐻",
      confidence: sentiment * 100
    };
  } catch (error) {
    console.error(`Error analyzing token ${token}:`, error);
    toast.error(`Failed to analyze ${token}`);
    throw error;
  }
};