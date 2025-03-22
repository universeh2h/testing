'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormWebsite } from '@/hooks/use-form-web';
import { FormConfigGeneralWeb } from './form-web-umum';
import { FormWebAppereance } from './form-web-appereance';
import { FormWebSocmed } from './form-web-socmed';
import { FormWebPayment } from './form-web-payment';
import { FormWebApi } from './form-web-api';
import { FormWebCompany } from './form-web-company';
import { Button } from '@/components/ui/button';
import { FormWaMessage } from './from-web-wa';

export function GeneralPage() {
  const { errors, handleChange, formData, handleColorChange, handleSubmit } =
    useFormWebsite();

  return (
    <main className="space-y-6 p-8 w-full">
      <section>
        <h1 className="text-3xl font-semibold">Settings Web</h1>
      </section>

      <section className="w-full">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-7 mb-6">
            <TabsTrigger value="general">Umum</TabsTrigger>
            <TabsTrigger value="appearance">Tampilan</TabsTrigger>
            <TabsTrigger value="social">Sosial Media</TabsTrigger>
            <TabsTrigger value="payment">Pembayaran</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="company">Perusahaan</TabsTrigger>
            <TabsTrigger value="wa">Wa</TabsTrigger>
          </TabsList>

          <div className="w-full">
            <TabsContent value="general" className="w-full mt-0">
              <FormConfigGeneralWeb
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />
            </TabsContent>

            <TabsContent value="appearance" className="w-full mt-0">
              <FormWebAppereance
                errors={errors}
                formData={formData}
                onChange={handleChange}
                onColorChange={handleColorChange}
              />
            </TabsContent>

            <TabsContent value="social" className="w-full mt-0">
              <FormWebSocmed
                errors={errors}
                formData={formData}
                onChange={handleChange}
              />
            </TabsContent>

            <TabsContent value="payment" className="w-full mt-0">
              <FormWebPayment
                errors={errors}
                formData={formData}
                onChange={handleChange}
              />
            </TabsContent>

            <TabsContent value="api" className="w-full mt-0">
              <FormWebApi
                errors={errors}
                formData={formData}
                onChange={handleChange}
              />
            </TabsContent>

            <TabsContent value="company" className="w-full mt-0">
              <FormWebCompany
                errors={errors}
                formData={formData}
                onChange={handleChange}
              />
            </TabsContent>
            <TabsContent value="wa" className="w-full mt-0">
              <FormWaMessage
                errors={errors}
                formData={formData}
                onChange={handleChange}
              />
            </TabsContent>
          </div>
        </Tabs>
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit} size="lg">
            Simpan Konfigurasi
          </Button>
        </div>
      </section>
    </main>
  );
}
