'use client';
import { Button } from '@/components/ui/button';
import SidebarLink from '@/components/ui/sidebar-link';
import { URL_LOGO } from '@/constants';
import {
  ArrowDown,
  Calculator,
  Gamepad2,
  ListOrdered,
  LogOut,
  Search,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [openCalculator, setOpenCalculator] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        open
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, open]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full w-72 text-white shadow-lg z-50 transform bg-background transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-hidden={!open}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Image
              src={URL_LOGO as string}
              height={40}
              width={40}
              alt="logo vazzuniverse"
              className="object-contain h-8 w-auto"
            />
            <span className="font-semibold text-lg">VazzUniverse</span>
          </div>
          <Button
            onClick={onClose}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-auto py-4 ">
          <nav className="space-y-1 px-2 ">
            <SidebarLink href="/all" icon={<Gamepad2 className="h-4 w-4" />}>
              Semua Game
            </SidebarLink>
            <SidebarLink
              href="/daftar-harga"
              icon={<ListOrdered className="h-4 w-4" />}
            >
              Daftar Harga
            </SidebarLink>
            <SidebarLink href="/find" icon={<Search className="h-4 w-4" />}>
              Lacak Pesanan
            </SidebarLink>

            {/* Calculator Dropdown */}
            <div className="py-1">
              <button
                onClick={() => setOpenCalculator(!openCalculator)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10 hover:text-orange-500 transition-colors"
              >
                <div className="flex items-center">
                  <Calculator className="h-4 w-4 mr-3" />
                  <span>Calculator MLBB</span>
                </div>
                <ArrowDown
                  className={`h-4 w-4 transition-transform ${
                    openCalculator ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openCalculator && (
                <div className="mt-1 ml-7 space-y-1 border-l-2 pl-3">
                  <SidebarLink href="/calculator/winrate">WinRate</SidebarLink>
                  <SidebarLink href="/calculator/magic-wheel">
                    Magic Wheel
                  </SidebarLink>
                  <SidebarLink href="/calculator/zodiac">Zodiac</SidebarLink>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start bg-white text-black"
            size="sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </div>
      </div>
    </div>
  );
}
