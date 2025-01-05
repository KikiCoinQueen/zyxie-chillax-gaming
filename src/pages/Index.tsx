import { Hero } from "@/components/Hero";
import { TokenDiscovery } from "@/components/discovery/TokenDiscovery";
import { TrendingCoins } from "@/components/trending/TrendingCoins";
import { MicroCapScanner } from "@/components/scanner/MicroCapScanner";
import { MemeNameGenerator } from "@/components/generator/MemeNameGenerator";
import { TokenAnalyzer } from "@/components/ai/TokenAnalyzer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-mesh-gradient relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-grid-white/5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background pointer-events-none" />
        
        <AppSidebar />
        <main className="flex-1 overflow-auto relative">
          <SidebarTrigger className="fixed top-4 left-4 z-50" />
          
          <div className="max-w-[1920px] mx-auto space-y-12 pb-24">
            <Hero />

            <section id="ai-analysis" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10"
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
                className="glass-card rounded-xl overflow-hidden border border-white/10"
              >
                <TrendingCoins />
              </motion.div>
            </section>

            <Separator className="opacity-10" />

            <section id="micro-cap" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10"
              >
                <MicroCapScanner />
              </motion.div>
            </section>

            <Separator className="opacity-10" />

            <section id="name-generator" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10"
              >
                <MemeNameGenerator />
              </motion.div>
            </section>

            <Separator className="opacity-10" />

            <section id="discovery" className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden border border-white/10"
              >
                <TokenDiscovery />
              </motion.div>
            </section>
          </div>

          {/* Animated background elements */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-1/2 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent transform rotate-12 blur-3xl" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float delay-1000" />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
