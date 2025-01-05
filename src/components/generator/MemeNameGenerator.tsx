import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, RefreshCw, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const PREFIXES = ["Safe", "Moon", "Doge", "Shib", "Pepe", "Baby", "Elon", "Based", "Chad", "Wojak"];
const SUFFIXES = ["Inu", "Moon", "Rocket", "Floki", "Elon", "Coin", "Token", "AI", "Dao", "Verse"];
const THEMES = ["space", "memes", "food", "animals", "tech"];

export const MemeNameGenerator = () => {
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState("space");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateName = () => {
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    const number = Math.random() > 0.5 ? Math.floor(Math.random() * 9999) : "";
    return `${prefix}${suffix}${number}`;
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    const names = Array(5).fill(null).map(() => generateName());
    
    // Simulate AI thinking with a delay
    setTimeout(() => {
      setGeneratedNames(names);
      setIsGenerating(false);
      toast.success("Generated new meme coin names! 🚀");
    }, 1000);
  };

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success("Copied to clipboard!");
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display gradient-text">Meme Name Generator</h2>
          <p className="text-muted-foreground mt-1">Generate viral-worthy token names</p>
        </div>
        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
      </div>

      <div className="flex flex-wrap gap-2">
        {THEMES.map((theme) => (
          <Button
            key={theme}
            variant={selectedTheme === theme ? "default" : "outline"}
            onClick={() => setSelectedTheme(theme)}
            className="capitalize"
          >
            {theme}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Rocket className="w-4 h-4 mr-2" />
          )}
          {isGenerating ? "Generating..." : "Generate Names"}
        </Button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          {generatedNames.map((name, index) => (
            <motion.div
              key={`${name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-card/50 rounded-lg hover-card group"
            >
              <span className="font-mono text-lg">{name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(name)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {generatedNames.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Pro tip: Great names often become successful tokens! 🌟
          </p>
        )}
      </div>
    </Card>
  );
};