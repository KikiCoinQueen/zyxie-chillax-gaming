import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bot } from "lucide-react";
import { ElizaBot } from "elizabot";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const initializeEliza = () => {
  const eliza = new ElizaBot();
  const initial = eliza.getInitial();
  return { eliza, initial };
};

export function ElizaTrader() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const { initial } = initializeEliza();
    return [{
      role: "assistant",
      content: `${initial} I'm your crypto trading assistant. I can help you analyze market trends and make informed decisions. What would you like to discuss about crypto trading?`
    }];
  });
  
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [elizaInstance] = useState(() => new ElizaBot());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsProcessing(true);

    try {
      // Get Eliza's response
      const reply = elizaInstance.transform(userMessage);
      
      // Enhance the response with crypto-specific context
      let enhancedReply = reply;
      if (userMessage.toLowerCase().includes("market")) {
        enhancedReply += " Remember to always do your own research and manage your risk carefully.";
      } else if (userMessage.toLowerCase().includes("buy") || userMessage.toLowerCase().includes("sell")) {
        enhancedReply += " Trading decisions should be based on thorough analysis and your risk tolerance.";
      }

      setMessages(prev => [...prev, { role: "assistant", content: enhancedReply }]);
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble processing that request. Could you rephrase it?" 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          Eliza Crypto Advisor
        </CardTitle>
        <CardDescription>
          Chat with our AI trading assistant powered by Eliza. Get insights and discuss your crypto trading strategies.
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
            placeholder="Ask about trading strategies or market analysis..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
          />
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? (
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