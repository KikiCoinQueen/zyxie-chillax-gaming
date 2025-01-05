import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bot } from "lucide-react";
import { analyzeToken } from "@/services/analysisService";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function TokenAnalyzer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your crypto AI assistant. I can help you analyze tokens, understand market trends, and provide trading insights. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAnalyzing) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsAnalyzing(true);

    try {
      // Extract potential token symbols from the message
      const tokenMatch = userMessage.match(/\$([A-Za-z0-9]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;

      if (token) {
        const analysis = await analyzeToken(token);
        const response = `Analysis for $${token}:\n` +
          `• Sentiment Score: ${analysis.sentiment.toFixed(1)}%\n` +
          `• Risk Level: ${analysis.riskScore.toFixed(1)}/5\n` +
          `• Social Score: ${analysis.socialScore.toFixed(1)}/5\n` +
          `• Market Prediction: ${analysis.prediction}\n` +
          `• Confidence: ${analysis.confidence.toFixed(1)}%\n\n` +
          `Based on this analysis, ${analysis.sentiment > 60 
            ? "this token shows positive momentum. Consider watching for entry points." 
            : "exercise caution with this token. The signals are not strongly positive."}`;

        setMessages(prev => [...prev, { role: "assistant", content: response }]);
      } else {
        // General crypto advice based on the question
        const response = "To analyze a specific token, please mention it with a $ symbol (e.g., $BTC). " +
          "I can then provide detailed analysis including sentiment, risk assessment, and trading signals.";
        setMessages(prev => [...prev, { role: "assistant", content: response }]);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze token", {
        description: "Please try again or check if the token exists"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          Crypto AI Analyst
        </CardTitle>
        <CardDescription>
          Chat with our AI to analyze tokens and get trading insights. Use $SYMBOL to analyze specific tokens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "assistant"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Ask about a token (e.g., Analyze $BTC)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isAnalyzing}
          />
          <Button type="submit" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}