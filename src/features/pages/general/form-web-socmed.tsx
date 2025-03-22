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

export function FormWebSocmed({
  errors,
  formData,
  onChange,
}: FormConfigWebProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sosial Media</CardTitle>
        <CardDescription>Atur tautan sosial media</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="url_wa">WhatsApp</Label>
            <Input
              id="url_wa"
              name="url_wa"
              value={formData.url_wa}
              onChange={onChange}
              placeholder="https://wa.me/628xxxxxxxxxx"
              className={errors.url_wa ? 'border-red-500' : ''}
            />
            {errors.url_wa && (
              <p className="text-sm text-red-500">{errors.url_wa}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url_ig">Instagram</Label>
            <Input
              id="url_ig"
              name="url_ig"
              value={formData.url_ig}
              onChange={onChange}
              placeholder="https://instagram.com/username"
              className={errors.url_ig ? 'border-red-500' : ''}
            />
            {errors.url_ig && (
              <p className="text-sm text-red-500">{errors.url_ig}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url_tiktok">TikTok</Label>
            <Input
              id="url_tiktok"
              name="url_tiktok"
              value={formData.url_tiktok}
              onChange={onChange}
              placeholder="https://tiktok.com/@username"
              className={errors.url_tiktok ? 'border-red-500' : ''}
            />
            {errors.url_tiktok && (
              <p className="text-sm text-red-500">{errors.url_tiktok}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url_youtube">YouTube</Label>
            <Input
              id="url_youtube"
              name="url_youtube"
              value={formData.url_youtube}
              onChange={onChange}
              placeholder="https://youtube.com/@channel"
              className={errors.url_youtube ? 'border-red-500' : ''}
            />
            {errors.url_youtube && (
              <p className="text-sm text-red-500">{errors.url_youtube}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url_fb">Facebook</Label>
            <Input
              id="url_fb"
              name="url_fb"
              value={formData.url_fb}
              onChange={onChange}
              placeholder="https://facebook.com/username"
              className={errors.url_fb ? 'border-red-500' : ''}
            />
            {errors.url_fb && (
              <p className="text-sm text-red-500">{errors.url_fb}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
