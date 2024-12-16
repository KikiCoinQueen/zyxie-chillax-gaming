import { RunwareService, GenerateImageParams } from "./runwareService";
import { toast } from "sonner";

const DEFAULT_PROMPT_SUFFIX = ", anime style, high quality, detailed, beautiful lighting";

export const generateZyxieImage = async (apiKey: string, scene: string): Promise<string | null> => {
  try {
    const runwareService = new RunwareService(apiKey);
    
    const basePrompt = `anime style digital art of Zyxie, a beautiful young woman with long flowing lavender hair and striking violet-blue eyes, wearing modern cyberpunk clothing with glowing accents. She has an effortlessly cool and confident demeanor`;
    
    const params: GenerateImageParams = {
      positivePrompt: `${basePrompt}. ${scene}${DEFAULT_PROMPT_SUFFIX}`,
      model: "runware:100@1",
      numberResults: 1,
      outputFormat: "WEBP",
      CFGScale: 7,
      scheduler: "FlowMatchEulerDiscreteScheduler",
      strength: 0.8
    };

    const result = await runwareService.generateImage(params);
    return result.imageURL;
  } catch (error) {
    console.error("Error generating image:", error);
    toast.error("Failed to generate image. Please try again.");
    return null;
  }
};