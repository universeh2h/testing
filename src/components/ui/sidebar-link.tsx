import Link from 'next/link';
import { ReactNode } from 'react';

interface SidebarLinkProps {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function SidebarLink({
  href,
  icon,
  children,
}: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10 hover:text-orange-500 transition-colors"
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </Link>
  );
}
