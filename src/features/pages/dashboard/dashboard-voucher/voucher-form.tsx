'use client';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CalendarIcon,
  Info,
  Percent,
  Tag,
  CalendarPlus2Icon as CalendarIcon2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { MultiSelect } from './multi-select';
import { createVoucherSchema } from '@/types/schema/voucher';
import { Label } from '@/components/ui/label';
import { trpc } from '@/utils/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Voucher } from '@/types/voucher';

interface VoucherFormProps {
  initialData?: Voucher;
  onSuccess?: () => void;
}

export function VoucherForm({ initialData, onSuccess }: VoucherFormProps) {
  const { data: categories } = trpc.main.getCategories.useQuery({
    fields: ['id', 'nama'],
  });
  const queryClient = useQueryClient();
  const { mutate, isLoading : isPending } = trpc.voucher.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voucher', 'getAll'] });
      toast.success('created voucher successfully');
      if (onSuccess) onSuccess();
    },
    onError: () => {
      queryClient.cancelQueries({ queryKey: ['voucher', 'getAll'] });
      toast.error('failed to create voucher');
    },
  });
  const { mutate: update, isLoading: updatePending } =
    trpc.voucher.update.useMutation();

  const defaultStartDate = new Date();
  const defaultExpiryDate = new Date();
  defaultExpiryDate.setMonth(defaultExpiryDate.getMonth() + 1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof createVoucherSchema>>({
    resolver: zodResolver(createVoucherSchema),
    defaultValues: {
      code: initialData?.code ?? '',
      discountType: initialData?.discountType ?? 'PERCENTAGE',
      discountValue: initialData?.discountValue ?? 0,
      maxDiscount: initialData?.maxDiscount ?? null,
      minPurchase: initialData?.minPurchase ?? null,
      usageLimit: initialData?.usageLimit ?? null,
      isForAllCategories: initialData?.isForAllCategories ?? false,
      isActive: initialData?.isActive ?? true,
      startDate: new Date(initialData?.startDate as string) ?? new Date(),
      expiryDate:
        new Date(initialData?.expiryDate as string) ??
        new Date(new Date().setMonth(new Date().getMonth() + 1)),
      description: initialData?.description ?? '',
      categoryIds: [],
    },
  });
  function onSubmit(values: z.infer<typeof createVoucherSchema>) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startDate =
        values.startDate instanceof Date
          ? values.startDate
          : new Date(values.startDate);

      const expiryDate =
        values.expiryDate instanceof Date
          ? values.expiryDate
          : new Date(values.expiryDate);

      if (startDate < today) {
        toast.error('Start date tidak boleh hari kemarin');
        return;
      }

      if (expiryDate < startDate) {
        toast.error('expiry date harus lebih besok dari start date');
        return;
      }
      const formattedValues = {
        ...values,
        startDate,
        expiryDate,
      };

      const submissionData = {
        ...formattedValues,
        startDate: formattedValues.startDate.toISOString(),
        expiryDate: formattedValues.expiryDate.toISOString(),
      };

      if (initialData) {
        update({
          data: submissionData,
          id: initialData.id,
        });
        toast.success('update successfully');
      } else {
        mutate(submissionData);
        toast.success('create successfully');
      }
    } catch (error) {
      console.error('Error formatting form data:', error);
      toast.error('Error processing form data');
    }
  }
  const discountType = watch('discountType');
  const isForAllCategories = watch('isForAllCategories');

  const handleDiscountTypeChange = (checked: boolean) => {
    setValue('discountType', checked ? 'PERCENTAGE' : 'FIXED');
  };

  const isLoading = initialData ? updatePending : isPending;

  const formatDateSafely = (date: Date | string | null | undefined) => {
    if (!date) return '';
    try {
      // Convert string "Invalid Date" to empty string
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      return format(dateObj, 'PPP');
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="discount" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              <span>Discount</span>
            </TabsTrigger>
            <TabsTrigger value="validity" className="flex items-center gap-2">
              <CalendarIcon2 className="h-4 w-4" />
              <span>Validity</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            {/* Kode Voucher */}
            <div className="space-y-2">
              <Label htmlFor="code">Kode Voucher</Label>
              <Input id="code" placeholder="SUMMER2023" {...register('code')} />
              <p className="text-sm text-muted-foreground">
                Masukkan kode unik.
              </p>
              {errors.code && (
                <p className="text-sm font-medium text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Masukkan deskripsi voucher (opsional)"
                className="resize-none"
                {...register('description')}
              />
              <p className="text-sm text-muted-foreground">
                Berikan detail tambahan tentang voucher ini
              </p>
              {errors.description && (
                <p className="text-sm font-medium text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Status Aktif */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Status Aktif</Label>
                <p className="text-sm text-muted-foreground">
                  Aktifkan atau nonaktifkan voucher ini
                </p>
              </div>
              <Switch
                checked={watch('isActive')}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
            </div>
          </TabsContent>

          {/* Discount Tab */}
          <TabsContent value="discount" className="space-y-6">
            {/* Jenis Diskon */}
            <div className="space-y-3">
              <Label>Jenis Diskon</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {discountType === 'PERCENTAGE'
                    ? 'Persentase (%)'
                    : 'Jumlah Tetap'}
                </span>
                <Switch
                  checked={discountType === 'PERCENTAGE'}
                  onCheckedChange={handleDiscountTypeChange}
                />
              </div>
              {errors.discountType && (
                <p className="text-sm font-medium text-destructive">
                  {errors.discountType.message}
                </p>
              )}
            </div>

            {/* Nilai Diskon */}
            <div className="space-y-2">
              <Label htmlFor="discountValue">
                {discountType === 'PERCENTAGE'
                  ? 'Persentase Diskon'
                  : 'Jumlah Diskon'}
              </Label>
              <Input
                id="discountValue"
                type="number"
                placeholder={discountType === 'PERCENTAGE' ? '10' : '100'}
                {...register('discountValue', {
                  valueAsNumber: true,
                  onChange: (e) =>
                    setValue(
                      'discountValue',
                      Number.parseFloat(e.target.value) || 0
                    ),
                })}
              />
              <p className="text-sm text-muted-foreground">
                {discountType === 'PERCENTAGE'
                  ? 'Masukkan diskon dalam persen (contoh: 10 => 10%)'
                  : 'Masukkan diskon dalam jumlah tetap'}
              </p>
              {errors.discountValue && (
                <p className="text-sm font-medium text-destructive">
                  {errors.discountValue.message}
                </p>
              )}
            </div>

            {/* Diskon Maksimum (hanya untuk persentase) */}
            {discountType === 'PERCENTAGE' && (
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Diskon Maksimum</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  placeholder="Opsional"
                  {...register('maxDiscount', {
                    setValueAs: (v) =>
                      v === '' ? null : Number.parseFloat(v) || null,
                  })}
                />
                <p className="text-sm text-muted-foreground">
                  Diskon maksimum yang digunakan (opsional)
                </p>
                {errors.maxDiscount && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.maxDiscount.message}
                  </p>
                )}
              </div>
            )}

            {/* Pembelian Minimum */}
            <div className="space-y-2">
              <Label htmlFor="minPurchase">Pembelian Minimum</Label>
              <Input
                id="minPurchase"
                type="number"
                placeholder="Opsional"
                {...register('minPurchase', {
                  setValueAs: (v) =>
                    v === '' ? null : Number.parseFloat(v) || null,
                })}
              />
              <p className="text-sm text-muted-foreground">
                Jumlah pembelian minimum yang diperlukan untuk menggunakan
                voucher ini (opsional)
              </p>
              {errors.minPurchase && (
                <p className="text-sm font-medium text-destructive">
                  {errors.minPurchase.message}
                </p>
              )}
            </div>
          </TabsContent>

          {/* Validity Tab */}
          <TabsContent value="validity" className="space-y-6">
            {/* Rentang Tanggal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tanggal Mulai */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Tanggal Mulai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="startDate"
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !watch('startDate') && 'text-muted-foreground'
                      )}
                    >
                      {watch('startDate') ? (
                        formatDateSafely(watch('startDate'))
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="start">
  <div className="space-y-2">
    <label htmlFor="date-picker" className="text-sm font-medium">
      Select Date
    </label>
    <input
  id="date-picker"
  type="date"
  className="w-full rounded-md border border-input bg-background px-3 py-2"
  value={(() => {
    try {
      const dateValue = watch('startDate');
      if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        return dateValue.toISOString().split('T')[0];
      } else {
        const fallbackDate = new Date(dateValue || defaultStartDate);
        return !isNaN(fallbackDate.getTime()) 
          ? fallbackDate.toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0];
      }
    } catch (e) {
      return new Date().toISOString().split('T')[0];
    }
  })()}
  onChange={(e) => {
    if (e.target.value) {
      setValue('startDate', new Date(e.target.value));
    }
  }}
  min={new Date().toISOString().split('T')[0]}
/>
    <div className="flex justify-end">
      <button
        type="button"
        className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        onClick={() => setValue('startDate', new Date())}
      >
        Today
      </button>
    </div>
  </div>
</PopoverContent>
                </Popover>
                {errors.startDate && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {/* Tanggal Kadaluarsa */}
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Tanggal Kadaluarsa</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="expiryDate"
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !watch('expiryDate') && 'text-muted-foreground'
                      )}
                    >
                      {watch('expiryDate') ? (
                        formatDateSafely(watch('expiryDate'))
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="start">
  <div className="space-y-2">
    <label htmlFor="expiry-date-picker" className="text-sm font-medium">
      Select Expiry Date
    </label>
    <input
  id="expiry-date-picker"
  type="date"
  className="w-full rounded-md border border-input bg-background px-3 py-2"
  value={(() => {
    try {
      const dateValue = watch('expiryDate');
      if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        return dateValue.toISOString().split('T')[0];
      } else {
        const fallbackDate = new Date(dateValue || defaultExpiryDate);
        return !isNaN(fallbackDate.getTime()) 
          ? fallbackDate.toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0];
      }
    } catch (e) {
      return new Date().toISOString().split('T')[0];
    }
  })()}
  onChange={(e) => {
    if (e.target.value) {
      setValue('expiryDate', new Date(e.target.value));
    }
  }}
  min={(() => {
    try {
      // Get the later of today or startDate
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const startDateValue = watch('startDate');
      const startDate = startDateValue instanceof Date && !isNaN(startDateValue.getTime())
        ? startDateValue
        : new Date(startDateValue || defaultStartDate);
      
      if (isNaN(startDate.getTime())) {
        return today.toISOString().split('T')[0];
      }
      
      return startDate > today 
        ? startDate.toISOString().split('T')[0] 
        : today.toISOString().split('T')[0];
    } catch (e) {
      return new Date().toISOString().split('T')[0];
    }
  })()}
/>
    <div className="flex justify-end space-x-2">
      <button
        type="button"
        className="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground"
        onClick={() => {
          const startDate = watch('startDate') instanceof Date
            ? watch('startDate')
            : new Date(watch('startDate') || defaultStartDate);
          
          // Set to 7 days after start date
          const newDate = new Date(startDate);
          newDate.setDate(newDate.getDate() + 7);
          setValue('expiryDate', newDate);
        }}
      >
        +7 Days
      </button>
      <button
        type="button"
        className="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground"
        onClick={() => {
          const startDate = watch('startDate') instanceof Date
            ? watch('startDate')
            : new Date(watch('startDate') || defaultStartDate);
          
          // Set to 30 days after start date
          const newDate = new Date(startDate);
          newDate.setDate(newDate.getDate() + 30);
          setValue('expiryDate', newDate);
        }}
      >
        +30 Days
      </button>
    </div>
  </div>
</PopoverContent>
                </Popover>
                {errors.expiryDate && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Batas Penggunaan */}
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Batas Penggunaan</Label>
              <Input
                id="usageLimit"
                type="number"
                placeholder="Opsional"
                {...register('usageLimit', {
                  setValueAs: (v) =>
                    v === '' ? null : Number.parseInt(v) || null,
                })}
              />
              <p className="text-sm text-muted-foreground">
                Jumlah maksimum voucher ini dapat digunakan (opsional)
              </p>
              {errors.usageLimit && (
                <p className="text-sm font-medium text-destructive">
                  {errors.usageLimit.message}
                </p>
              )}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            {/* Berlaku untuk Semua Kategori */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">
                  Berlaku untuk Semua Kategori
                </Label>
                <p className="text-sm text-muted-foreground">
                  Saat diaktifkan, voucher ini akan berlaku untuk semua kategori
                  produk
                </p>
              </div>
              <Switch
                checked={isForAllCategories}
                onCheckedChange={(checked) =>
                  setValue('isForAllCategories', checked)
                }
              />
            </div>

            {/* Kategori (hanya jika tidak berlaku untuk semua kategori) */}
            {!isForAllCategories && categories && (
              <div className="space-y-2">
                <Label htmlFor="categoryIds">Kategori</Label>
                <MultiSelect
                  options={categories.data.map((cat) => ({
                    value: cat.id.toString(),
                    label: cat.nama,
                  }))}
                  selected={
                    watch('categoryIds')?.map((id) => id.toString()) || []
                  }
                  onChange={(values) =>
                    setValue(
                      'categoryIds',
                      values.map((v) => Number.parseInt(v))
                    )
                  }
                  placeholder="Pilih kategori"
                />
                <p className="text-sm text-muted-foreground">
                  Pilih kategori yang berlaku untuk voucher ini
                </p>
                {errors.categoryIds && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.categoryIds.message}
                  </p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Aksi Form */}
        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {initialData ? 'Perbarui Voucher' : 'Buat Voucher'}
          </Button>
        </div>
      </form>
    </div>
  );
}
