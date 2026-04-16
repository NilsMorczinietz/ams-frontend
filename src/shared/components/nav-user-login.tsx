import { ChevronsUpDown, LogOut, LogIn } from 'lucide-react';
import { Avatar, AvatarFallback } from '@shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@shared/components/ui/sidebar';
import { useAuth } from '@features/auth/hooks/auth-context';
import { useCurrentUser } from '@shared/hooks/useCurrentUser';

export function NavUserLogin() {
  const { isMobile } = useSidebar();
  const { isAuthenticated, isInitialized, login, logout } = useAuth();
  const user = useCurrentUser();

  const handleLoginRedirect = () => {
    void login();
  };

  const handleLogoutRedirect = () => {
    void logout();
  };

  if (!isInitialized || !isAuthenticated || !user) {
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
