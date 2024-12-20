import { Hero } from "@/components/Hero";
import { HotPairsScanner } from "@/components/scanner/HotPairsScanner";
import { TokenDiscovery } from "@/components/discovery/TokenDiscovery";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-background via-background/95 to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
        
        <AppSidebar />
        <main className="flex-1 overflow-auto relative">
          <SidebarTrigger className="fixed top-4 left-4 z-50" />
          
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="container mx-auto px-4 space-y-16 py-8"
          >
            <motion.div variants={item} className="relative z-10">
              <Hero />
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <HotPairsScanner />
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <TokenDiscovery />
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <Card className="p-6">
                <CardContent>
                  <h3 className="text-xl font-bold mb-4">🎯 Market Mood Ring</h3>
                  <p className="text-muted-foreground">
                    This component was intended to display real-time market sentiment analysis using 
                    volume, price action, and social signals to gauge overall market mood.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <Card className="p-6">
                <CardContent>
                  <h3 className="text-xl font-bold mb-4">📊 Market Sentiment</h3>
                  <p className="text-muted-foreground">
                    This section was designed to analyze and display market sentiment for top tokens,
                    showing bullish/bearish indicators based on price action and volume metrics.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <Card className="p-6">
                <CardContent>
                  <h3 className="text-xl font-bold mb-4">⚡ Crypto Pulse</h3>
                  <p className="text-muted-foreground">
                    Originally planned to show real-time market movements and significant price actions
                    across different cryptocurrencies.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <Card className="p-6">
                <CardContent>
                  <h3 className="text-xl font-bold mb-4">🚀 Solana Meme Coins</h3>
                  <p className="text-muted-foreground">
                    This section was meant to track and display trending meme coins on the Solana network,
                    helping users discover new opportunities.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <Card className="p-6">
                <CardContent>
                  <h3 className="text-xl font-bold mb-4">💎 Crypto Section</h3>
                  <p className="text-muted-foreground">
                    A comprehensive overview of cryptocurrency market data and trends was planned for
                    this section.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Floating gradient orbs */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;