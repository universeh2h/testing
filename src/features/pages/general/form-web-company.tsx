import { FormConfigWebProps } from './form-web-umum';
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

export function FormWebCompany({
  errors,
  formData,
  onChange,
}: FormConfigWebProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Informasi Perusahaan</CardTitle>
          <CardDescription>Atur informasi tentang perusahaan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nama_bagan">Nama Bagan</Label>
              <Input
                id="nama_bagan"
                name="nama_bagan"
                value={formData.nama_bagan}
                onChange={onChange}
                className={errors.nama_bagan ? 'border-red-500' : ''}
              />
              {errors.nama_bagan && (
                <p className="text-sm text-red-500">{errors.nama_bagan}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Textarea
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={onChange}
                className={errors.alamat ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.alamat && (
                <p className="text-sm text-red-500">{errors.alamat}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sejarah">Sejarah</Label>
              <Textarea
                id="sejarah"
                name="sejarah"
                value={formData.sejarah}
                onChange={onChange}
                className={errors.sejarah ? 'border-red-500' : ''}
                rows={4}
              />
              {errors.sejarah && (
                <p className="text-sm text-red-500">{errors.sejarah}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sejarah_1">Sejarah (Lanjutan)</Label>
              <Textarea
                id="sejarah_1"
                name="sejarah_1"
                value={formData.sejarah_1}
                onChange={onChange}
                className={errors.sejarah_1 ? 'border-red-500' : ''}
                rows={4}
              />
              {errors.sejarah_1 && (
                <p className="text-sm text-red-500">{errors.sejarah_1}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="visi">Visi</Label>
              <Textarea
                id="visi"
                name="visi"
                value={formData.visi}
                onChange={onChange}
                className={errors.visi ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.visi && (
                <p className="text-sm text-red-500">{errors.visi}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="misi">Misi</Label>
              <Textarea
                id="misi"
                name="misi"
                value={formData.misi}
                onChange={onChange}
                className={errors.misi ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.misi && (
                <p className="text-sm text-red-500">{errors.misi}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Informasi CEO</CardTitle>
          <CardDescription>Atur informasi tentang CEO</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nama_ceo">Nama CEO</Label>
              <Input
                id="nama_ceo"
                name="nama_ceo"
                value={formData.nama_ceo}
                onChange={onChange}
                className={errors.nama_ceo ? 'border-red-500' : ''}
              />
              {errors.nama_ceo && (
                <p className="text-sm text-red-500">{errors.nama_ceo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi_ceo">Deskripsi CEO</Label>
              <Textarea
                id="deskripsi_ceo"
                name="deskripsi_ceo"
                value={formData.deskripsi_ceo}
                onChange={onChange}
                className={errors.deskripsi_ceo ? 'border-red-500' : ''}
                rows={4}
              />
              {errors.deskripsi_ceo && (
                <p className="text-sm text-red-500">{errors.deskripsi_ceo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_ceo">Foto CEO</Label>
              <Input
                id="logo_ceo"
                name="logo_ceo"
                value={formData.logo_ceo || ''}
                onChange={onChange}
                placeholder="URL Foto CEO"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
