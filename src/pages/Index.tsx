import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { BlogPreview } from "@/components/BlogPreview";
import { SocialLinks } from "@/components/SocialLinks";
import { ContactForm } from "@/components/ContactForm";
import { AudioPlayer } from "@/components/AudioPlayer";
import { CryptoSection } from "@/components/CryptoSection";
import { CryptoMarket } from "@/components/CryptoMarket";
import { CryptoPriceChart } from "@/components/CryptoPriceChart";
import { SolanaMemeCoins } from "@/components/SolanaMemeCoins";
import { MemeCalculator } from "@/components/calculator/MemeCalculator";
import { CryptoPortfolio } from "@/components/portfolio/CryptoPortfolio";
import { MemeLeaderboard } from "@/components/leaderboard/MemeLeaderboard";
import { MemeInsights } from "@/components/insights/MemeInsights";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <SolanaMemeCoins />
      <MemeInsights />
      <MemeLeaderboard />
      <MemeCalculator />
      <CryptoPortfolio />
      <CryptoMarket />
      <CryptoPriceChart />
      <CryptoSection />
      <BlogPreview />
      <SocialLinks />
      <ContactForm />
      <AudioPlayer />
    </main>
  );
};

export default Index;