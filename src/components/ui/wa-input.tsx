'use client';
import type React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Phone } from 'lucide-react';
import { forwardRef, useState } from 'react';

interface WhatsAppInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  countryCode?: number;
}

const WhatsAppInput = forwardRef<HTMLInputElement, WhatsAppInputProps>(
  ({ className, error, countryCode = 62, onChange, value, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<string>(
      value ? String(value).replace(countryCode.toString(), '') : ''
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Remove any non-numeric characters
      const numericValue = e.target.value.replace(/\D/g, '');
      setInputValue(numericValue);

      // Call the original onChange with the full number (country code + input)
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: numericValue ? `${countryCode}${numericValue}` : '',
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div className="relative">
        <div className="flex">
          {/* Country code section with white background */}
          <div className="flex items-center bg-white text-black rounded-l-md border border-r-0 border-input px-3 min-w-[4.5rem]">
            <Phone className="h-4 w-4 text-gray-500 mr-1" />
            <span>+{countryCode}</span>
          </div>

          {/* Input field */}
          <Input
            type="tel"
            className={cn(
              'rounded-l-none',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            value={inputValue}
            onChange={handleChange}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

WhatsAppInput.displayName = 'WhatsAppInput';

export { WhatsAppInput };
