import { Hero } from "@/components/Hero";
import { TokenDiscovery } from "@/components/discovery/TokenDiscovery";
import { TrendingCoins } from "@/components/trending/TrendingCoins";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24"
          >
            <motion.section variants={item} className="relative z-10">
              <Hero />
            </motion.section>

            <Separator className="my-12 opacity-50" />

            <motion.section variants={item} className="relative z-10">
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Trending Coins</h2>
                <p className="text-muted-foreground text-center max-w-2xl mx-auto">
                  Discover the hottest cryptocurrencies making waves in the market right now.
                </p>
              </div>
              <TrendingCoins />
            </motion.section>

            <Separator className="my-12 opacity-50" />

            <motion.section variants={item} className="relative z-10">
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Token Discovery</h2>
                <p className="text-muted-foreground text-center max-w-2xl mx-auto">
                  Explore and analyze new tokens with our advanced discovery tools.
                </p>
              </div>
              <TokenDiscovery />
            </motion.section>

            <Separator className="my-12 opacity-50" />

            <motion.section variants={item} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass-card hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 gradient-text">🎯 Market Mood Ring</h3>
                  <p className="text-muted-foreground">
                    Real-time market sentiment analysis using volume, price action, and social signals to gauge overall market mood.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 gradient-text">📊 Market Sentiment</h3>
                  <p className="text-muted-foreground">
                    Comprehensive analysis of market sentiment for top tokens, showing bullish/bearish indicators.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 gradient-text">⚡ Crypto Pulse</h3>
                  <p className="text-muted-foreground">
                    Real-time market movements and significant price actions across different cryptocurrencies.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 gradient-text">🚀 Solana Meme Gems</h3>
                  <p className="text-muted-foreground">
                    Track and discover trending meme coins on the Solana network for new opportunities.
                  </p>
                </CardContent>
              </Card>
            </motion.section>
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