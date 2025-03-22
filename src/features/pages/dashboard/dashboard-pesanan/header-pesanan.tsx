import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DownloadIcon, FilterIcon, SearchIcon, XIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Transaction, TransactionPesanan } from '@/types/transaction';
import { exportToExcel } from '@/data/export/all-pesanan';

export function HeaderPesanan({
  onSearchChange,
  onStatusChange,
  data
}: {
  onSearchChange: (term: string) => void;
  onStatusChange: (status: 'PAID' | 'PENDING' | 'FAILED' | "SUCCESS" | undefined) => void;
  data : TransactionPesanan[]  | undefined
}) {
  const [searchInput, setSearchInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | undefined>(
    undefined
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    onSearchChange(searchInput);
  };

  // Handle filter selection
  const handleFilterSelect = (
    status: 'PAID' | 'PENDING' | 'FAILED' | "SUCCESS" | undefined
  ) => {
    setActiveFilter(status);
    onStatusChange(status);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    onSearchChange('');
  };

  const handleExportClick = () => {
    if (data && data.length > 0) {
      exportToExcel({ data });
    } else {
      console.warn("Tidak ada data untuk diekspor.");
    }
  };

  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 mb-6">
      <h1 className="text-2xl font-bold text-card-foreground">Pesanan</h1>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
        {/* Search input with button */}
        <div className="relative w-full md:w-auto flex items-center">
          <Input
            placeholder="Cari pesanan..."
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

        {/* Filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={activeFilter ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <FilterIcon className="h-4 w-4" />
              <span>{activeFilter || 'Filter'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleFilterSelect('PAID')}>
              PAID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterSelect('PENDING')}>
              PENDING
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterSelect('SUCCESS')}>
              SUCCESS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterSelect('FAILED')}>
              FAILED
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterSelect(undefined)}>
              Show All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export button */}
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleExportClick}>
          <DownloadIcon className="h-4 w-4" />
          <span className="hidden md:inline">Export</span>
        </Button>
      </div>
    </section>
  );
}
