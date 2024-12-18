import { Hero } from "@/components/Hero";
import { MarketMoodRing } from "@/components/mood/MarketMoodRing";
import { CryptoPulse } from "@/components/pulse/CryptoPulse";
import { AchievementsProvider } from "@/contexts/AchievementsContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";

const Index = () => {
  return (
    <AchievementsProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1">
            <div className="container">
              <SidebarTrigger className="fixed top-4 left-4 z-50" />
              <Hero />
              <MarketMoodRing />
              <CryptoPulse />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AchievementsProvider>
  );
};

export default Index;