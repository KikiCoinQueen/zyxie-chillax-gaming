import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateZyxieImage } from "@/services/imageGenerationService";
import { toast } from "sonner";

export const ZyxieGenerator = () => {
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const scenes = [
    "in a futuristic gaming lounge surrounded by multiple screens displaying crypto charts and playing video games",
    "at a high-tech beach party with holographic displays and virtual assets floating in the air",
    "in a cozy neon-lit room streaming and chatting with fans about crypto",
    "exploring a cyberpunk city street at night with glowing advertisements",
    "relaxing in a zen garden with floating holographic crypto symbols"
  ];

  const handleGenerate = async (scene: string) => {
    if (!apiKey) {
      toast.error("Please enter your Runware API key");
      return;
    }

    setIsGenerating(true);
    try {
      const imageUrl = await generateZyxieImage(apiKey, scene);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
        toast.success("Image generated successfully!");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-20 px-4" id="zyxie-generator">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Wand2 className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Zyxie Image Generator
            </h2>
          </div>

          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle>Generate Zyxie Art</CardTitle>
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
                      className="h-auto py-4 px-6 text-left"
                      onClick={() => handleGenerate(scene)}
                      disabled={isGenerating}
                    >
                      <span className="line-clamp-2">{scene}</span>
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
              className="aspect-square max-w-2xl mx-auto rounded-xl overflow-hidden"
            >
              <img
                src={generatedImage}
                alt="Generated Zyxie"
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