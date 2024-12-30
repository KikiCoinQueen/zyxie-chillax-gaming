import { motion } from "framer-motion";
import { LineChart, TrendingUp, Shield, Activity } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-20">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container relative z-10 max-w-5xl mx-auto px-4"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-gradient-primary neon-glow tracking-tight">
          CryptoMarket Analytics
        </h1>
        <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
          Professional Market Analysis & Real-Time Tracking with AI-Powered Insights
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6 flex flex-col items-center gap-3 hover-card"
          >
            <LineChart className="w-8 h-8 text-primary" />
            <span className="text-sm text-muted-foreground">Advanced Analytics</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6 flex flex-col items-center gap-3 hover-card"
          >
            <TrendingUp className="w-8 h-8 text-secondary" />
            <span className="text-sm text-muted-foreground">Market Trends</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6 flex flex-col items-center gap-3 hover-card"
          >
            <Activity className="w-8 h-8 text-purple-500" />
            <span className="text-sm text-muted-foreground">Real-Time Data</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6 flex flex-col items-center gap-3 hover-card"
          >
            <Shield className="w-8 h-8 text-green-500" />
            <span className="text-sm text-muted-foreground">Secure Platform</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float delay-1000" />
      </div>
    </section>
  );
};