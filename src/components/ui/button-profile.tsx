'use client';
import type React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { getInitials } from '@/utils/initial-name';

interface ButtonProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  imageUrl?: string;
}

export const ButtonProfile = forwardRef<HTMLDivElement, ButtonProfileProps>(
  ({ username, imageUrl, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center bg-white justify-center rounded-full cursor-pointer transition-colors hover:ring-2 hover:ring-primary/20',
          className
        )}
        {...props}
      >
        <Avatar className="size-7 md:size-9 border-2 border-primary/10">
          <AvatarImage src={imageUrl} alt={username || 'User'} />
          <AvatarFallback className="bg-primary/5 text-primary font-medium">
            {getInitials(username)}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }
);

ButtonProfile.displayName = 'ButtonProfile';
