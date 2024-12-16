import { pipeline } from "@huggingface/transformers";
import { toast } from "sonner";
import { AnalysisResult, TextClassificationOutput, extractSentiment } from "@/components/ai/analysis/types";

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

    const result = await classifier(token) as TextClassificationOutput;
    const sentiment = extractSentiment(result);

    return {
      symbol: token,
      sentiment: sentiment.score * 100,
      riskScore: Math.random() * 5,
      socialScore: Math.random() * 5,
      prediction: sentiment.score > 0.6 ? "Bullish 🚀" : "Bearish 🐻",
      confidence: sentiment.score * 100
    };
  } catch (error) {
    console.error(`Error analyzing token ${token}:`, error);
    toast.error(`Failed to analyze ${token}`);
    throw error;
  }
};