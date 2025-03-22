import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FormSubCategory,
  FormValuesSubCategory,
} from '@/types/schema/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trpc } from '@/utils/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface DialogSubCategoryProps {
  children: ReactNode;
  initialData?: FormValuesSubCategory & { id: number };
  onSuccess?: () => void;
}

export default function DialogSubCategory({
  children,
  initialData,
  onSuccess,
}: DialogSubCategoryProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  // Get categories for the dropdown
  const { data: categories } = trpc.sub.getCategories.useQuery();

  const form = useForm<FormValuesSubCategory>({
    resolver: zodResolver(FormSubCategory),
    defaultValues: initialData || {
      active: false,
      code: '',
      name: '',
      categoryId: undefined,
    },
  });

  const { mutate: createSubCategory } = trpc.sub.createCategories.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['sub', 'getSubAll']] });
      toast.success('Sub category created successfully');
      onSuccess?.();
      form.reset();
      setOpen(false);
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create sub category');
      setIsSubmitting(false);
    },
  });

  const { mutate: updateSubCategory } = trpc.sub.updateSub.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['sub', 'getSubAll']] });
      toast.success('Sub category updated successfully');
      onSuccess?.();
      setOpen(false);
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update sub category');
      setIsSubmitting(false);
    },
  });

  function onSubmit() {
    setIsSubmitting(true);
    const values = form.getValues();

    if (isEditing && initialData) {
      updateSubCategory({
        id: initialData.id,
        data: values,
      });
    } else {
      createSubCategory(values);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Sub Category' : 'Create Sub Category'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              placeholder="Enter code"
              {...form.register('code')}
            />
            {form.formState.errors.code && (
              <p className="text-sm text-red-500">
                {form.formState.errors.code.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter name"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Add Categories Select Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) =>
                form.setValue('categoryId', Number(value))
              }
              defaultValue={initialData?.categoryId.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="max-h-40">
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.categoryId && (
              <p className="text-sm text-red-500">
                {form.formState.errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) =>
                form.setValue('active', value === 'active')
              }
              defaultValue={form.getValues('active') ? 'active' : 'inactive'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
              {isEditing
                ? isSubmitting
                  ? 'Updating...'
                  : 'Update'
                : isSubmitting
                ? 'Creating...'
                : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DialogSubDeleteCategory({
  children,
  id,
}: {
  children: ReactNode;
  id: number;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutate, isLoading : isPending } = trpc.sub.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['sub', 'getSubAll']] });
      toast.success('Sub category created successfully');
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create sub category');
    },
  });
  const handleDelete = async () => {
    mutate({ id });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete SubCategory </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this sub category? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
          <Button variant="outline" className="mt-2 sm:mt-0">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            {isPending ? 'laoding...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
