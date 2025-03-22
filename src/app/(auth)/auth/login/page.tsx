'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/passwordInput';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginAuth, loginSchema } from '@/types/schema/auth';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthPage } from '../components/auth';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<loginAuth>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: loginAuth) {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await signIn('credentials', {
        redirect: false,
        username: data.username,
        password: data.password,
      });

      if (response?.error) {
        setLoginError('Invalid username or password');
        return;
      }

      window.location.href = '/'
    } catch (error) {
      setLoginError('An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
      reset();
    }
  }

  return (
    <AuthPage>
      <form className="space-y-4 text-white" onSubmit={handleSubmit(onSubmit)}>
        {loginError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">
            {loginError}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="Username ">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="
              Masukkan
              username"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
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
              error={errors.password?.message}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </div>

        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </AuthPage>
  );
}
