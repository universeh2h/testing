import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Phone, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ButtonProfile } from '@/components/ui/button-profile';
import { FlashingButton } from '@/components/ui/flashing-button';
import { MyOrder } from './my-order';
import Link from 'next/link';
import { findUserById, getProfile } from '@/app/(auth)/auth/components/server';

export default async function ProfilePage() {
  const session = await getProfile()
  const user = await findUserById(session?.session.id as number);

  return (
    <main className="container mx-auto px-4 text-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-md backdrop-blur-lg bg-gray-50/20">
            <CardHeader className=" text-white">
              <CardTitle className="text-xl font-semibold">
                Profile Information
              </CardTitle>
            </CardHeader>

            <CardContent className="">
              <div className="flex items-start gap-4">
                <ButtonProfile username={user?.username as string} />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">
                      {user?.username}
                    </h3>
                    <Link href={'/profile/settings'}>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-gray-500 text-white"
                        aria-label="Settings"
                      >
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <Badge variant="outline" className="px-2 py-0.5 text-xs ">
                    {session?.session.role}
                  </Badge>
                </div>
              </div>
            </CardContent>

            <Separator className="my-2" />

            <CardFooter className="">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="h-4 w-4" />
                <span>{user?.whatsapp || 'No phone number'}</span>
              </div>
            </CardFooter>
          </Card>

          <div className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-800 to-blue-800/30 rounded-lg p-8 shadow-sm">
            <div className="text-center mb-6 space-y-2">
              <h3 className="text-xl font-medium text-white">
                Upgrade Your Account
              </h3>
              <p className="text-sm text-muted-foreground">
                Get access to premium features and benefits
              </p>
            </div>
            <Link href={'/profile/deposit'}>
              <FlashingButton />
            </Link>
          </div>
        </div>
        <MyOrder />
      </div>
    </main>
  );
}
