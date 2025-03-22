'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormCategory, FormValuesCategory } from '@/types/schema/categories';
import { ButtonUploadImage } from '@/components/ui/button-upload-image';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Category } from '@/types/category';
import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function DialogCreateCategory({
  children,
  req,
}: {
  children: ReactNode;
  req?: Category;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState({
    isSubmitting: false,
    thumbnailLoading: false,
    bannerLoading: false,
  });

  // Destructure for easier access
  const { isSubmitting } = loadingState;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValuesCategory>({
    resolver: zodResolver(FormCategory),
    defaultValues: {
      name: req?.name || '',
      subName: req?.subName || '',
      brand: req?.brand || '',
      kode: req?.kode || '',
      serverId: req?.serverId || 0,
      status: req?.status || '',
      thumbnail: req?.thumbnail ?? '',
      type: req?.type ?? '',
      instruction: req?.instruction ?? '',
      ketLayanan: req?.ketLayanan ?? '',
      ketId: req?.ketId ?? '',
      placeholder1: req?.placeholder1 ?? '',
      placeholder2: req?.placeholder2 ?? '',
      bannerLayanan: req?.bannerLayanan ?? '',
    },
  });

  // Get current values
  const thumbnailUrl = watch('thumbnail');
  const bannerLayananUrl = watch('bannerLayanan');

  // Improved thumbnail upload handler
  const handleThumbnailUpload = async (file: File, type: string) => {
    if (!file) return;

    if (type === 'thumbnail') {
      setLoadingState((prev) => ({ ...prev, thumbnailLoading: true }));
    } else {
      setLoadingState((prev) => ({ ...prev, bannerLoading: false }));
    }

    try {
      const imageUrl = await uploadToCloudinary(file);
      if (type === 'thumbnail') {
        setValue('thumbnail', imageUrl);
      } else {
        setValue('bannerLayanan', imageUrl);
      }
      // Optional: Show success notification
    } catch (error) {
      toast.error(`Error uploading ${type}: ${error}`);
      // Show error notification here
    } finally {
      if (type === 'thumbnail') {
        setLoadingState((prev) => ({ ...prev, thumbnailLoading: false }));
      } else {
        setLoadingState((prev) => ({ ...prev, bannerLoading: false }));
      }
    }
  };

  // Inside your component:
  const queryClient = useQueryClient();

  // Configure your mutations with proper invalidation
  const { mutate: create } = trpc.main.createCategory.useMutation({
    onMutate: async (newCategory) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({
        queryKey: [['main', 'getCategoriesAll']],
      });

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData([
        ['main', 'getCategoriesAll'],
      ]);

      // Optimistically update the cache
      queryClient.setQueryData(
        [['main', 'getCategoriesAll']],
        (old: { data: Category[] }) => {
          return {
            ...old,
            data: [...(old?.data || []), { ...newCategory, id: Date.now() }],
          };
        }
      );

      setLoadingState((prev) => ({ ...prev, isSubmitting: true }));

      // Return the snapshotted value
      return { previousCategories };
    },
    onSuccess: () => {
      toast.success('Category created successfully');
      reset();
      setOpen(false);
    },
    onError: (err, newCategory, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCategories) {
        queryClient.setQueryData(
          [['main', 'getCategoriesAll']],
          context.previousCategories
        );
      }
      toast.error(`Error creating category: ${err.message}`);
    },
    onSettled: () => {
      // Always refetch after error or success to sync with server state
      queryClient.invalidateQueries({
        queryKey: [['main', 'getCategoriesAll']],
      });
      setLoadingState((prev) => ({ ...prev, isSubmitting: false }));
    },
  });

  const { mutate: update } = trpc.main.updateCategory.useMutation({
    onMutate: async ({ data: categoryData, id }) => {
      // Use the exact query key format with params
      const queryKey = [['main', 'getCategoriesAll']];

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update the cache
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(queryKey, (old: any) => {
        // Check if old exists and has the right structure
        if (!old) return previousData;

        return {
          ...old,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: old.data.map((item: any) =>
            item.id === id ? { ...item, ...categoryData } : item
          ),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      toast.success('Category updated successfully');
      reset();
      setOpen(false);
    },
    onError: (err, variables, context) => {
      // If the mutation fails, revert to the previous state
      if (context?.previousData) {
        const queryKey = [['main', 'getCategoriesAll']];
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error(`Error updating category: ${err.message}`);
    },
    onSettled: () => {
      // Always refetch after error or success to sync with server state
      queryClient.invalidateQueries({
        queryKey: [['main', 'getCategoriesAll']],
      });
    },
  });

  // Simplified form submission handler with callback
  const onSubmit = async (data: FormValuesCategory) => {
    if (req) {
      update({ data: data, id: req.id });
      refreshData();
    } else {
      create(data);
      refreshData();
    }
  };

  // If you need to manually trigger a refresh from somewhere else
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Kategori Baru</DialogTitle>
          <DialogDescription>
            Isi form berikut untuk menambahkan kategori baru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
              <TabsTrigger value="display">Tampilan</TabsTrigger>
              <TabsTrigger value="additional">Informasi Tambahan</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Kategori</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama kategori"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subName">Sub Nama</Label>
                  <Input
                    id="subName"
                    placeholder="Masukkan sub nama"
                    {...register('subName')}
                  />
                  {errors.subName && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.subName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    placeholder="Masukkan brand"
                    {...register('brand')}
                  />
                  {errors.brand && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.brand.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kode">Kode</Label>
                  <Input
                    id="kode"
                    placeholder="Masukkan kode (opsional)"
                    {...register('kode')}
                  />
                  {errors.kode && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.kode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe</Label>
                  <Select
                    onValueChange={(value) => setValue('type', value)}
                    value={watch('type')}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Pilih tipe kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gamelainnya">Game</SelectItem>
                      <SelectItem value="voucher">Voucher</SelectItem>
                      <SelectItem value="pulsa">Pulsa</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    onValueChange={(value) => setValue('status', value)}
                    value={watch('status')}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="unactive">Nonaktif</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serverId">Server ID</Label>
                <Input id="serverId" type="number" {...register('serverId')} />
                {errors.serverId && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.serverId.message}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Display Tab */}
            <TabsContent value="display" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <div className="mt-2">
                  <ButtonUploadImage
                    type="thumbnail"
                    imageUrl={thumbnailUrl}
                    className="w-64 h-64"
                    onUpload={handleThumbnailUpload}
                  />
                </div>
                <Input
                  id="thumbnail"
                  placeholder="Masukkan URL thumbnail"
                  {...register('thumbnail')}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground">
                  URL gambar thumbnail untuk kategori ini. Pilih gambar atau
                  masukkan URL secara manual.
                </p>
                {errors.thumbnail && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.thumbnail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bannerLayanan">Banner Layanan</Label>
                <div className="mt-2">
                  <ButtonUploadImage
                    type="banner"
                    imageUrl={bannerLayananUrl}
                    onUpload={handleThumbnailUpload}
                  />
                </div>
                <Input
                  id="bannerLayanan"
                  placeholder="Masukkan URL banner"
                  {...register('bannerLayanan')}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground">
                  URL gambar banner untuk halaman layanan. Pilih gambar atau
                  masukkan URL secara manual.
                </p>
                {errors.bannerLayanan && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.bannerLayanan.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="placeholder1">Placeholder 1</Label>
                  <Input
                    id="placeholder1"
                    placeholder="Masukkan placeholder 1"
                    {...register('placeholder1')}
                  />
                  {errors.placeholder1 && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.placeholder1.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placeholder2">Placeholder 2</Label>
                  <Input
                    id="placeholder2"
                    placeholder="Masukkan placeholder 2"
                    {...register('placeholder2')}
                  />
                  {errors.placeholder2 && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.placeholder2.message}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Additional Information Tab */}
            <TabsContent value="additional" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="instruction">Petunjuk</Label>
                <Textarea
                  id="instruction"
                  placeholder="Masukkan petunjuk penggunaan (opsional)"
                  className="min-h-[100px]"
                  {...register('instruction')}
                />
                {errors.instruction && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.instruction.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ketLayanan">Keterangan Layanan</Label>
                <Textarea
                  id="ketLayanan"
                  placeholder="Masukkan keterangan layanan (opsional)"
                  className="min-h-[100px]"
                  {...register('ketLayanan')}
                />
                {errors.ketLayanan && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.ketLayanan.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ketId">Keterangan ID</Label>
                <Input
                  id="ketId"
                  placeholder="Masukkan keterangan ID (opsional)"
                  {...register('ketId')}
                />
                {errors.ketId && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.ketId.message}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
