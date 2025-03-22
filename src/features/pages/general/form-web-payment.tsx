import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormConfigWebProps } from './form-web-umum';
export function FormWebPayment({ formData, onChange }: FormConfigWebProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payment Gateway</CardTitle>
          <CardDescription>Konfigurasi payment gateway</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tripay_api">Tripay API</Label>
              <Input
                id="tripay_api"
                name="tripay_api"
                value={formData.tripay_api || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tripay_merchant_code">Tripay Merchant Code</Label>
              <Input
                id="tripay_merchant_code"
                name="tripay_merchant_code"
                value={formData.tripay_merchant_code || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tripay_private_key">Tripay Private Key</Label>
              <Input
                id="tripay_private_key"
                name="tripay_private_key"
                value={formData.tripay_private_key || ''}
                onChange={onChange}
                type="password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duitku_key">Duitku Key</Label>
              <Input
                id="duitku_key"
                name="duitku_key"
                value={formData.duitku_key || ''}
                onChange={onChange}
                type="password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duitku_merchant">Duitku Merchant</Label>
              <Input
                id="duitku_merchant"
                name="duitku_merchant"
                value={formData.duitku_merchant || ''}
                onChange={onChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Rekening Admin</CardTitle>
          <CardDescription>Konfigurasi rekening admin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomor_admin">Nomor Admin</Label>
              <Input
                id="nomor_admin"
                name="nomor_admin"
                value={formData.nomor_admin || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ovo_admin">OVO Admin</Label>
              <Input
                id="ovo_admin"
                name="ovo_admin"
                value={formData.ovo_admin || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ovo1_admin">OVO Admin (Alternatif)</Label>
              <Input
                id="ovo1_admin"
                name="ovo1_admin"
                value={formData.ovo1_admin || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gopay_admin">GoPay Admin</Label>
              <Input
                id="gopay_admin"
                name="gopay_admin"
                value={formData.gopay_admin || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gopay1_admin">GoPay Admin (Alternatif)</Label>
              <Input
                id="gopay1_admin"
                name="gopay1_admin"
                value={formData.gopay1_admin || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dana_admin">DANA Admin</Label>
              <Input
                id="dana_admin"
                name="dana_admin"
                value={formData.dana_admin || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopeepay_admin">ShopeePay Admin</Label>
              <Input
                id="shopeepay_admin"
                name="shopeepay_admin"
                value={formData.shopeepay_admin || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bca_admin">BCA Admin</Label>
              <Input
                id="bca_admin"
                name="bca_admin"
                value={formData.bca_admin || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mandiri_admin">Mandiri Admin</Label>
              <Input
                id="mandiri_admin"
                name="mandiri_admin"
                value={formData.mandiri_admin || ''}
                onChange={onChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
