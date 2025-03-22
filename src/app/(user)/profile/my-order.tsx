'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { JSX, useState } from 'react';
import { TableOrder } from './table-order';

export function MyOrder(): JSX.Element {
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [searchQuery, setSearchQuery] = useState('');

  
  return (
    <section className="py-10">
      <h3 className="text-2xl font-bold mb-4">Pesanan Saya</h3>
      <Card className="backdrop-blur-lg bg-gray-50/20 text-white">
        <CardHeader className="flex flex-col sm:flex-row w-full justify-between gap-4 ">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted">Show</p>
            <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted">entries</p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Input
              placeholder="Search..."
              className="pr-8 w-full sm:w-[250px] placeholder:text-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <TableOrder search={searchQuery}/>
        </CardContent>
      </Card>
    </section>
  );
}
