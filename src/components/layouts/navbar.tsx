'use client';
import { Button } from '@/components/ui/button';
import { URL_LOGO } from '@/constants';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Sidebar } from './sidebar';
import { User } from '@/types/schema/user';
import { AuthDropdown } from '../ui/auth-dropodown';

export function Navbar({ user }: { user?: User }) {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  return (
    <>
      <nav className="w-full h-16 px-4 py-3 backdrop-blur-sm sticky top-0 left-0 z-40 text-white">
        <div className="flex items-center justify-between max-w-7xl mx-auto h-full">
          <div className="flex items-center space-x-3">
            {/* hamburger */}
            <Button
              onClick={() => setOpenSidebar(true)}
              className="bg-transparent shadow-none text-white hover:bg-transparent hover:text-primary"
              size="sm"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* image */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={
                  (URL_LOGO as string) ||
                  '/placeholder.svg?height=100&width=100'
                }
                height={100}
                width={100}
                alt="logo vazzuniverse"
                className="object-contain h-10 w-auto"
              />
              <h1 className="text-xs italic md:text-lg font-medium">
                Tempat Top up terpercaya se-universe
              </h1>
            </Link>
          </div>
          <AuthDropdown user={user} />
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar open={openSidebar} onClose={() => setOpenSidebar(false)} />

      {/* Backdrop for sidebar */}
      {openSidebar && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setOpenSidebar(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
