import { motion } from "framer-motion";

const posts = [
  {
    title: "Why This Meme Coin Could Be the Next Big Thing",
    excerpt: "Let's talk about the newest pupper in the crypto space...",
    date: "2024-02-20",
  },
  {
    title: "My Epic Fail in Palworld (You Won't Believe What Happened)",
    excerpt: "So there I was, thinking I had the perfect base setup...",
    date: "2024-02-18",
  },
  {
    title: "Crypto Trading While Gaming? Here's My Setup",
    excerpt: "The ultimate guide to monitoring your portfolio without dying in-game...",
    date: "2024-02-15",
  },
];

export const BlogPreview = () => {
  return (
    <section className="py-20 px-4" id="blog">
      <div className="container">
        <h2 className="text-3xl font-display font-bold mb-12 gradient-text text-center">
          Latest Adventures
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {posts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 rounded-xl hover:scale-105 transition-transform cursor-pointer"
            >
              <time className="text-sm text-muted-foreground">{post.date}</time>
              <h3 className="text-xl font-display font-bold mt-2 mb-3">{post.title}</h3>
              <p className="text-muted-foreground">{post.excerpt}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};