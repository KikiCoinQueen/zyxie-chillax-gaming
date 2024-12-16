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
import { MarketSentiment } from "@/components/insights/MarketSentiment";
import { OpportunityScanner } from "@/components/scanner/OpportunityScanner";
import { MarketMoodRing } from "@/components/mood/MarketMoodRing";
import { CryptoPulse } from "@/components/pulse/CryptoPulse";
import { TokenAnalyzer } from "@/components/ai/TokenAnalyzer";
import { MemeDiscovery } from "@/components/discovery/MemeDiscovery";
import { MemePredictor } from "@/components/predictor/MemePredictor";
import { MemeAnalyzer } from "@/components/ai/MemeAnalyzer";
import { AchievementsProvider } from "@/contexts/AchievementsContext";

const Index = () => {
  return (
    <AchievementsProvider>
      <main className="min-h-screen">
        <Hero />
        <About />
        <MemeAnalyzer />
        <MemePredictor />
        <TokenAnalyzer />
        <MemeDiscovery />
        <MarketMoodRing />
        <CryptoPulse />
        <OpportunityScanner />
        <SolanaMemeCoins />
        <MemeInsights />
        <MarketSentiment />
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
    </AchievementsProvider>
  );
};

export default Index;