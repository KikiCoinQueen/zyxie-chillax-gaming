import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { useAchievements } from "@/contexts/AchievementsContext";

export const AnalysisProgressCard = () => {
  const { userProgress } = useAchievements();

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Your Progress
          <AlertTriangle className="w-4 h-4 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Level {userProgress.level}</span>
              <span className="font-mono text-xl">{userProgress.experience} XP</span>
            </div>
            <Progress value={(userProgress.experience % 1000) / 10} className="h-2" />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Achievements</h3>
            {userProgress.achievements.map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};