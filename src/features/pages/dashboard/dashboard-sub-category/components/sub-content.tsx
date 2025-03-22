import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { SubCategories } from '@/types/category';
import { getStatusBadge } from '@/utils/getStatusActive';
import { Pencil, Trash2 } from 'lucide-react';
import DialogSubCategory, {
  DialogSubDeleteCategory,
} from './dialog-sub-category';

export default function SubContent({ data }: { data: SubCategories[] }) {
  console.log(data)
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">Nama</TableHead>
          <TableHead className="w-[100px]">Code</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead className="w-[120px] text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{category.code}</Badge>
            </TableCell>
            <TableCell>
              {getStatusBadge(category.active ? 'active' : 'unactive')}
            </TableCell>

            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <DialogSubCategory initialData={category}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </DialogSubCategory>
                <DialogSubDeleteCategory id={category.id}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </DialogSubDeleteCategory>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
