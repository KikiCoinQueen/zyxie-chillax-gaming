import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Achievement, UserProgress } from "@/components/achievements/types";
import { toast } from "sonner";

interface AchievementsContextType {
  userProgress: UserProgress;
  updateAchievement: (achievementId: string, progress: number) => void;
  addAnalyzedToken: (token: string) => void;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_analysis",
    name: "First Analysis",
    description: "Complete your first token analysis",
    icon: "🎯",
    progress: 0,
    target: 1,
    reward: 100,
    completed: false
  },
  {
    id: "analysis_master",
    name: "Analysis Master",
    description: "Analyze 5 different tokens",
    icon: "🏆",
    progress: 0,
    target: 5,
    reward: 500,
    completed: false
  },
  {
    id: "prediction_streak",
    name: "Prediction Streak",
    description: "Make 3 successful predictions in a row",
    icon: "🎯",
    progress: 0,
    target: 3,
    reward: 300,
    completed: false
  }
];

export const AchievementsProvider = ({ children }: { children: ReactNode }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem("userProgress");
    return saved ? JSON.parse(saved) : {
      level: 1,
      experience: 0,
      achievements: INITIAL_ACHIEVEMENTS,
      analyzedTokens: []
    };
  });

  useEffect(() => {
    localStorage.setItem("userProgress", JSON.stringify(userProgress));
  }, [userProgress]);

  const updateAchievement = (achievementId: string, progress: number) => {
    setUserProgress(prev => {
      const newAchievements = prev.achievements.map(achievement => {
        if (achievement.id !== achievementId) return achievement;
        
        const newProgress = Math.min(achievement.target, progress);
        const wasCompleted = achievement.completed;
        const isNowCompleted = newProgress >= achievement.target;
        
        if (isNowCompleted && !wasCompleted) {
          toast.success(`Achievement Unlocked: ${achievement.name}!`);
          setUserProgress(p => ({
            ...p,
            experience: p.experience + achievement.reward,
            level: Math.floor((p.experience + achievement.reward) / 1000) + 1
          }));
        }
        
        return {
          ...achievement,
          progress: newProgress,
          completed: isNowCompleted
        };
      });

      return {
        ...prev,
        achievements: newAchievements
      };
    });
  };

  const addAnalyzedToken = (token: string) => {
    setUserProgress(prev => {
      if (prev.analyzedTokens.includes(token)) return prev;
      
      const newTokens = [...prev.analyzedTokens, token];
      updateAchievement("first_analysis", 1);
      updateAchievement("analysis_master", newTokens.length);
      
      return {
        ...prev,
        analyzedTokens: newTokens,
        experience: prev.experience + 10
      };
    });
  };

  return (
    <AchievementsContext.Provider value={{ userProgress, updateAchievement, addAnalyzedToken }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error("useAchievements must be used within an AchievementsProvider");
  }
  return context;
};