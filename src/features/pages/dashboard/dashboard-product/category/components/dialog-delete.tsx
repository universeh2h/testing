import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ReactNode } from 'react';
import { DeleteCategory } from './mutate';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function DialogDeleteCategory({
  children,
  id,
}: {
  children: ReactNode;
  id: number;
}) {
  const { refresh } = useRouter();
  const handleDelete = async () => {
    // Implement your delete logic here
    await DeleteCategory({ id });
    refresh();
    toast.success('Category deleted successfully');
    // You would typically call an API here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this category? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
          <Button variant="outline" className="mt-2 sm:mt-0">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
