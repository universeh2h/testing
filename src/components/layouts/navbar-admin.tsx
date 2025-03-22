'use client';

import React, { ReactNode } from 'react';

import { User } from '@/types/schema/user';
import { useNavbarAdmin } from '@/hooks/use-navbar-admin';
import { dataNavAdmin } from '@/data/data-nav-admin';
import { DesktopSidebar } from './nav-desktop';
import { MobileHeader } from './navbar-admin-mobile';

interface NavbarAdminProps {
  user: User;
  children: ReactNode;
}

export const NavbarAdmin = ({ user, children }: NavbarAdminProps) => {
  const {
    openItems,
    isSidebarOpen,
    toggleItem,
    isActive,
    isChildActive,
    setIsSidebarOpen,
  } = useNavbarAdmin();

  return (
    <div className="relative">
      <DesktopSidebar
        navItems={dataNavAdmin}
        openItems={openItems}
        toggleItem={toggleItem}
        isActive={isActive}
        user={user}
        isChildActive={isChildActive}
      />

      <MobileHeader
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        openItems={openItems}
        toggleItem={toggleItem}
        isActive={isActive}
        isChildActive={isChildActive}
        user={user}
      />

      <main className="lg:pl-64 min-h-screen bg-backgorund">{children}</main>
    </div>
  );
};
