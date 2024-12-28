import { motion } from "framer-motion";
import { BarChart2, Globe, Shield, Users } from "lucide-react";

export const About = () => {
  return (
    <section className="py-20 px-4" id="about">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 rounded-2xl max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-display font-bold mb-6 gradient-text">About Our Platform</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <BarChart2 className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Comprehensive market analysis tools and real-time data tracking for informed decision-making.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Globe className="w-6 h-6 text-secondary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Global Markets</h3>
                <p className="text-muted-foreground">
                  Access to worldwide cryptocurrency markets with 24/7 monitoring and updates.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Secure Platform</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security measures to protect your data and trading activities.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-purple-500 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Community Insights</h3>
                <p className="text-muted-foreground">
                  Collaborative market analysis and shared insights from professional traders.
                </p>
              </div>
            </div>
          </div>

          <p className="text-lg text-muted-foreground">
            Our mission is to provide professional-grade cryptocurrency market analysis and tracking tools, 
            enabling traders and investors to make well-informed decisions in the digital asset space.
          </p>
        </motion.div>
      </div>
    </section>
  );
};