import { Home, Layout, Database, Eye, Shield, Settings, Layers, FolderOpen, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const publicNavigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Builder", url: "/builder", icon: Layout },
  { title: "Preview", url: "/preview", icon: Eye },
];

const privateNavigationItems = [
  { title: "Projects", url: "/projects", icon: FolderOpen },
  { title: "Builder", url: "/builder", icon: Layout },
  { title: "Data", url: "/data", icon: Database },
  { title: "Preview", url: "/preview", icon: Eye },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, signOut } = useAuth();

  const navigationItems = user ? privateNavigationItems : publicNavigationItems;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-elegant" 
      : "hover:bg-sidebar-accent/50 transition-smooth";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Layers className="h-4 w-4 text-white" />
            </div>
                         {!collapsed && (
               <div>
                 <h1 className="text-lg font-bold text-sidebar-foreground">Visual Builder</h1>
                 <p className="text-xs text-sidebar-foreground/60">AI-Powered Creator</p>
               </div>
             )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavLink to={item.url} end className={getNavCls}>
                            <item.icon className="h-4 w-4" />
                          </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <NavLink to={item.url} end className={getNavCls}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {user && (
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!collapsed && "Sign Out"}
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}