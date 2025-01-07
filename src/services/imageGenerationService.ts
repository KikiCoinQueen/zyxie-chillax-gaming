export const generateZyxieImage = async (apiKey: string, scene: string): Promise<string | null> => {
  try {
    const response = await fetch('https://api.runware.ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: `${scene}, ultra detailed, 8k resolution, cinematic lighting, trending on artstation, professional digital art`,
        negative_prompt: "nsfw, low quality, blurry, watermark, signature, text, anime, cartoon",
        width: 1024,
        height: 1024,
        num_inference_steps: 30,
        guidance_scale: 7.5
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    return data.output[0];
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
};