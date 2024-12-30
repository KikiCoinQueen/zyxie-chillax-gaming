import { motion } from "framer-motion";
import { LineChart, TrendingUp, Shield, Activity } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      <div className="absolute inset-0 bg-grid-white/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container relative z-10 max-w-5xl mx-auto px-4"
      >
        <div className="text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 text-gradient-primary tracking-tight"
          >
            CryptoMarket
            <span className="text-gradient-secondary"> Analytics</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Professional Market Analysis & Real-Time Tracking with AI-Powered Insights
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a href="#market-analysis" className="inline-flex items-center px-6 py-3 rounded-lg bg-primary/20 border border-primary/20 hover:bg-primary/30 transition-colors">
              <LineChart className="w-5 h-5 mr-2" />
              Market Analysis
            </a>
            <a href="#trending" className="inline-flex items-center px-6 py-3 rounded-lg bg-secondary/20 border border-secondary/20 hover:bg-secondary/30 transition-colors">
              <TrendingUp className="w-5 h-5 mr-2" />
              View Trending
            </a>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-20"
        >
          <div className="glass-card p-6 rounded-xl hover-card">
            <LineChart className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-sm text-muted-foreground">Real-time market analysis and predictions</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl hover-card">
            <TrendingUp className="w-8 h-8 text-secondary mb-4" />
            <h3 className="font-semibold mb-2">Market Trends</h3>
            <p className="text-sm text-muted-foreground">Track emerging opportunities</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl hover-card">
            <Activity className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="font-semibold mb-2">Live Updates</h3>
            <p className="text-sm text-muted-foreground">24/7 market monitoring</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl hover-card">
            <Shield className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="font-semibold mb-2">Secure Platform</h3>
            <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent transform rotate-12 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float delay-1000" />
      </div>
    </section>
  );
};