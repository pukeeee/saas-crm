"use client";

import * as React from "react";

// import { NavMain } from "./NavMain";
import { NavProjects } from "./NavProjects";
import { NavUser } from "./NavUser";
import { TeamSwitcher } from "./WorkspaceSwitcher";
import { ThemeToggle } from "@/widgets/theme/ui/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared/components/ui/sidebar";
import { data } from "../config";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.main} />
        {/*<NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />*/}
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
