// MobileHeader.tsx
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import Link from 'next/link';
import { dataNavAdmin } from '@/data/data-nav-admin';
import { User } from '@/types/schema/user';

import { NavItems } from '@/types/schema/navbar';
import { ButtonProfile } from '../ui/button-profile';
import { NavItem } from '../../../../vazzuniverse/src/components/ui/nav-item';
import { AuthDropdown } from '../ui/auth-dropodown';

interface MobileHeaderProps {
  user: User;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  openItems: Record<string, boolean>;
  toggleItem: (name: string) => void;
  isActive: (path?: string) => boolean;
  isChildActive: (children?: NavItems[]) => boolean;
}

export const MobileHeader = ({
  user,
  isSidebarOpen,
  setIsSidebarOpen,
  openItems,
  toggleItem,
  isActive,
  isChildActive,
}: MobileHeaderProps) => (
  <div className="flex lg:hidden h-14 items-center justify-between border-b px-4 sticky top-0 z-30  bg-background        ">
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64  ">
        <SheetHeader className="flex h-14 items-center border-b px-4">
          <SheetTitle>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <ButtonProfile username="Admin Panel" />
              <span>Admin Panel</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4 px-3">
          <nav className="space-y-1">
            {dataNavAdmin.map((item) => (
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

        <div
          className="border-t p-4 space-x-4
"
        >
          <AuthDropdown user={user} />
          <span className="text-black">Admin Panel</span>
        </div>
      </SheetContent>
    </Sheet>

    <Link
      href="/dashboard"
      className="flex items-center gap-2 font-semibold md:hidden"
    >
      <ButtonProfile username="Admin Panel" />
      <span>Admin Panel</span>
    </Link>
  </div>
);
