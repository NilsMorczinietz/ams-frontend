import { ChevronsUpDown, LogOut, LogIn } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../auth/auth-config';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useEffect } from 'react';

export function NavUserLogin() {
  const { isMobile } = useSidebar();
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const user = useCurrentUser();

  const handleLoginRedirect = () => {
    void instance.loginRedirect(loginRequest);
  };

  const handleLogoutRedirect = () => {
    void instance.logoutRedirect();
  };

  useEffect(() => {
    console.log('Authentication status changed:', isAuthenticated);
    console.log('Current user data:', user);
    console.log('Current instance:', instance);
    console.log('Current accounts:', accounts);
  }, [isAuthenticated, user, instance, accounts]);

  if (!isAuthenticated || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleLoginRedirect}
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground h-12 justify-center px-4 py-3 font-medium group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!"
          >
            <LogIn />
            <span>Einloggen</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'top'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={handleLogoutRedirect}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
