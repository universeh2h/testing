import { useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  CreditCard,
  Info,
  Package,
  Percent,
  Tag,
  User,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import type { LayananWithCategoryAndSub } from '@/types/layanans';
import { formatDate, FormatPrice } from '@/utils/formatPrice';

interface DialogDetailLayananProps {
  children: ReactNode;
  layanan: LayananWithCategoryAndSub;
}

export default function DialogDetailLayanan({
  children,
  layanan,
}: DialogDetailLayananProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{layanan.layanan}</DialogTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={layanan.status ? 'default' : 'destructive'}>
                  {layanan.status ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
                {layanan.isFlashSale && (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <Zap className="h-3 w-3" />
                    Flash Sale
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">ID Layanan</div>
              <div className="font-mono text-xs">{layanan.id}</div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detail</TabsTrigger>
            <TabsTrigger value="pricing">Harga</TabsTrigger>
            <TabsTrigger value="flashsale">Flash Sale</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Basic Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <Info className="mr-2 h-4 w-4" />
                    Informasi Dasar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">Provider</div>
                    <div className="flex items-center gap-2">
                      {layanan.productLogo ? (
                        <Image
                          src={layanan.productLogo || '/placeholder.svg'}
                          alt={layanan.provider}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{layanan.provider}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Kategori</div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>Kategori {layanan.kategoriId}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Sub Kategori</div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>Sub Kategori {layanan.subCategoryId}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <Package className="mr-2 h-4 w-4" />
                    Informasi Tambahan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">Catatan</div>
                    <div className="text-sm text-muted-foreground">
                      {layanan.catatan || '-'}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Dibuat Pada</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(layanan.createdAt as string)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Diperbarui Pada</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatDate(layanan.updatedAt as string)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-base">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Informasi Harga
                </CardTitle>
                <CardDescription>
                  Daftar harga untuk berbagai tingkat pengguna
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Harga Reguler</div>
                      <div className="text-xl font-bold">
                        {FormatPrice(layanan.harga)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Profit: {FormatPrice(layanan.profit)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium">Harga Reseller</div>
                      <div className="text-xl font-bold">
                        {FormatPrice(layanan.hargaReseller)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Profit: {FormatPrice(layanan.profitReseller)}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Harga Gold</div>
                      <div className="text-xl font-bold">
                        {FormatPrice(layanan.hargaGold)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Profit: {FormatPrice(layanan.profitGold)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium">Harga Platinum</div>
                      <div className="text-xl font-bold">
                        {FormatPrice(layanan.hargaPlatinum)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Profit: {FormatPrice(layanan.profitPlatinum)}
                      </div>
                    </div>
                  </div>

                  {layanan.isFlashSale && layanan.hargaFlashSale && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
                          <Zap className="h-4 w-4" />
                          Harga Flash Sale
                        </div>
                        <div className="text-xl font-bold text-amber-500">
                          {FormatPrice(layanan.hargaFlashSale)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Diskon:{' '}
                          {layanan.hargaFlashSale && layanan.harga > 0
                            ? Math.round(
                                ((layanan.harga - layanan.hargaFlashSale) /
                                  layanan.harga) *
                                  100
                              )
                            : 0}
                          %
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flash Sale Tab */}
          <TabsContent value="flashsale" className="pt-4">
            {layanan.isFlashSale ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <Percent className="mr-2 h-4 w-4" />
                    Informasi Flash Sale
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Judul Flash Sale</div>
                    <div className="text-base">
                      {layanan.judulFlashSale || '-'}
                    </div>
                  </div>

                  {layanan.bannerFlashSale && (
                    <div>
                      <div className="text-sm font-medium">
                        Banner Flash Sale
                      </div>
                      <div className="mt-2 overflow-hidden rounded-md">
                        <Image
                          src={layanan.bannerFlashSale || '/placeholder.svg'}
                          alt="Banner Flash Sale"
                          width={600}
                          height={200}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm font-medium">Harga Flash Sale</div>
                    <div className="text-xl font-bold">
                      {FormatPrice(layanan.hargaFlashSale || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Harga normal: {FormatPrice(layanan.harga)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Berakhir Pada</div>
                    {layanan.expiredFlashSale && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(layanan.expiredFlashSale as string)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Zap className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  Tidak Ada Flash Sale
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Layanan ini tidak memiliki flash sale yang aktif.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
