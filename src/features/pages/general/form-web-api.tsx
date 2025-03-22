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

export function FormWebApi({ errors, formData, onChange }: FormConfigWebProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>API Konfigurasi</CardTitle>
          <CardDescription>Konfigurasi API untuk integrasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kbrstore_api">KBR Store API</Label>
              <Input
                id="kbrstore_api"
                name="kbrstore_api"
                value={formData.kbrstore_api}
                onChange={onChange}
                className={errors.kbrstore_api ? 'border-red-500' : ''}
              />
              {errors.kbrstore_api && (
                <p className="text-sm text-red-500">{errors.kbrstore_api}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username_digi">Username Digi</Label>
              <Input
                id="username_digi"
                name="username_digi"
                value={formData.username_digi || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api_key_digi">API Key Digi</Label>
              <Input
                id="api_key_digi"
                name="api_key_digi"
                value={formData.api_key_digi || ''}
                onChange={onChange}
                type="password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apigames_secret">API Games Secret</Label>
              <Input
                id="apigames_secret"
                name="apigames_secret"
                value={formData.apigames_secret || ''}
                onChange={onChange}
                type="password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apigames_merchant">API Games Merchant</Label>
              <Input
                id="apigames_merchant"
                name="apigames_merchant"
                value={formData.apigames_merchant || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vip_apiid">VIP API ID</Label>
              <Input
                id="vip_apiid"
                name="vip_apiid"
                value={formData.vip_apiid || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vip_apikey">VIP API Key</Label>
              <Input
                id="vip_apikey"
                name="vip_apikey"
                value={formData.vip_apikey || ''}
                onChange={onChange}
                type="password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="digi_seller_user">Digi Seller User</Label>
              <Input
                id="digi_seller_user"
                name="digi_seller_user"
                value={formData.digi_seller_user || ''}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="digi_seller_key">Digi Seller Key</Label>
              <Input
                id="digi_seller_key"
                name="digi_seller_key"
                value={formData.digi_seller_key || ''}
                onChange={onChange}
                type="password"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>WhatsApp API</CardTitle>
          <CardDescription>Konfigurasi WhatsApp API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wa_key">WhatsApp Key</Label>
              <Input
                id="wa_key"
                name="wa_key"
                value={formData.wa_key || ''}
                onChange={onChange}
                type="password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wa_number">WhatsApp Number</Label>
              <Input
                id="wa_number"
                name="wa_number"
                value={formData.wa_number || ''}
                onChange={onChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
