// components/header-invoices.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';

export function HeaderInvoices() {
  return (
    <header className="py-4 border-b border-[#1a3665] bg-[#001c4d]">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-200 hover:bg-blue-900 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back to Home
            </Button>
          </Link>
          <h1 className="text-xl font-bold hidden md:block text-white">
            Payment Invoice
          </h1>
        </div>
        <div className="flex items-center">
          <Link href="/help">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-200 hover:bg-blue-900 hover:text-white flex items-center gap-2"
            >
              <HelpCircle size={16} /> Help
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
