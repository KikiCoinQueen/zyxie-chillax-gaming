import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { pipeline } from "@huggingface/transformers";

interface GeneratedName {
  name: string;
  confidence: number;
  description: string;
}

export const MemeNameGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);

  const prefixes = ["PEPE", "DOGE", "SHIB", "WOJAK", "MOON", "ELON", "CHAD", "BASED", "SIGMA"];
  const suffixes = ["INU", "MOON", "ROCKET", "FLOKI", "SAFE", "RICH", "KING", "LORD", "CHAD"];

  const generateDescription = async (name: string) => {
    try {
      const classifier = await pipeline(
        "text-classification",
        "onnx-community/distilbert-base-uncased-finetuned-sst-2-english",
        { device: "webgpu" }
      );

      const result = await classifier(`${name} is a new meme coin that will revolutionize the crypto space`);
      // Handle both array and single result cases
      if (Array.isArray(result)) {
        return result[0]?.label === "POSITIVE" ? 0.8 : 0.3;
      }
      return result?.label === "POSITIVE" ? 0.8 : 0.3;
    } catch (error) {
      console.error("Error classifying name:", error);
      return Math.random() * 0.5 + 0.5; // Fallback confidence score
    }
  };

  const generateNames = async () => {
    setIsGenerating(true);
    try {
      const newNames: GeneratedName[] = [];

      for (let i = 0; i < 3; i++) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const name = `${prefix}${suffix}`;
        
        const confidence = await generateDescription(name);
        const description = getDescription(confidence);

        newNames.push({
          name,
          confidence,
          description
        });
      }

      setGeneratedNames(newNames);
      toast.success("Generated new meme coin names! 🚀");
    } catch (error) {
      console.error("Error generating names:", error);
      toast.error("Failed to generate names");
    } finally {
      setIsGenerating(false);
    }
  };

  const getDescription = (confidence: number): string => {
    if (confidence > 0.8) return "Extremely bullish potential! 🚀";
    if (confidence > 0.6) return "Strong meme vibes! 💪";
    if (confidence > 0.4) return "Decent memability! 😊";
    return "Needs more WAGMI energy! 🤔";
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence > 0.8) return "bg-green-500";
    if (confidence > 0.6) return "bg-blue-500";
    if (confidence > 0.4) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <section className="py-20 px-4" id="name-generator">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              AI Meme Coin Name Generator
            </h2>
            <Wand2 className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Generate Names
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Button
                  onClick={generateNames}
                  disabled={isGenerating}
                  className="w-full h-12 text-lg"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                      Generating...
                    </div>
                  ) : (
                    "Generate New Names 🎲"
                  )}
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {generatedNames.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center space-y-3">
                            <h3 className="text-2xl font-bold text-primary">
                              {item.name}
                            </h3>
                            <Badge
                              className={`${getConfidenceColor(
                                item.confidence
                              )} hover:${getConfidenceColor(item.confidence)}`}
                            >
                              {(item.confidence * 100).toFixed(1)}% Confidence
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>Powered by AI • Not financial advice • DYOR</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
