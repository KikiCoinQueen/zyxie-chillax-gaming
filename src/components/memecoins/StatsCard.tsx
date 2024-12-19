import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  delay?: number;
}

export const StatsCard = ({ icon: Icon, label, value, delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="w-full"
    >
      <Card className="glass-card hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {value}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};