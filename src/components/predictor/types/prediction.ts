export interface Prediction {
  symbol: string;
  confidence: number;
  direction: "up" | "down";
  timeframe: "24h" | "7d";
  score: number;
}

export interface TextClassificationSingle {
  label: string;
  score: number;
}

export type TextClassificationOutput = TextClassificationSingle | TextClassificationSingle[];

// Type guard to check if the result is an array
export function isClassificationArray(result: TextClassificationOutput): result is TextClassificationSingle[] {
  return Array.isArray(result);
}

export function extractSentiment(result: TextClassificationOutput): TextClassificationSingle {
  if (isClassificationArray(result)) {
    const firstResult = result[0];
    return {
      label: firstResult?.label || "NEUTRAL",
      score: firstResult?.score || 0.5
    };
  }
  return result;
}