import { motion } from "framer-motion";
import { Twitter, MessageSquare, Mail, Tiktok } from "lucide-react";

export const SocialLinks = () => {
  const socials = [
    { icon: Twitter, label: "Twitter", href: "https://x.com/zyxiearcadia" },
    { icon: Tiktok, label: "TikTok", href: "https://www.tiktok.com/@zyxiearcadia" },
    { icon: Mail, label: "Email", href: "mailto:zyxiearcadia@outlook.com" },
    { icon: MessageSquare, label: "Discord", href: "#" },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30" id="social">
      <div className="container text-center">
        <h2 className="text-3xl font-display font-bold mb-12 gradient-text">
          Connect With Me
        </h2>
        <div className="flex justify-center gap-6">
          {socials.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 glass-card rounded-full hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <social.icon className="w-6 h-6" />
              <span className="sr-only">{social.label}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};