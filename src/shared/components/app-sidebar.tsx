'use client';

import * as React from 'react';
import { House, MapPin, Briefcase } from 'lucide-react';
import { NavMenu } from '@shared/components/nav-menu';
import { NavUserLogin } from '@shared/components/nav-user-login';
import { NavHeader } from '@shared/components/nav-header';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@shared/components/ui/sidebar';

const data = {
  items: [
    {
      name: 'Home',
      url: '/',
      icon: House,
    },
    {
      name: 'Standorte',
      url: '/standorte',
      icon: MapPin,
    },
    {
      name: 'Lehrgänge',
      url: '/lehrgänge',
      icon: Briefcase,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMenu items={data.items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUserLogin />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
