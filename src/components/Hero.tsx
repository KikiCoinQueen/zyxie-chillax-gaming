import { motion } from "framer-motion";
import { Gamepad, Bitcoin, Twitch, Youtube } from "lucide-react";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-4">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ 
          backgroundImage: "url('/th (1).jpeg')",
          backgroundPosition: "center 20%" 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container relative z-10 text-center"
      >
        <motion.div 
          className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <img 
            src="/image (1).jpg"
            alt="Zyxie"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 gradient-text neon-glow">
          Zyxie Arcadia
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
          Chillin', Gammin', Crypto-Winnin'
        </p>
        
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center justify-center gap-8 mb-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2"
            >
              <Gamepad className="w-8 h-8 text-primary" />
              <span className="text-sm text-muted-foreground">Gaming Pro</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2"
            >
              <Bitcoin className="w-8 h-8 text-secondary" />
              <span className="text-sm text-muted-foreground">Crypto Expert</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2"
            >
              <Twitch className="w-8 h-8 text-purple-500" />
              <span className="text-sm text-muted-foreground">Live Streamer</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2"
            >
              <Youtube className="w-8 h-8 text-red-500" />
              <span className="text-sm text-muted-foreground">Content Creator</span>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 max-w-lg mx-auto"
          >
            <p className="text-lg text-muted-foreground">
              Welcome to my digital realm! I'm a passionate gamer, crypto enthusiast, and content creator. 
              Join me on my journey through the latest games, crypto insights, and entertaining content.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};