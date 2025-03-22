import Link from 'next/link';

import type { NavItems } from '@/types/schema/navbar';
import type { User } from '@/types/schema/user';
import { ButtonProfile } from '../ui/button-profile';
import { NavItem } from '../../../../vazzuniverse/src/components/ui/nav-item';
import { AuthDropdown } from '../ui/auth-dropodown';

interface DesktopSidebarProps {
  navItems: NavItems[];
  user: User;
  openItems: Record<string, boolean>;
  toggleItem: (name: string) => void;
  isActive: (path?: string) => boolean;
  isChildActive: (children?: NavItems[]) => boolean;
}

export const DesktopSidebar = ({
  navItems,
  openItems,
  toggleItem,
  user,
  isActive,
  isChildActive,
}: DesktopSidebarProps) => (
  <div className="hidden lg:flex h-screen w-64 flex-col bg-sidebar fixed left-0 top-0 border-r border-r-sidebar-border z-30">
    {/* Branding */}
    <Link
      href="/dashboard"
      className="flex items-center gap-2 font-semibold p-4 border-b border-b-sidebar-border text-sidebar-foreground"
    >
      <ButtonProfile username="Admin Panel" />
      <span>Admin Panel</span>
    </Link>

    {/* Navigation */}
    <div className="flex-1 overflow-auto py-4 px-3">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.nama}
            item={item}
            openItems={openItems}
            toggleItem={toggleItem}
            isActive={isActive}
            isChildActive={isChildActive}
          />
        ))}
      </nav>
    </div>

    {/* Footer */}
    <div className="border-t border-t-sidebar-border p-4 flex items-center gap-2 text-sidebar-foreground">
      <AuthDropdown user={user} />
      <span className="text-secondary">{user.username}</span>
    </div>
  </div>
);
