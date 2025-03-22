'use client';

import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  showStrengthMeter?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { className, error, showStrengthMeter = false, onChange, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState(0);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const calculateStrength = (value: string) => {
      let score = 0;

      // Length check
      if (value.length >= 8) score += 1;

      // Character variety checks
      if (/[A-Z]/.test(value)) score += 1;
      if (/[a-z]/.test(value)) score += 1;
      if (/[0-9]/.test(value)) score += 1;
      if (/[^A-Za-z0-9]/.test(value)) score += 1;

      setStrength(score);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPassword = e.target.value;
      setPassword(newPassword);

      if (showStrengthMeter) {
        calculateStrength(newPassword);
      }

      if (onChange) {
        onChange(e);
      }
    };

    const getStrengthLabel = () => {
      if (password.length === 0) return '';
      if (strength <= 2) return 'Lemah';
      if (strength <= 4) return 'Sedang';
      return 'Kuat';
    };

    const getStrengthColor = () => {
      if (password.length === 0) return 'bg-gray-200';
      if (strength <= 2) return 'bg-red-500';
      if (strength <= 4) return 'bg-yellow-500';
      return 'bg-green-500';
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'pr-10',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            value={password}
            onChange={handlePasswordChange}
            ref={ref}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {showStrengthMeter && password.length > 0 && (
          <div className="space-y-1">
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: `${(strength / 5) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Password strength:{' '}
              <span className="font-medium">{getStrengthLabel()}</span>
            </p>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
