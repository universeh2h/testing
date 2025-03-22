'use client';

import { configWeb, ConfigWeb } from '@/types/schema/config_web';
import { trpc } from '@/utils/trpc';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export function useFormWebsite() {
  const {
    data,
    isLoading,
    error: fetchError,
  } = trpc.setting.getConfig.useQuery();

  // Initialize with empty values
  const [formData, setFormData] = useState<Partial<ConfigWeb>>({
    id: 1,
    judul_web: '',
    deskripsi_web: '',
    keyword: '',
    og_image: null,
    logo_header: null,
    logo_footer: null,
    logo_favicon: null,
    logo_banner: null,
    logo_cs: null,
    url_wa: '',
    url_ig: '',
    url_tiktok: '',
    url_youtube: '',
    url_fb: '',
    kbrstore_api: '',
    slogan_web: '',
    snk: '',
    privacy: '',
    warna1: '#000000',
    warna2: '#000000',
    warna3: '#000000',
    warna4: '#000000',
    warna5: '#000000',
    harga_gold: '',
    harga_platinum: '',
    tripay_api: null,
    tripay_merchant_code: null,
    tripay_private_key: null,
    duitku_key: null,
    duitku_merchant: null,
    username_digi: null,
    api_key_digi: null,
    apigames_secret: null,
    apigames_merchant: null,
    vip_apiid: null,
    vip_apikey: null,
    digi_seller_user: null,
    digi_seller_key: null,
    nomor_admin: null,
    wa_key: null,
    wa_number: null,
    ovo_admin: null,
    ovo1_admin: null,
    gopay_admin: null,
    gopay1_admin: null,
    dana_admin: null,
    shopeepay_admin: null,
    bca_admin: null,
    mandiri_admin: null,
    logo_ceo: null,
    sejarah: '',
    sejarah_1: '',
    visi: '',
    misi: '',
    nama_ceo: '',
    deskripsi_ceo: '',
    nama_bagan: '',
    alamat: '',
    telp: '',
    email: '',
    waPaid : "",
    waPending : "",
    waProcess : "",
    waSuccess : ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { mutate, isLoading: isSaving } = trpc.setting.upsert.useMutation({
    onSuccess: () => {
      const message = 'Konfigurasi berhasil disimpan!';
      setSuccessMessage(message);
      toast.success(message);

      // Clear success message after 3 seconds
      const timeoutId = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      return () => clearTimeout(timeoutId);
    },
    onError: (error) => {
      toast.error(
        error.message || 'Terjadi kesalahan saat menyimpan konfigurasi'
      );
    },
  });

  // Update form data when API data is loaded
  useEffect(() => {
    if (data) {
      const convertedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === null ? undefined : value,
        ])
      );
      setFormData((prevData) => ({
        ...prevData,
        ...convertedData,
      }));
    }
  }, [data]);

  // Show error toast if fetch fails
  useEffect(() => {
    if (fetchError) {
      toast.error('Gagal memuat data konfigurasi');
    }
  }, [fetchError]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate the form data
      const req = configWeb.parse(formData);
      mutate(req);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path.join('.')] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error('Mohon periksa kembali data yang dimasukkan');
      } else {
        toast.error('Terjadi kesalahan internal server');
      }
      setSuccessMessage(null);
    }
  };

  return {
    formData,
    handleSubmit,
    successMessage,
    errors,
    handleChange,
    handleColorChange,
    handleFileChange,
    isLoading,
    isSaving,
  };
}
