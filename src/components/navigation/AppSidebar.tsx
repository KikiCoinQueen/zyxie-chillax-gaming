import { Brain, Activity, Search, Heart, ChevronRight, Home, LineChart, Rocket, Zap, BarChart3, Wallet, Settings, HelpCircle, TrendingUp, ChartLine } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainFeatures = [
  {
    title: "Market Overview",
    url: "/",
    icon: ChartLine,
    description: "Real-time market analysis"
  },
  {
    title: "Trading Analytics",
    url: "#market-analysis",
    icon: LineChart,
    description: "Advanced trading metrics"
  },
  {
    title: "Live Trading",
    url: "#trading",
    icon: Activity,
    description: "Real-time trading data"
  },
  {
    title: "Token Discovery",
    url: "#discovery",
    icon: Search,
    description: "Find new opportunities"
  },
];

const tradingFeatures = [
  {
    title: "Portfolio Tracker",
    url: "#portfolio",
    icon: Wallet,
    description: "Track your investments"
  },
  {
    title: "Trending Pairs",
    url: "#hot-pairs",
    icon: Zap,
    description: "Hot trading pairs"
  },
  {
    title: "Market Scanner",
    url: "#scanner",
    icon: Rocket,
    description: "Find market opportunities"
  },
  {
    title: "Analytics Hub",
    url: "#stats",
    icon: BarChart3,
    description: "Detailed market stats"
  },
];

const aiFeatures = [
  {
    title: "AI Predictions",
    url: "#predictions",
    icon: Brain,
    description: "Market predictions"
  },
  {
    title: "Sentiment Analysis",
    url: "#sentiment",
    icon: Heart,
    description: "Market sentiment"
  },
];

const bottomFeatures = [
  {
    title: "Settings",
    url: "#settings",
    icon: Settings,
  },
  {
    title: "Support",
    url: "#help",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-white/5 bg-card/30 backdrop-blur-xl">
      <SidebarContent className="pt-16">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainFeatures.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors group relative">
                      <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div className="flex flex-col">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">{item.title}</span>
                        <span className="text-xs text-muted-foreground/70">{item.description}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-primary transition-all" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Trading Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tradingFeatures.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors group relative">
                      <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div className="flex flex-col">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">{item.title}</span>
                        <span className="text-xs text-muted-foreground/70">{item.description}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-primary transition-all" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>AI Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aiFeatures.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors group relative">
                      <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div className="flex flex-col">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">{item.title}</span>
                        <span className="text-xs text-muted-foreground/70">{item.description}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-primary transition-all" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {bottomFeatures.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors group">
                        <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}