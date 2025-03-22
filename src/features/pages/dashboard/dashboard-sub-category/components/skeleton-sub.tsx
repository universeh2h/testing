import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonSubCategories() {
  return (
    <div className="p-6 space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}
