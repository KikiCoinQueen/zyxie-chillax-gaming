import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { BlogPreview } from "@/components/BlogPreview";
import { SocialLinks } from "@/components/SocialLinks";
import { ContactForm } from "@/components/ContactForm";
import { AudioPlayer } from "@/components/AudioPlayer";
import { CryptoSection } from "@/components/CryptoSection";
import { CryptoMarket } from "@/components/CryptoMarket";
import { CryptoPriceChart } from "@/components/CryptoPriceChart";
import { CryptoPortfolio } from "@/components/CryptoPortfolio";
import { SolanaMemeCoins } from "@/components/SolanaMemeCoins";
import { MemeCalculator } from "@/components/calculator/MemeCalculator";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <SolanaMemeCoins />
      <MemeCalculator />
      <CryptoMarket />
      <CryptoPriceChart />
      <CryptoPortfolio />
      <CryptoSection />
      <BlogPreview />
      <SocialLinks />
      <ContactForm />
      <AudioPlayer />
    </main>
  );
};

export default Index;