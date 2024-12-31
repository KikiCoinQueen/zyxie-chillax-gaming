import { Brain, Activity, Search, Heart, ChevronRight, Home, LineChart, Rocket, Zap, BarChart3, Wallet } from "lucide-react";
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
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Market Analysis",
    url: "#market-analysis",
    icon: LineChart,
  },
  {
    title: "Live Trading",
    url: "#trading",
    icon: Activity,
  },
  {
    title: "Discovery",
    url: "#discovery",
    icon: Search,
  },
];

const tradingFeatures = [
  {
    title: "Portfolio",
    url: "#portfolio",
    icon: Wallet,
  },
  {
    title: "Hot Pairs",
    url: "#hot-pairs",
    icon: Zap,
  },
  {
    title: "Market Scanner",
    url: "#scanner",
    icon: Rocket,
  },
  {
    title: "Statistics",
    url: "#stats",
    icon: BarChart3,
  },
];

const aiFeatures = [
  {
    title: "AI Predictions",
    url: "#predictions",
    icon: Brain,
  },
  {
    title: "Sentiment",
    url: "#sentiment",
    icon: Heart,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="pt-16">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainFeatures.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
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
                    <a href={item.url} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
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
                    <a href={item.url} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}