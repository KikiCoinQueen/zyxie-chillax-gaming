import { motion } from "framer-motion";
import { Gamepad, Bitcoin } from "lucide-react";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-4">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container relative z-10 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 gradient-text neon-glow">
          Zyxie Arcadia
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
          Chillin', Gammin', Crypto-Winnin'
        </p>
        <div className="flex items-center justify-center gap-4 mb-12">
          <Gamepad className="w-8 h-8 text-primary animate-pulse" />
          <Bitcoin className="w-8 h-8 text-secondary animate-pulse" />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium"
        >
          Join the Adventure
        </motion.button>
      </motion.div>
    </section>
  );
};