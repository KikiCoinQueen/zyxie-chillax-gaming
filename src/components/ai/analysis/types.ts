export interface TextClassificationSingle {
  label: string;
  score: number;
}

export type TextClassificationOutput = TextClassificationSingle | TextClassificationSingle[];

export interface AnalysisResult {
  symbol: string;
  sentiment: number;
  riskScore: number;
  socialScore: number;
  prediction: string;
  confidence: number;
}

export function isClassificationArray(result: TextClassificationOutput): result is TextClassificationSingle[] {
  return Array.isArray(result);
}

export function extractSentiment(result: TextClassificationOutput): TextClassificationSingle {
  if (isClassificationArray(result)) {
    return result[0] || { label: "NEUTRAL", score: 0.5 };
  }
  return result;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
}

export interface UserProgress {
  level: number;
  experience: number;
  achievements: Achievement[];
  analyzedTokens: string[];
}