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
import { motion } from "framer-motion";
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
          
          <div className="max-w-[1920px] mx-auto space-y-12 pb-24">
            <Hero />

            <section id="twitter-kol" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300"
              >
                <TwitterKOLAnalysis />
              </motion.div>
            </section>

            <section id="crypto-art" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300"
              >
                <CryptoArtGenerator />
              </motion.div>
            </section>

            <section id="arbitrage-scanner" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300"
              >
                <ArbitrageScanner />
              </motion.div>
            </section>

            <section id="micro-cap-scanner" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300"
              >
                <MicroCapScanner />
              </motion.div>
            </section>

            <section id="eliza-trader" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300"
              >
                <ElizaTrader />
              </motion.div>
            </section>

            <section id="voice-trader" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300"
              >
                <VoiceTrader />
              </motion.div>
            </section>

            <Separator className="opacity-10" />

            <section id="name-generator" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300"
              >
                <MemeNameGenerator />
              </motion.div>
            </section>

            <section id="ai-analysis" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300"
              >
                <TokenAnalyzer />
              </motion.div>
            </section>

            <Separator className="opacity-10" />

            <section id="trending" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300"
              >
                <TrendingCoins />
              </motion.div>
            </section>

            <Separator className="opacity-10" />

            <section id="discovery" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/20 transition-colors duration-300"
              >
                <TokenDiscovery />
              </motion.div>
            </section>
          </div>

          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-1/2 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent transform rotate-12 blur-3xl" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float delay-1000" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/5 rounded-full blur-2xl animate-float delay-500" />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
