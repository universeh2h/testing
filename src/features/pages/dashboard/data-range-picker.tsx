'use client';

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

// Custom DateRange type since we're not using react-day-picker
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  date = { from: undefined, to: undefined },
  onDateChange,
  className,
}: DateRangePickerProps) {
  const [dateRange, setDateRange] = useState<DateRange>(date);
  
  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : undefined;
    const newRange = { ...dateRange, from: newDate };
    setDateRange(newRange);
    onDateChange?.(newRange);
  };
  
  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : undefined;
    const newRange = { ...dateRange, to: newDate };
    setDateRange(newRange);
    onDateChange?.(newRange);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            size="sm"
            className={cn(
              'w-[260px] justify-start text-left font-normal bg-card text-card-foreground',
              !dateRange.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'MMM dd, yyyy')} -{' '}
                  {format(dateRange.to, 'MMM dd, yyyy')}
                </>
              ) : (
                format(dateRange.from, 'MMM dd, yyyy')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4 bg-popover text-popover-foreground"
          align="end"
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="from" className="text-sm font-medium">
                    From
                  </label>
                  <Input
                    id="from"
                    type="date"
                    className="w-full"
                    value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                    onChange={handleFromDateChange}
                  />
                </div>
                <div>
                  <label htmlFor="to" className="text-sm font-medium">
                    To
                  </label>
                  <Input
                    id="to"
                    type="date"
                    className="w-full"
                    value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                    onChange={handleToDateChange}
                    min={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined}
                  />
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}