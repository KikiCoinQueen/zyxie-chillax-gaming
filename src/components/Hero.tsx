import { motion } from "framer-motion";
import { LineChart, TrendingUp, Shield, Activity } from "lucide-react";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-4">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container relative z-10 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 gradient-text neon-glow">
          CryptoMarket Analytics
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-muted-foreground">
          Professional Market Analysis & Real-Time Tracking
        </p>
        
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2"
            >
              <LineChart className="w-8 h-8 text-primary" />
              <span className="text-sm text-muted-foreground">Advanced Analytics</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2"
            >
              <TrendingUp className="w-8 h-8 text-secondary" />
              <span className="text-sm text-muted-foreground">Market Trends</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2"
            >
              <Activity className="w-8 h-8 text-purple-500" />
              <span className="text-sm text-muted-foreground">Real-Time Data</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2"
            >
              <Shield className="w-8 h-8 text-green-500" />
              <span className="text-sm text-muted-foreground">Secure Platform</span>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 max-w-lg mx-auto"
          >
            <p className="text-lg text-muted-foreground">
              Access comprehensive market analysis, track real-time cryptocurrency data, 
              and make informed decisions with our professional trading insights.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Professional gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </section>
  );
};