'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { type RegisterAuth, registerSchema } from '@/types/schema/auth';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { WhatsAppInput } from '@/components/ui/wa-input';
import { AuthPage } from '../components/auth';
import CreateUser from '../components/server';
import { PasswordInput } from '@/components/ui/passwordInput';

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterAuth>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      password: '',
      whatsapp: 62,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterAuth) => {
    setIsLoading(true);
    try {
      const result = await CreateUser({ credentials: data });
      if (result.success) {
        toast.success(result.message);
        router.push('/login');
      } else {
        toast.error(result.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(' internal server error');
    } finally {
      reset();
      setIsLoading(false);
    }
  };

  // Custom handler for WhatsApp input
  const handleWhatsAppChange = (value: string) => {
    setValue('whatsapp', value ? Number.parseInt(value) : 62);
  };

  return (
    <AuthPage>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-white">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <WhatsAppInput
              id="whatsapp"
              placeholder="8123456789"
              countryCode={62}
              value={watch('whatsapp')}
              onChange={(e) => handleWhatsAppChange(e.target.value)}
              error={errors.whatsapp?.message}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-white hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              {...register('password')}
              showStrengthMeter
              error={errors.password?.message}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Daftar'}
          </Button>
        </div>

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </AuthPage>
  );
}
