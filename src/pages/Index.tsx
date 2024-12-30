import { Hero } from "@/components/Hero";
import { TokenDiscovery } from "@/components/discovery/TokenDiscovery";
import { TrendingCoins } from "@/components/trending/TrendingCoins";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-background via-background/95 to-background relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
        
        <AppSidebar />
        <main className="flex-1 overflow-auto relative">
          <SidebarTrigger className="fixed top-4 left-4 z-50" />
          
          <div className="max-w-7xl mx-auto space-y-24 pb-24">
            <Hero />

            <section className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-xl"
              >
                <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Trending Coins</h2>
                <TrendingCoins />
              </motion.div>
            </section>

            <Separator className="opacity-50" />

            <section className="px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-xl"
              >
                <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Token Discovery</h2>
                <TokenDiscovery />
              </motion.div>
            </section>
          </div>

          {/* Floating gradient orbs */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float delay-1000" />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;