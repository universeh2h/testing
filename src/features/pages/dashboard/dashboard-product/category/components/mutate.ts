'use server';
import { prisma } from '@/lib/prisma';
import { FormCategory, FormValuesCategory } from '@/types/schema/categories';
import { Categories } from '@prisma/client';

export async function CreateCategory({
  req,
}: {
  req: FormValuesCategory;
}): Promise<{ status: boolean; message: string; data?: Categories }> {
  const validate = FormCategory.parse(req);

  if (!validate) {
    return {
      message: 'invalid data',
      status: false,
    };
  }

  const categories = await prisma.categories.create({
    data: {
      ...validate,
    },
  });

  return {
    message: 'success',
    status: true,
    data: categories,
  };
}

export async function UpdateCategory({
  req,
  id,
}: {
  req: Partial<FormValuesCategory>;
  id: number;
}): Promise<{ status: boolean; message: string; data?: Categories }> {
  const validate = FormCategory.parse(req);

  if (!validate) {
    return {
      message: 'invalid data',
      status: false,
    };
  }

  const categories = await prisma.categories.update({
    where: {
      id,
    },
    data: {
      ...validate,
    },
  });

  return {
    message: 'success',
    status: true,
    data: categories,
  };
}

export async function DeleteCategory({
  id,
}: {
  id: number;
}): Promise<{ status: boolean; message: string }> {
  await prisma.categories.delete({
    where: {
      id,
    },
  });

  return {
    message: 'success',
    status: true,
  };
}
