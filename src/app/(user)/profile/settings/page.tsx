
import { FormUpdateUser } from './form-update-user';
import { User } from '@/types/schema/user';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { findUserById, getProfile } from '@/app/(auth)/auth/components/server';

export default async function ProfileSettings() {
  const session = await getProfile();
  const user = await findUserById(session?.session.id as number);

  return (
    <main className="container mx-auto px-4 py-10 min-h-screen pt-24 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-1 mr-4">
            <Link href="/profile" className="bg-white text-black">
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
            <Separator className="" />
          </CardHeader>
          <CardContent className="">
            <FormUpdateUser user={user as User} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
