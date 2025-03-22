'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CategoryTypeSelectorProps {
  initialType?: string;
  onTypeChange: (type: string) => void;
  className?: string;
}

export function CategoryTypeSelector({
  initialType = 'gamelainnya',
  onTypeChange,
  className = '',
}: CategoryTypeSelectorProps) {
  const [categoryType, setCategoryType] = useState(initialType);

  const categoryTypes = [
    { id: 'gamelainnya', label: 'Games' },
    { id: 'pulsa', label: 'Pulsa' },
    { id: 'voucher', label: 'Voucher' },
  ];

  const handleTypeChange = (type: string) => {
    setCategoryType(type);
    onTypeChange(type);
  };

  useEffect(() => {
    if (initialType !== categoryType) {
      setCategoryType(initialType);
      onTypeChange(categoryType);
    }
  }, [initialType, categoryType, onTypeChange]);

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {categoryTypes.map((type) => {
        const isActive = categoryType === type.id;

        return (
          <button
            key={type.id}
            onClick={() => handleTypeChange(type.id)}
            className={`
              relative overflow-hidden rounded-lg font-medium text-sm transition-all duration-300
              py-2.5 px-5 shadow-sm
              ${
                isActive
                  ? 'text-white'
                  : 'text-orange-600 hover:text-orange-800'
              }
              
            `}
          >
            {/* Background with gradient */}
            <span
              className={`
                absolute inset-0 transition-all duration-300
                ${
                  isActive
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 border-b-4 border-orange-700'
                    : 'bg-white border border-orange-200 hover:border-orange-300'
                }
              `}
            />

            {/* Text content */}
            <span className="relative z-10">{type.label}</span>

            {/* Active indicator - animated underline */}
            {isActive && (
              <motion.span
                layoutId="activeIndicator"
                className="absolute bottom-0 left-0 right-0 h-1 bg-orange-300/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Shine effect on hover */}
            <span
              className={`
                absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                -translate-x-full group-hover:translate-x-full transition-transform duration-1000
                ${isActive ? 'opacity-30' : 'opacity-0 group-hover:opacity-20'}
              `}
            />
          </button>
        );
      })}
    </div>
  );
}
