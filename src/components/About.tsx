import { motion } from "framer-motion";

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
          <h2 className="text-3xl font-display font-bold mb-6 gradient-text">About Me</h2>
          <p className="text-lg mb-6 text-muted-foreground">
            Hey fam! I'm Zyxie, your friendly neighborhood crypto enthusiast and gaming addict. 
            When I'm not hunting for the next moonshot or streaming epic gaming fails, 
            you'll find me creating content that makes crypto and gaming actually fun to understand.
          </p>
          <p className="text-lg text-muted-foreground">
            My mission? To build a community where we can geek out about blockchain, 
            share gaming moments, and maybe make some gains along the way – all while keeping it 
            super chill and authentic. No fancy jargon, just pure vibes! 🚀🎮
          </p>
        </motion.div>
      </div>
    </section>
  );
};