'use client';

import * as React from 'react';
import {
  House,
  MapPin,
  Briefcase,
  Tag,
  MonitorCog,
  LifeBuoy,
  Megaphone,
  Sun,
  ClipboardList,
} from 'lucide-react';
import { NavCoreData } from '@/shared/components/nav-coreData';
import { NavUserLogin } from '@shared/components/nav-user-login';
import { NavHeader } from '@shared/components/nav-header';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@shared/components/ui/sidebar';
import { NavInformation } from '@/shared/components/nav-information';
import { NavMain } from './nav-main';
import { NavSettings } from './nav-settings';

const data = {
  main: [
    {
      name: 'Home',
      url: '/',
      icon: House,
    },
  ],
  coreData: [
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
    {
      name: 'Dienstgrade',
      url: '/dienstgrade',
      icon: Tag,
    },
    {
      name: 'Beförderungsregeln',
      url: '/beförderungsregeln',
      icon: MonitorCog,
    },
    {
      name: 'Umfragen',
      url: '/umfragen',
      icon: ClipboardList,
    },
  ],
  information: [
    {
      name: 'Hilfe und Dokumentation',
      url: '#',
      icon: LifeBuoy,
    },
    {
      name: 'Release Notes',
      url: '#',
      icon: Megaphone,
    },
  ],
  settings: [
    {
      name: 'Light/Dark',
      url: '#',
      icon: Sun,
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
        <NavMain items={data.main} />
        <NavCoreData items={data.coreData} />
        <div className="mt-auto">
          <NavInformation items={data.information} />
          <NavSettings items={data.settings} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUserLogin />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
