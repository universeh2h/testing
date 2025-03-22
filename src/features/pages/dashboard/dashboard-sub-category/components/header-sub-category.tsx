import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import { JSX, useState } from 'react';
import DialogSubCategory from './dialog-sub-category';

export function HeaderSubCategory({
  onSearchChange,
}: {
  onSearchChange: (term: string) => void;
}): JSX.Element {
  const [searchInput, setSearchInput] = useState('');

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    onSearchChange(searchInput);
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

        <DialogSubCategory>
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            <span className="hidden md:inline">Tambah</span>
          </Button>
        </DialogSubCategory>
      </div>
    </section>
  );
}
