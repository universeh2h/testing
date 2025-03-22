'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DepositsHeaderProps {
  search: string;
  onSearchChange: (term: string) => void;
  perPage: number;
  setPerPage: (page: number) => void;
  setPage: (page: number) => void;
}

export function DepositHeader({
  search,
  onSearchChange,
  perPage,
  setPerPage,
  setPage,
}: DepositsHeaderProps) {
  return (
    <section className="w-full">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by username..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={perPage.toString()}
            onValueChange={(value) => {
              setPerPage(Number(value));
              setPage(1); // Reset to first page when changing items per page
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
