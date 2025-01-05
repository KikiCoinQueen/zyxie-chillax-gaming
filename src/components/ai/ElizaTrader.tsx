import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bot, Sparkles } from "lucide-react";
import elizabot from "elizabot";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

const initializeEliza = () => {
  const eliza = elizabot();
  return {
    eliza,
    initial: eliza.getInitial()
  };
};

export function ElizaTrader() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const { initial } = initializeEliza();
    return [{
      role: "assistant",
      content: `${initial} I'm your crypto trading assistant. I can help you analyze market trends and make informed decisions. What would you like to discuss about crypto trading?`,
      id: "initial"
    }];
  });
  
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [elizaInstance] = useState(initializeEliza);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    const messageId = Date.now().toString();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage, id: messageId }]);
    setIsProcessing(true);

    try {
      const reply = elizaInstance.eliza.transform(userMessage);
      
      let enhancedReply = reply;
      if (userMessage.toLowerCase().includes("market")) {
        enhancedReply += " Remember to always do your own research and manage your risk carefully.";
      } else if (userMessage.toLowerCase().includes("buy") || userMessage.toLowerCase().includes("sell")) {
        enhancedReply += " Trading decisions should be based on thorough analysis and your risk tolerance.";
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: enhancedReply,
          id: `reply-${messageId}`
        }]);
        setIsProcessing(false);
      }, 500);
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble processing that request. Could you rephrase it?",
        id: `error-${messageId}`
      }]);
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          Eliza Crypto Advisor
          <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
        </CardTitle>
        <CardDescription>
          Chat with our AI trading assistant powered by Eliza. Get insights and discuss your crypto trading strategies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
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
                </motion.div>
              ))}
            </AnimatePresence>
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