'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types/schema/user';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { UpdateUser } from '@/types/schema/auth';
import { toast } from 'sonner';
import { WhatsAppInput } from '@/components/ui/wa-input';
import { UpdateUsers } from '@/app/(auth)/auth/components/server';

export function FormUpdateUser({ user }: { user: User }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateUser>({
    defaultValues: {
      username: user.username ?? '',
      name: user.name ?? '',
      whatsapp: user.whatsapp ? parseInt(user.whatsapp) : undefined,
    },
  });

  const onSubmit = async (data: UpdateUser) => {
    try {
      setIsSubmitting(true);
      const result = await UpdateUsers({ credentials: data });

      if (result.success) {
        setUpdateSuccess(true);
        toast.success(result.message);
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error updating profile'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  // Custom handler for WhatsApp input
  const handleWhatsAppChange = (value: string) => {
    setValue('whatsapp', value ? Number.parseInt(value) : 62);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} type="text" />
        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message?.toString()}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register('username')} />
        {errors.username && (
          <p className="text-sm text-red-500">
            {errors.username.message?.toString()}
          </p>
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

      {updateSuccess && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md">
          Profile updated successfully!
        </div>
      )}

      <Button
        type="submit"
        className="bg-orange-500 hover:bg-orange-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
