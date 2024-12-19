import { Hero } from "@/components/Hero";
import { MarketMoodRing } from "@/components/mood/MarketMoodRing";
import { CryptoPulse } from "@/components/pulse/CryptoPulse";
import { SolanaMemeCoins } from "@/components/SolanaMemeCoins";
import { CryptoSection } from "@/components/CryptoSection";
import { MemeDiscovery } from "@/components/discovery/MemeDiscovery";
import { MemeInsights } from "@/components/insights/MemeInsights";
import { TrendingPairs } from "@/components/trending/TrendingPairs";
import { MarketSentiment } from "@/components/insights/MarketSentiment";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { motion } from "framer-motion";

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
              <MarketMoodRing />
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <TrendingPairs />
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <MarketSentiment />
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <CryptoPulse />
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <SolanaMemeCoins />
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <CryptoSection />
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <MemeDiscovery />
            </motion.div>

            <motion.div variants={item} className="relative z-10">
              <MemeInsights />
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