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
export function FormWebAppereance({
  errors,
  formData,
  onChange,
  onColorChange,
}: FormConfigWebProps & {
  onColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>
            Atur logo untuk berbagai bagian website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 ">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logo_header">Logo Header</Label>
              <Input
                id="logo_header"
                name="logo_header"
                value={formData.logo_header || ''}
                onChange={onChange}
                placeholder="URL Logo Header"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_footer">Logo Footer</Label>
              <Input
                id="logo_footer"
                name="logo_footer"
                value={formData.logo_footer || ''}
                onChange={onChange}
                placeholder="URL Logo Footer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_favicon">Favicon</Label>
              <Input
                id="logo_favicon"
                name="logo_favicon"
                value={formData.logo_favicon || ''}
                onChange={onChange}
                placeholder="URL Favicon"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_banner">Banner</Label>
              <Input
                id="logo_banner"
                name="logo_banner"
                value={formData.logo_banner || ''}
                onChange={onChange}
                placeholder="URL Banner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_cs">Logo CS</Label>
              <Input
                id="logo_cs"
                name="logo_cs"
                value={formData.logo_cs || ''}
                onChange={onChange}
                placeholder="URL Logo CS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="og_image">OG Image</Label>
              <Input
                id="og_image"
                name="og_image"
                value={formData.og_image || ''}
                onChange={onChange}
                placeholder="URL OG Image"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Warna</CardTitle>
          <CardDescription>Atur skema warna website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warna1">Warna 1</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="warna1"
                  name="warna1"
                  type="color"
                  value={formData.warna1}
                  onChange={onColorChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.warna1}
                  onChange={onChange}
                  name="warna1"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warna2">Warna 2</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="warna2"
                  name="warna2"
                  type="color"
                  value={formData.warna2}
                  onChange={onColorChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.warna2}
                  onChange={onChange}
                  name="warna2"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warna3">Warna 3</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="warna3"
                  name="warna3"
                  type="color"
                  value={formData.warna3}
                  onChange={onColorChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.warna3}
                  onChange={onChange}
                  name="warna3"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warna4">Warna 4</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="warna4"
                  name="warna4"
                  type="color"
                  value={formData.warna4}
                  onChange={onColorChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.warna4}
                  onChange={onChange}
                  name="warna4"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warna5">Warna 5</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="warna5"
                  name="warna5"
                  type="color"
                  value={formData.warna5}
                  onChange={onColorChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.warna5}
                  onChange={onChange}
                  name="warna5"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Harga</CardTitle>
          <CardDescription>Atur harga paket</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="harga_gold">Harga Gold</Label>
              <Input
                id="harga_gold"
                name="harga_gold"
                value={formData.harga_gold}
                onChange={onChange}
                className={errors.harga_gold ? 'border-red-500' : ''}
              />
              {errors.harga_gold && (
                <p className="text-sm text-red-500">{errors.harga_gold}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="harga_platinum">Harga Platinum</Label>
              <Input
                id="harga_platinum"
                name="harga_platinum"
                value={formData.harga_platinum}
                onChange={onChange}
                className={errors.harga_platinum ? 'border-red-500' : ''}
              />
              {errors.harga_platinum && (
                <p className="text-sm text-red-500">{errors.harga_platinum}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
