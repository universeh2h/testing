import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ConfigWeb } from '@/types/schema/config_web';
export interface FormConfigWebProps {
  formData: Partial<ConfigWeb>;
  errors: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}
export function FormConfigGeneralWeb({
  formData,
  errors,
  onChange,
}: FormConfigWebProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Informasi Umum</CardTitle>
          <CardDescription>Pengaturan dasar untuk website Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="judul_web">Judul Website</Label>
              <Input
                id="judul_web"
                name="judul_web"
                value={formData.judul_web}
                onChange={onChange}
                className={errors.judul_web ? 'border-red-500' : ''}
              />
              {errors.judul_web && (
                <p className="text-sm text-red-500">{errors.judul_web}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi_web">Deskripsi Website</Label>
              <Textarea
                id="deskripsi_web"
                name="deskripsi_web"
                value={formData.deskripsi_web}
                onChange={onChange}
                className={errors.deskripsi_web ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.deskripsi_web && (
                <p className="text-sm text-red-500">{errors.deskripsi_web}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyword">Kata Kunci (SEO)</Label>
              <Input
                id="keyword"
                name="keyword"
                value={formData.keyword}
                onChange={onChange}
                className={errors.keyword ? 'border-red-500' : ''}
              />
              {errors.keyword && (
                <p className="text-sm text-red-500">{errors.keyword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slogan_web">Slogan Website</Label>
              <Input
                id="slogan_web"
                name="slogan_web"
                value={formData.slogan_web}
                onChange={onChange}
                className={errors.slogan_web ? 'border-red-500' : ''}
              />
              {errors.slogan_web && (
                <p className="text-sm text-red-500">{errors.slogan_web}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telp">Telepon</Label>
              <Input
                id="telp"
                name="telp"
                value={formData.telp}
                onChange={onChange}
                className={errors.telp ? 'border-red-500' : ''}
              />
              {errors.telp && (
                <p className="text-sm text-red-500">{errors.telp}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Syarat dan Ketentuan</CardTitle>
          <CardDescription>
            Atur syarat dan ketentuan serta kebijakan privasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="snk">Syarat dan Ketentuan</Label>
              <Textarea
                id="snk"
                name="snk"
                value={formData.snk}
                onChange={onChange}
                className={errors.snk ? 'border-red-500' : ''}
                rows={5}
              />
              {errors.snk && (
                <p className="text-sm text-red-500">{errors.snk}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="privacy">Kebijakan Privasi</Label>
              <Textarea
                id="privacy"
                name="privacy"
                value={formData.privacy}
                onChange={onChange}
                className={errors.privacy ? 'border-red-500' : ''}
                rows={5}
              />
              {errors.privacy && (
                <p className="text-sm text-red-500">{errors.privacy}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
