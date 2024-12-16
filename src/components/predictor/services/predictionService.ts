import { pipeline } from "@huggingface/transformers";
import { Prediction, TextClassificationOutput, extractSentiment } from "../types/prediction";
import { toast } from "sonner";

export async function generatePrediction(token: any): Promise<Prediction> {
  try {
    const classifier = await pipeline(
      "text-classification",
      "onnx-community/distilbert-base-uncased-finetuned-sst-2-english",
      { device: "webgpu" }
    );

    const text = `${token.baseToken.symbol} price ${token.priceChange24h > 0 ? 'increased' : 'decreased'} 
                  by ${Math.abs(token.priceChange24h)}% with volume ${token.volume24h}`;
    
    const result = await classifier(text) as TextClassificationOutput;
    const sentiment = extractSentiment(result);
    
    return {
      symbol: token.baseToken.symbol,
      confidence: sentiment.score,
      direction: sentiment.label === "POSITIVE" ? "up" : "down",
      timeframe: "24h",
      score: Math.round((parseFloat(token.volume24h) / 10000) * sentiment.score * 100)
    };
  } catch (error) {
    console.error("Error generating prediction:", error);
    toast.error("Failed to generate prediction");
    throw error;
  }
}