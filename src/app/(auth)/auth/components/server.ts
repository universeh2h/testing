'use server';
import { auth } from '@/auth';
import authConfig from '@/auth.config';
import { prisma } from '@/lib/prisma';
import { RegisterAuth, UpdateUser } from '@/types/schema/auth';
import { User } from '@/types/schema/user';
import { hashSync } from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

export type CreateUserResult = {
  success: boolean;
  message: string;
  user?: Partial<User>;
};
function GenerateIdRandom(prefix?  : string) {
    return `${prefix}-${new Date().getTime()}-${Math.random()}`
}
export default async function CreateUser({
  credentials,
}: {
  credentials: RegisterAuth;
}): Promise<CreateUserResult> {
  try {
    // Validate input using Zod schema
    const validatedData = {
      ...credentials,
      whatsapp: credentials.whatsapp?.toString(),
    };

    // Check if user already exists
    const existingUser = await findUserByUsername(validatedData.username);
    if (existingUser) {
      return {
        success: false,
        message: 'Username sudah terpakai',
      };
    }

    // Hash password
    const hashedPassword = hashSync(validatedData.password, 10);

    // Create user
    const user = await prisma.users.create({
      data: {
        ...validatedData,
        password: hashedPassword,
        role: 'Member',
            balance: 0,
        apiKey : GenerateIdRandom(validatedData.username),
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
      },
    });

    return {
      success: true,
      message: 'register created succesfully',
      user,
    };
  } catch (error) {
    console.error(error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map((err) => err.message).join(', '),
      };
    }

    // Handle unique constraint or other database errors
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || 'Failed to create user',
      };
    }

    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function findUserByUsername(username: string) {
  return await prisma.users.findFirst({
    where: { username },
    select: {
      username: true,
      name: true,
      id: true,
      createdAt: true,
      role: true,
      apiKey: true,
      updatedAt: true,
      whatsapp: true,
    },
  });
}

export async function findUserById(id: number
) {
  const user = await prisma.users.findUnique({
    where: { id },
    select: {
      username: true,
      name: true,
      balance: true,
      id: true,
      createdAt: true,
      role: true,
      apiKey: true,
      otp: true,
      updatedAt: true,
      whatsapp: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    ...user,
    balance: user?.balance.toString(),
  };
}
export async function UpdateUsers({
  credentials,
}: {
  credentials: UpdateUser;
}): Promise<CreateUserResult> {
  try {
    const user = await auth();

    if (!user) {
      return {
        message: 'Unauthorized: No active session',
        success: false,
      };
    }

    // This check is wrong! You're returning an error if the user exists
    // Instead, check if the username is already taken by another user
    if (credentials.username !== user.user.username) {
      const existingUser = await findUserByUsername(credentials.username);
      if (existingUser) {
        return {
          message: 'Username telah Terpakai',
          success: false,
        };
      }
    }

    const data = await prisma.users.update({
      where: {
        id: user.user.id,
      },
      data: {
        username: credentials.username,
        name: credentials.name,
        whatsapp: credentials.whatsapp.toString(),
      },
    });

    return {
      message: 'Profile updated successfully',
      success: true,
      user: { ...data, balance: data.balance.toString() },
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      message:
        error instanceof Error ? error.message : 'Failed to update profile',
      success: false,
    };
  }
}


export async  function getProfile() {
  const session = await getServerSession(authConfig);
  
  if (!session) {
    return null
  }
  return {
    session : session?.user
  }
}
