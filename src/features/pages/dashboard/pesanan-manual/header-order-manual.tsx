'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Search, Filter, X, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/utils/trpc';
import { DialogOrderManual } from './dialog-order';
import type { Category } from '@/types/category';
import { cn } from '@/lib/utils';
import { getServerData } from '@/data/data-server-region';

interface HeaderOrderManualProps {
  onChange: (term: string) => void;
  onStatusChange: (status: 'PAID' | 'PENDING' | 'FAILED' | undefined) => void;
  statusFilter: 'PAID' | 'PENDING' | 'FAILED' | undefined;
}

export function HeaderOrderManual({
  onChange,
  onStatusChange,
  statusFilter,
}: HeaderOrderManualProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check viewport width on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch categories data
  const { data: categoriesData } = trpc.main.getCategories.useQuery({
    fields: ['id', 'nama', 'kode', 'placeholder1', 'placeholder2'],
  });

  
  // Filter options
  const filterOptions = {
    status: ['PAID', 'PENDING', 'FAILED'],
    date: ['Today', 'This Week', 'This Month', 'Last Month'],
    price: ['Under $50', '$50 - $100', '$100 - $200', 'Over $200'],
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      onChange('');
    }
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    onChange(searchTerm);
  };

  // Handle status filter change
  const handleStatusChange = (status: 'PAID' | 'PENDING' | 'FAILED') => {
    onStatusChange(statusFilter === status ? undefined : status);
  };

  // Toggle general filters
  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
    ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
    onStatusChange(undefined);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    onChange('');
  };
  
  return (
    <section className="w-full space-y-4 bg-card rounded-lg p-4 shadow-sm border">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-9 pr-10 h-10 bg-background focus-visible:ring-primary"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-muted"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'flex gap-2 h-10 bg-background hover:bg-muted',
                  statusFilter && 'border-primary text-primary'
                )}
              >
                <Filter className="h-4 w-4" />
                <span>Status</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filterOptions.status.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter === status}
                  onCheckedChange={() =>
                    handleStatusChange(status as 'PAID' | 'PENDING' | 'FAILED')
                  }
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'flex gap-2 h-10 bg-background hover:bg-muted',
                  activeFilters.some((f) => filterOptions.date.includes(f)) &&
                    'border-primary text-primary'
                )}
              >
                <Filter className="h-4 w-4" />
                <span>Date</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filterOptions.date.map((date) => (
                <DropdownMenuCheckboxItem
                  key={date}
                  checked={activeFilters.includes(date)}
                  onCheckedChange={() => toggleFilter(date)}
                >
                  {date}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Price Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'flex gap-2 h-10 bg-background hover:bg-muted',
                  activeFilters.some((f) => filterOptions.price.includes(f)) &&
                    'border-primary text-primary'
                )}
              >
                <Filter className="h-4 w-4" />
                <span>Price</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Price</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filterOptions.price.map((price) => (
                <DropdownMenuCheckboxItem
                  key={price}
                  checked={activeFilters.includes(price)}
                  onCheckedChange={() => toggleFilter(price)}
                >
                  {price}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters Button */}
          {(activeFilters.length > 0 || statusFilter) && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="flex gap-2 h-10 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
              <span>Clear All</span>
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 flex-1">
          {/* Status Filter Badge */}
          {statusFilter && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/15 text-primary"
            >
              {statusFilter}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1 rounded-full hover:bg-primary/20"
                onClick={() => onStatusChange(undefined)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {statusFilter} filter</span>
              </Button>
            </Badge>
          )}

          {/* Other Active Filters Badges */}
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/15 text-primary"
            >
              {filter}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1 rounded-full hover:bg-primary/20"
                onClick={() => toggleFilter(filter)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {filter} filter</span>
              </Button>
            </Badge>
          ))}

          {/* Create Order Button */}
          <div
            className={cn(
              'ml-auto',
              !statusFilter &&
                activeFilters.length === 0 &&
                'w-full flex justify-end'
            )}
          >
            <DialogOrderManual data={categoriesData?.data as Category[]}>
              <Button className="gap-2 h-10 bg-primary hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4" />
                <span>{isMobile ? 'New' : 'Create Order'}</span>
              </Button>
            </DialogOrderManual>
          </div>
        </div>
      </div>
    </section>
  );
}
