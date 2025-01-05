import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import ElizaBot from 'elizabot';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const initializeEliza = () => {
  const eliza = new ElizaBot();
  return {
    getInitialResponse: () => eliza.getInitial(),
    getResponse: (input: string) => eliza.transform(input)
  };
};

export const ElizaTrader = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const elizaRef = useRef(initializeEliza());

  useEffect(() => {
    const initialMessage = {
      id: crypto.randomUUID(),
      text: elizaRef.current.getInitialResponse(),
      sender: 'ai' as const,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const analyzeSentiment = (text: string): string => {
    const bullishKeywords = ['buy', 'moon', 'pump', 'bullish', 'long'];
    const bearishKeywords = ['sell', 'dump', 'bearish', 'short', 'crash'];
    
    const bullishCount = bullishKeywords.filter(word => 
      text.toLowerCase().includes(word)
    ).length;
    
    const bearishCount = bearishKeywords.filter(word => 
      text.toLowerCase().includes(word)
    ).length;

    if (bullishCount > bearishCount) return '📈 Bullish sentiment detected';
    if (bearishCount > bullishCount) return '📉 Bearish sentiment detected';
    return '📊 Neutral sentiment';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sentiment = analyzeSentiment(input);
    const elizaResponse = elizaRef.current.getResponse(input);
    
    let aiResponse = elizaResponse;
    
    // Add trading-specific responses
    if (input.toLowerCase().includes('market')) {
      aiResponse += '\n\nThe market is highly volatile right now. Remember to always do your own research and never invest more than you can afford to lose.';
    }
    
    if (input.toLowerCase().includes('buy') || input.toLowerCase().includes('sell')) {
      aiResponse += '\n\n⚠️ This is not financial advice. Always verify information from multiple sources.';
    }

    const aiMessage: Message = {
      id: crypto.randomUUID(),
      text: `${aiResponse}\n\n${sentiment}`,
      sender: 'ai',
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMessage]);
    
    // Show toast for important keywords
    if (input.toLowerCase().includes('help')) {
      toast.info("Trading Tips", {
        description: "Remember to always use stop losses and manage your risk carefully.",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary" />
          ElizaTrader AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] p-4" ref={scrollAreaRef}>
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex gap-3 mb-4 ${
                  message.sender === 'ai' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`flex-shrink-0 ${
                  message.sender === 'ai' ? 'text-primary' : 'text-secondary'
                }`}>
                  {message.sender === 'ai' ? (
                    <Brain className="w-6 h-6" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.sender === 'ai'
                      ? 'bg-muted'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-50 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <Bot className="w-4 h-4 animate-pulse" />
              <span>ElizaTrader is typing...</span>
            </motion.div>
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about market conditions, trading strategies, or specific coins..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};