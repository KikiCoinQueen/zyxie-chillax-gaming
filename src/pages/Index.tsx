import { Hero } from "@/components/Hero";
import { MarketMoodRing } from "@/components/mood/MarketMoodRing";
import { CryptoPulse } from "@/components/pulse/CryptoPulse";
import { SolanaMemeCoins } from "@/components/SolanaMemeCoins";
import { CryptoSection } from "@/components/CryptoSection";
import { MemeDiscovery } from "@/components/discovery/MemeDiscovery";
import { MemeInsights } from "@/components/insights/MemeInsights";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <SidebarTrigger className="fixed top-4 left-4 z-50" />
          <div className="container mx-auto px-4">
            <Hero />
            <div className="space-y-8">
              <MarketMoodRing />
              <CryptoPulse />
              <SolanaMemeCoins />
              <CryptoSection />
              <MemeDiscovery />
              <MemeInsights />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;