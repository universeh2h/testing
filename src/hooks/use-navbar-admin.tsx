import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/data/data-nav-admin';
import { NavbarState } from '@/types/schema/navbar';

export const useNavbarAdmin = (): NavbarState & {
  toggleItem: (name: string) => void;
  isActive: (path?: string) => boolean;
  isChildActive: (children?: NavItem[]) => boolean;
} => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleItem = (name: string) => {
    setOpenItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isActive = (path?: string): boolean => {
    if (!path) return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const isChildActive = (children?: NavItem[]): boolean => {
    return children?.some((child) => isActive(child.path)) ?? false;
  };

  return {
    openItems,
    isSidebarOpen,
    toggleItem,
    setIsSidebarOpen,
    isActive,
    isChildActive,
  };
};
