import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Copy,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle,
  Calendar,
  Tag,
  ShoppingBag,
} from 'lucide-react';
import { JSX } from 'react';
import { toast } from 'sonner';
import { Voucher } from '@/types/voucher';
import { formatDate } from '@/utils/formatPrice';
import { VoucherForm } from './voucher-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VoucherCardsProps {
  voucher: Voucher;
  onDelete?: (voucher: Voucher) => void;
}

export function VoucherCards({
  voucher,
  onDelete,
}: VoucherCardsProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`${code} has been copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const getProgressPercentage = () => {
    if (voucher.usageLimit === 0 || !voucher.usageLimit) {
      return 0;
    }
    return (voucher.usageCount / voucher.usageLimit) * 100;
  };

  return (
    <>
      <Card className="border hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-bold">
                  {voucher.code}
                </CardTitle>
                <Badge
                  variant={voucher.isActive ? 'default' : 'outline'}
                  className="ml-2"
                >
                  {voucher.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                {voucher.description}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsFormOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete && onDelete(voucher)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete voucher
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
            <div className="font-mono font-bold text-lg tracking-wider">
              {voucher.code}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(voucher.code)}
                    className="h-8 w-8 p-0"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Discount:</span>
              <span className="font-medium">
                {voucher.discountValue}
                {voucher.discountType === 'PERCENTAGE' ? '%' : ' USD'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Min purchase:</span>
              <span className="font-medium">${voucher.minPurchase}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Start:</span>
              <span className="text-xs">{formatDate(voucher.startDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Expires:</span>
              <span className="text-xs">{formatDate(voucher.expiryDate)}</span>
            </div>
          </div>

          {voucher.usageLimit > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Usage</span>
                <span className="font-medium">
                  {voucher.usageCount} / {voucher.usageLimit}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    voucher.isActive ? 'bg-primary' : 'bg-muted-foreground/50'
                  }`}
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Badge variant="outline" className="capitalize">
            {voucher.discountType.toLowerCase()}
          </Badge>
          {voucher.isForAllCategories ? (
            <Badge variant="secondary">All categories</Badge>
          ) : (
            <Badge variant="outline">Specific categories</Badge>
          )}
        </CardFooter>
      </Card>
      {isFormOpen && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Voucher</DialogTitle>
              <DialogDescription>Update Voucher</DialogDescription>
            </DialogHeader>
            <VoucherForm
              initialData={voucher}
              onSuccess={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
