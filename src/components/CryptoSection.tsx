import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export const CryptoSection = () => {
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard!");
  };

  return (
    <section className="py-20 px-4" id="crypto">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 rounded-2xl max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-display font-bold mb-6 gradient-text">Crypto Corner</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Featured: Zerebro</h3>
              <p className="text-lg mb-4 text-muted-foreground">
                One of our biggest holdings in the portfolio, Zerebro has caught our attention for its unique potential.
                Stay tuned as we'll share our detailed analysis on why we're bullish on this project! 🧠✨
              </p>
              <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
                <code className="text-sm text-muted-foreground break-all">
                  8x5VqbHA8D7NkD52uNuS5nnt3PwA8pLD34ymskeSo2Wn
                </code>
                <button
                  onClick={() => handleCopyAddress("8x5VqbHA8D7NkD52uNuS5nnt3PwA8pLD34ymskeSo2Wn")}
                  className="p-2 hover:text-primary transition-colors"
                  title="Copy address"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>⚠️ Note: This is not financial advice. Always DYOR (Do Your Own Research) before investing.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};