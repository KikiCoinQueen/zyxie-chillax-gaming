import { Hero } from "@/components/Hero";
import { TokenDiscovery } from "@/components/discovery/TokenDiscovery";
import { TrendingCoins } from "@/components/trending/TrendingCoins";
import { MicroCapScanner } from "@/components/scanner/MicroCapScanner";
import { MemeNameGenerator } from "@/components/generator/MemeNameGenerator";
import { TokenAnalyzer } from "@/components/ai/TokenAnalyzer";
import { ElizaTrader } from "@/components/ai/ElizaTrader";
import { VoiceTrader } from "@/components/ai/VoiceTrader";
import ArbitrageScanner from "@/components/scanner/ArbitrageScanner";
import { CryptoArtGenerator } from "@/components/generator/CryptoArtGenerator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import TwitterKOLAnalysis from "@/components/twitter/TwitterKOLAnalysis";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-mesh-gradient relative overflow-hidden">
        {/* Enhanced background patterns */}
        <div className="absolute inset-0 bg-grid-white/5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background/0 to-background/0 pointer-events-none blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/20 via-background/0 to-background/0 pointer-events-none blur-3xl" />
        
        <AppSidebar />
        <main className="flex-1 overflow-auto relative">
          <SidebarTrigger className="fixed top-4 left-4 z-50" />
          
          <AnimatePresence>
            <div className="max-w-[1920px] mx-auto space-y-12 pb-24">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Hero />
              </motion.div>

              <motion.section 
                id="twitter-kol" 
                className="px-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300 transform hover:scale-[1.01]">
                  <TwitterKOLAnalysis />
                </div>
              </motion.section>

              <motion.section 
                id="crypto-art" 
                className="px-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300 transform hover:scale-[1.01]">
                  <CryptoArtGenerator />
                </div>
              </motion.section>

              <motion.section 
                id="arbitrage-scanner" 
                className="px-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300 transform hover:scale-[1.01]">
                  <ArbitrageScanner />
                </div>
              </motion.section>

              <motion.section 
                id="micro-cap-scanner" 
                className="px-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300 transform hover:scale-[1.01]">
                  <MicroCapScanner />
                </div>
              </motion.section>

              <Separator className="opacity-10" />

              <motion.section 
                id="eliza-trader" 
                className="px-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300 transform hover:scale-[1.01]">
                  <ElizaTrader />
                </div>
              </motion.section>

              <motion.section 
                id="voice-trader" 
                className="px-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300 transform hover:scale-[1.01]">
                  <VoiceTrader />
                </div>
              </motion.section>

              <Separator className="opacity-10" />

              <motion.section 
                id="name-generator" 
                className="px-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300 transform hover:scale-[1.01]">
                  <MemeNameGenerator />
                </div>
              </motion.section>

              <motion.section 
                id="ai-analysis" 
                className="px-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300 transform hover:scale-[1.01]">
                  <TokenAnalyzer />
                </div>
              </motion.section>

              <Separator className="opacity-10" />

              <motion.section 
                id="trending" 
                className="px-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300 transform hover:scale-[1.01]">
                  <TrendingCoins />
                </div>
              </motion.section>

              <Separator className="opacity-10" />

              <motion.section 
                id="discovery" 
                className="px-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300 transform hover:scale-[1.01]">
                  <TokenDiscovery />
                </div>
              </motion.section>
            </div>
          </AnimatePresence>

          {/* Enhanced background elements */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              className="absolute -top-1/2 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent transform rotate-12 blur-3xl"
              animate={{ 
                rotate: [12, 15, 12],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div 
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
              animate={{ 
                y: [-20, 20, -20],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
              animate={{ 
                y: [20, -20, 20],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/5 rounded-full blur-2xl"
              animate={{ 
                x: [-20, 20, -20],
                y: [-20, 20, -20],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;