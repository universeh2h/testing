'use client';

import type React from 'react';

import { useState } from 'react';
import { Search, Filter, X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import type { Layanan } from '@/types/layanans';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Category } from '@/types/category';

interface HeaderLayananProps {
  data: Layanan[];
  category: Category[];
  onSearchChange: (term: string) => void;
  onCategoryChange?: (id: string | undefined) => void;
  onSubCategoryChange?: (id: number | undefined) => void;
  onProviderChange?: (id: string | undefined) => void;
  onStatusChange?: (status: boolean | undefined) => void;
  onFlashSaleChange?: (isFlashSale: boolean | undefined) => void;
  onPriceRangeChange?: (
    min: number | undefined,
    max: number | undefined
  ) => void;
}

export function HeaderLayanan({
  onSearchChange,
  onCategoryChange,
  onSubCategoryChange,
  onProviderChange,
  onStatusChange,
  category,
  onFlashSaleChange,
}: HeaderLayananProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    flashSale?: string;
    category?: string;
  }>({});

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      onStatusChange?.(undefined);
      setActiveFilters((prev) => ({ ...prev, status: undefined }));
    } else {
      const isActive = value === 'active';
      onStatusChange?.(isActive);
      setActiveFilters((prev) => ({
        ...prev,
        status: isActive ? 'Aktif' : 'Tidak Aktif',
      }));
    }
  };

  const handleFlashSaleChange = (value: string) => {
    if (value === 'all') {
      onFlashSaleChange?.(undefined);
      setActiveFilters((prev) => ({ ...prev, flashSale: undefined }));
    } else {
      const isFlashSale = value === 'yes';
      onFlashSaleChange?.(isFlashSale);
      setActiveFilters((prev) => ({
        ...prev,
        flashSale: isFlashSale ? 'Ya' : 'Tidak',
      }));
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'all') {
      onCategoryChange?.(undefined);
      setActiveFilters((prev) => ({ ...prev, category: undefined }));
    } else {
      onCategoryChange?.(value);
      const selectedCategory = category.find(
        (cat) => cat.id.toString() === value
      );
      setActiveFilters((prev) => ({
        ...prev,
        category: selectedCategory ? selectedCategory.nama : value,
      }));
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    onSearchChange('');
    onCategoryChange?.(undefined);
    onSubCategoryChange?.(undefined);
    onProviderChange?.(undefined);
    onStatusChange?.(undefined);
    onFlashSaleChange?.(undefined);
    setActiveFilters({});
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Layanan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola semua layanan yang tersedia di platform
          </p>
        </div>
      </div>

      <Card className="overflow-hidden bg-card shadow-sm">
        <CardContent className="p-0">
          <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <div className="p-4">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari layanan..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <CollapsibleTrigger asChild>
                  <Button variant="outline" type="button" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </CollapsibleTrigger>

                <Button type="submit">Cari</Button>
              </form>
            </div>

            <CollapsibleContent>
              <div className="p-4">
                {activeFilterCount > 0 && (
                  <div className="mb-4">
                    <div className="mb-2 text-sm font-medium">
                      Filter Aktif:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.status && (
                        <Badge variant="secondary" className="gap-1">
                          Status: {activeFilters.status}
                          <button
                            onClick={() => handleStatusChange('all')}
                            className="ml-1 rounded-full hover:bg-muted"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {activeFilters.flashSale && (
                        <Badge variant="secondary" className="gap-1">
                          Flash Sale: {activeFilters.flashSale}
                          <button
                            onClick={() => handleFlashSaleChange('all')}
                            className="ml-1 rounded-full hover:bg-muted"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {activeFilters.category && (
                        <Badge variant="secondary" className="gap-1">
                          Kategori: {activeFilters.category}
                          <button
                            onClick={() => handleCategoryChange('all')}
                            className="ml-1 rounded-full hover:bg-muted"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="h-6 px-2 text-xs"
                      >
                        Reset semua
                      </Button>
                    </div>
                    <Separator className="my-4" />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Flash Sale Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Flash Sale</label>
                    <Select onValueChange={handleFlashSaleChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Flash Sale" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="yes">Flash Sale</SelectItem>
                        <SelectItem value="no">Bukan Flash Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kategori</label>
                    <Select onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {category &&
                          category.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.nama}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetFilters}
                  >
                    Reset Filter
                  </Button>
                  <Button type="button" onClick={() => setIsFilterOpen(false)}>
                    Terapkan Filter
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
