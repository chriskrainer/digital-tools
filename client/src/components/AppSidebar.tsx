import { QrCode, LayoutGrid, Link } from "lucide-react";
import { useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <a href="/" className="flex items-start gap-3 hover-elevate active-elevate-2 rounded-lg p-2 -m-2" data-testid="link-logo">
          <div className="h-14 w-14 rounded-lg bg-primary flex items-center justify-center">
            <LayoutGrid className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-xs font-semibold text-muted-foreground tracking-wide pb-1" data-testid="text-dematic-brand">DEMATIC</div>
            <h1 className="text-lg font-bold" style={{ lineHeight: '1.1em' }} data-testid="text-app-title">Digital Tools</h1>
          </div>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Applications</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/dqm"}>
                  <a href="/dqm" data-testid="link-dqm">
                    <QrCode className="h-4 w-4" />
                    <span>QR Code Manager</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/utm-builder"}>
                  <a href="/utm-builder" data-testid="link-utm-builder">
                    <Link className="h-4 w-4" />
                    <span>UTM Builder</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
