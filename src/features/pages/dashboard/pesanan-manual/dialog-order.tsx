'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types/category';
import { FormatPrice } from '@/utils/formatPrice';
import { trpc } from '@/utils/trpc';
import { Loader2 } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PlaceholderContent } from '../../order/placeholder/content';
import { getServerData } from '@/data/data-server-region';

interface DialogOrderManualProps {
  data?: Category[];
  children: ReactNode;
  onOrderComplete?: () => void;
}

export function DialogOrderManual({
  data,
  children,
  onOrderComplete,
}: DialogOrderManualProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedService, setSelectedService] = useState<string>('');
  const [whatsApp, setWhatsApp] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [placeholder1, setPlaceholder1] = useState('');
  const [placeholder2, setPlaceholder2] = useState('');
  const { mutate, isLoading : isPending } = trpc.order.createManual.useMutation({
    onSuccess: () => {
      toast.success('Order created successfully');
      resetForm();
      setOpen(false);
      if (onOrderComplete) onOrderComplete();
    },
    onError: (error) => {
      toast.error(`Failed to create order: ${error.message}`);
    },
  });

  const { data: layanans, isLoading: isLoadingServices } =
    trpc.layanans.getLayananByCategory.useQuery(
      { category: selectedCategoryId },
      { enabled: !!selectedCategoryId }
    );
  
    const serverData =  getServerData(selectedCategory?.kode as string)

  // Find selected category object when ID changes
  useEffect(() => {
    if (selectedCategoryId && data) {
      const category = data.find((cat) => cat.kode === selectedCategoryId);
      setSelectedCategory(category || null);
    } else {
      setSelectedCategory(null);
    }
  }, [selectedCategoryId, data]);

  // Validate form whenever inputs change
  useEffect(() => {
    setIsFormValid(
      !!selectedCategoryId && !!selectedService && whatsApp.length >= 10
    );
  }, [selectedCategoryId, selectedService, whatsApp]);

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error('Pastika semua data terisi');
      return;
    }

    try {
      mutate({
        categoryId: selectedCategory?.id.toString() as string,
        layananId: selectedService,
        whatsapp: whatsApp,
        userId: placeholder1,
        serverId: placeholder2,
      });
    } catch (error) {
      toast.error('terjadi kesalahan')
    }
  };

  const resetForm = () => {
    setSelectedCategoryId('');
    setSelectedCategory(null);
    setSelectedService('');
    setWhatsApp('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Manual</DialogTitle>
          <DialogDescription>
            Make a manual order for your customer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Select Category
              </Label>

              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {data?.map((category) => (
                      <SelectItem key={category.id} value={category.kode || ''}>
                        {category.nama}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {selectedCategoryId && (
              <div className="space-y-2">
                <Label htmlFor="service" className="text-sm font-medium">
                  Services
                </Label>
                {isLoadingServices ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Loading services...
                    </span>
                  </div>
                ) : !layanans || layanans.layanan.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No services available for this category
                  </div>
                ) : (
                  <Select
                    value={selectedService}
                    onValueChange={setSelectedService}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectGroup>
                        <SelectLabel>Services</SelectLabel>
                        {layanans.layanan.map((service) => (
                          <SelectItem
                            key={service.id}
                            value={service.id.toString()}
                          >
                            <div className="flex justify-between w-full">
                              <span>{service.layanan}</span>
                              <span className="text-muted-foreground ml-4">
                                {FormatPrice(service.harga)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
            {selectedCategory && (
              <PlaceholderContent
                category={selectedCategory}
                userId={placeholder1}
                serverId={placeholder2}
                serverData={serverData}
                onChangeUserId={setPlaceholder1}
                onChangeServerId={setPlaceholder2}
              />
            )}
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                value={whatsApp}
                type="tel"
                placeholder="628123456789"
                onChange={(e) => setWhatsApp(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter number with country code (e.g., 628123456789)
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isPending || !isFormValid}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Order'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
