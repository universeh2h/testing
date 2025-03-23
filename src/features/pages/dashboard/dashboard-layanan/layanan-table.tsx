import type { LayananWithCategoryAndSub } from '@/types/layanans';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Edit, MoreVertical, Trash2, Eye } from 'lucide-react';
import { FormatPrice } from '@/utils/formatPrice';
import DialogDetailLayanan from './dialog-show-layanan';
import { DialogEditLayanan } from './dialog-edit-layanan';

interface LayananTableProps {
  data: LayananWithCategoryAndSub[];
}

export function LayananTable({ data }: LayananTableProps) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nama Layanan</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Flash Sale</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((layanan) => (
            <TableRow key={layanan.id}>
              <TableCell className="font-medium">{layanan.id}</TableCell>
              <TableCell>
                <div className="font-medium">{layanan.layanan}</div>
                <div className="text-sm text-muted-foreground">
                  {layanan.provider}
                </div>
              </TableCell>
              <TableCell>
                {layanan.category?.nama}
                {layanan.subCategory && (
                  <div className="text-sm text-muted-foreground">
                    {layanan.subCategory.name}
                  </div>
                )}
              </TableCell>
              <TableCell>{FormatPrice(layanan.harga)}</TableCell>
              <TableCell>
                <Badge variant={layanan.status ? 'default' : 'destructive'}>
                  {layanan.status ? 'active' : 'unactive'}
                </Badge>
              </TableCell>
              <TableCell>
                {layanan.isFlashSale ? (
                  <Badge>Flash Sale</Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DialogDetailLayanan layanan={layanan}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                    </DialogDetailLayanan>
                    <DialogEditLayanan layanan={layanan}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Layanan
                      </DropdownMenuItem>
                    </DialogEditLayanan>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus Layanan
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
