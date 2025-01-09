import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface AnalysisFormProps {
  onAnalyze: (handle: string) => void;
  isLoading: boolean;
}

export const AnalysisForm = ({ onAnalyze, isLoading }: AnalysisFormProps) => {
  const [handle, setHandle] = useState("");

  const handleAnalyze = () => {
    if (!handle) return;
    onAnalyze(handle.replace('@', ''));
  };

  return (
    <Card className="mb-8 relative z-40">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Input
            placeholder="Enter Twitter handle (e.g. @cryptoKOL)"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="max-w-md relative z-50"
          />
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="relative z-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                Analyzing...
              </div>
            ) : (
              <>Analyze</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};