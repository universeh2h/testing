'use client';

import type React from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Info } from 'lucide-react';
import type { Category } from '@/types/category';

interface ServerOption {
  name: string;
  value: string;
}

type ServerData = string[] | ServerOption[];

interface PlaceholderContentType {
  userId?: string;
  serverId?: string;
  onChangeUserId?: (value: string) => void;
  onChangeServerId?: (value: string) => void;
  category: Category;
  serverData?: ServerData;
}

export function PlaceholderContent({
  category,
  onChangeServerId,
  onChangeUserId,
  serverId = '',
  userId = '',
  serverData,
}: PlaceholderContentType) {
  const hasSecondInput =
    category.placeholder2 &&
    category.placeholder2 !== '-' &&
    category.placeholder2 !== '.' &&
    category.placeholder2 !== '2' &&
    category.placeholder2 != 'h';
  const shouldUseDropdown =
    hasSecondInput && serverData && serverData.length > 0;

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeUserId) {
      onChangeUserId(e.target.value);
    }
  };

  const handleServerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeServerId) {
      onChangeServerId(e.target.value);
    }
  };

  const handleServerSelectChange = (value: string) => {
    if (onChangeServerId) {
      onChangeServerId(value);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 gap-4 w-full">
      <div className="flex flex-col space-y-2 w-full">
        <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
          {category.placeholder1}
          {category.placeholder1 === 'User ID' && (
            <span className="tooltip" title="Enter your User ID">
              <Info size={16} className="text-gray-400" />
            </span>
          )}
        </label>
        <Input
          value={userId ?? ''}
          onChange={handleUserIdChange}
          placeholder={`${category.placeholder1}`}
          className="w-full rounded-lg px-2 py-1 placeholder:text-gray-500 text-white border-2 border-blue-500 focus-visible:ring-0 focus-visible:border-blue-900"
        />
      </div>

      {hasSecondInput && (
        <div className="flex flex-col space-y-2 w-full">
          <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
            {category.placeholder2}
            {category.placeholder2 === 'Server' && (
              <span className="tooltip" title="Enter your Server ID">
                <Info size={16} className="text-gray-400" />
              </span>
            )}
          </label>

          {shouldUseDropdown ? (
            <Select value={serverId} onValueChange={handleServerSelectChange}>
              <SelectTrigger className="w-full rounded-lg px-2 py-1 text-white border-2 border-blue-500 focus-visible:ring-0 focus-visible:border-blue-900">
                <SelectValue placeholder={`Pilih ${category.placeholder2}`} />
              </SelectTrigger>
              <SelectContent className="bg-[#0a192f] border-blue-700">
                {serverData.map((server, index) => {
                  // Handle both string arrays and object arrays
                  const value =
                    typeof server === 'string' ? server : server.value;
                  const label =
                    typeof server === 'string' ? server : server.name;

                  return (
                    <SelectItem
                      key={index}
                      value={value}
                      className="text-white hover:bg-blue-800"
                    >
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={serverId ?? ''}
              onChange={handleServerIdChange}
              placeholder={`${category.placeholder2}`}
              className="w-full rounded-lg px-2 py-1 placeholder:text-gray-500 text-white border-2 border-blue-500 focus-visible:ring-0 focus-visible:border-blue-900"
            />
          )}
        </div>
      )}
    </div>
  );
}
