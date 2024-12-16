import { motion } from "framer-motion";
import { Twitter, MessageSquare, Mail } from "lucide-react";

// Custom TikTok icon component
const TikTokIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const SocialLinks = () => {
  const socials = [
    { icon: Twitter, label: "Twitter", href: "https://x.com/zyxiearcadia" },
    { icon: TikTokIcon, label: "TikTok", href: "https://www.tiktok.com/@zyxiearcadia" },
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