'use client';
import type { User } from '@/types/schema/user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { ButtonProfile } from './button-profile';
import Link from 'next/link';
import {
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Settings,
  UserPlus,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { URL_LOGO } from '@/constants';
import { Button } from './button';
import { usePathname } from 'next/navigation';

export function AuthDropdown({ user }: { user?: User }) {
  const pathname = usePathname();
  const trigger = user ? (
    <ButtonProfile username={user.username} />
  ) : (
    <Button
      size="sm"
      variant="outline"
      className="shadow-none text-white bg-orange-500 border-orange-500 border hover:text-orange-500 hover:border-white"
    >
      <LogIn className="mr-2 h-4 w-4" />
      <p>Login</p>
    </Button>
  );

  const content = user ? (
    <>
      <DropdownMenuLabel className="flex items-center space-x-2">
        <span>{user.name || user.username}</span>
      </DropdownMenuLabel>
      <DropdownMenuLabel className="text-xs text-muted-foreground">
        Role: {user.role}
      </DropdownMenuLabel>

      <DropdownMenuSeparator />
      {user.role === 'Admin' ? (
        <>
          {pathname === '/dashboard' ? (
            <DropdownMenuItem asChild>
              <Link href="/" className="cursor-pointer">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
          )}
        </>
      ) : (
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Pengaturan Profil
          </Link>
        </DropdownMenuItem>
      )}

      <DropdownMenuItem
        className="text-destructive cursor-pointer"
        onSelect={(e) => {
          e.preventDefault();
          signOut({ callbackUrl: '/' });
        }}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Keluar
      </DropdownMenuItem>
    </>
  ) : (
    <>
      <div className="flex justify-center w-full mb-4">
        <Image
          src={(URL_LOGO as string) || '/placeholder.svg?height=80&width=80'}
          height={80}
          width={80}
          alt="logo universeh2h"
          className="object-contain h-14 w-auto"
        />
      </div>
      <div className="flex flex-col space-y-2 w-full">
        <Link href={'/auth/login'}>
          <DropdownMenuItem className="w-full justify-start">
            <LogIn className="mr-2 h-4 w-4" />
            Masuk
          </DropdownMenuItem>
        </Link>
        <Link href={'/register'}>
          <DropdownMenuItem className="w-full justify-start">
            <UserPlus className="mr-2 h-4 w-4" />
            Daftar
          </DropdownMenuItem>
        </Link>
      </div>
    </>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2 z-50">
        {content}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
