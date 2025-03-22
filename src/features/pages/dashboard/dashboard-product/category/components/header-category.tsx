import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DialogCreateCategory } from './dialog-category';

export function HeaderCategory({
  onSearchChange,
  onTypeChange,
  onStatusChange,
}: {
  onSearchChange: (term: string) => void;
  onTypeChange: (type: string | undefined) => void;
  onStatusChange: (status: string | undefined) => void;
}) {
  const [searchInput, setSearchInput] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string | undefined>(
    undefined
  );
  const [activeStatusFilter, setActiveStatusFilter] = useState<
    string | undefined
  >(undefined);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    onSearchChange(searchInput);
  };

  // Handle type filter selection
  const handleTypeSelect = (type: string | undefined) => {
    setActiveTypeFilter(type);
    onTypeChange(type);
  };

  // Handle status filter selection
  const handleStatusSelect = (status: string | undefined) => {
    setActiveStatusFilter(status);
    onStatusChange(status);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    onSearchChange('');
  };

  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 mb-6">
      <h1 className="text-2xl font-bold text-card-foreground">Kategori</h1>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
        {/* Search input with button */}
        <div className="relative w-full md:w-auto flex items-center">
          <Input
            placeholder="Cari kategori..."
            value={searchInput}
            onChange={handleSearchChange}
            className="pr-8 w-full"
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-10 text-gray-500 hover:text-gray-700"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1"
            onClick={handleSearchSubmit}
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Type filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={activeTypeFilter ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <FilterIcon className="h-4 w-4" />
              <span>{activeTypeFilter || 'Tipe'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleTypeSelect(undefined)}>
              Semua Tipe
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTypeSelect('gamelainnya')}>
              Game
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTypeSelect('voucher')}>
              voucher
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTypeSelect('pulsa')}>
              pulsa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={activeStatusFilter ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <FilterIcon className="h-4 w-4" />
              <span>{activeStatusFilter || 'Status'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusSelect(undefined)}>
              Semua Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect('active')}>
              Aktif
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect('unactive')}>
              Nonaktif
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect('draft')}>
              Draft
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogCreateCategory>
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />

            <span className="hidden md:inline">Tambah Kategori</span>
          </Button>
        </DialogCreateCategory>
      </div>
    </section>
  );
}
