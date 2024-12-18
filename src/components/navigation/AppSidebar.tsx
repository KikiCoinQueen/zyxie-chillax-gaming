import { Home, Construction, Activity, Brain, Heart, Search, ChevronRight } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const workingFeatures = [
  {
    title: "Market Mood Ring",
    url: "#market-mood",
    icon: Brain,
  },
  {
    title: "Crypto Pulse",
    url: "#crypto-pulse",
    icon: Activity,
  },
]

const underConstruction = [
  {
    title: "Token Discovery",
    url: "#discovery",
    icon: Search,
  },
  {
    title: "Meme Analyzer",
    url: "#analyzer",
    icon: Heart,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Working Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workingFeatures.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
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
          <SidebarGroupLabel>Under Construction</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {underConstruction.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      <Construction className="w-4 h-4 ml-auto text-yellow-500" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}