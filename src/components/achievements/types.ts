export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
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