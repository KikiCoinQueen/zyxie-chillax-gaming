import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateZyxieImage } from "@/services/imageGenerationService";
import { toast } from "sonner";

export const CryptoArtGenerator = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("runwareApiKey") || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const scenes = [
    "a futuristic crypto trading floor with holographic market charts and AI traders analyzing patterns in a cyberpunk style, dramatic lighting",
    "an epic visualization of a blockchain network with glowing nodes and digital connections forming intricate patterns in space",
    "a high-tech crypto mining facility with rows of powerful mining rigs emanating neon colors in a dystopian setting",
    "a virtual reality crypto trading environment with floating real-time market data and neural network visualizations",
    "an ultra-modern cryptocurrency exchange command center with advanced security systems and holographic trading interfaces"
  ];

  const handleGenerate = async (scene: string) => {
    if (!apiKey) {
      toast.error("Please enter your Runware API key");
      return;
    }

    localStorage.setItem("runwareApiKey", apiKey);
    setIsGenerating(true);

    try {
      const imageUrl = await generateZyxieImage(apiKey, scene);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
        toast.success("Crypto artwork generated successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate artwork. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-20 px-4" id="crypto-art-generator">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Coins className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Crypto Art Generator
            </h2>
            <Wand2 className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle>Generate Crypto Art</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    Runware API Key
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter your Runware API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your API key from{" "}
                    <a
                      href="https://runware.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Runware.ai
                    </a>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scenes.map((scene, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto py-4 px-6 text-left hover:bg-primary/10 transition-colors duration-300 group"
                      onClick={() => handleGenerate(scene)}
                      disabled={isGenerating}
                    >
                      <span className="line-clamp-2 group-hover:text-primary transition-colors">{scene}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {generatedImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            >
              <img
                src={generatedImage}
                alt="Generated Crypto Art"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {isGenerating && (
            <div className="flex justify-center items-center mt-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};