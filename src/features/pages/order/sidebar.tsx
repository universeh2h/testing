import { Category } from '@/types/category';
import Image from 'next/image';
import { JSX } from 'react';

export function SidebarOrder({
  category,
}: {
  category: Category;
}): JSX.Element {
  return (
    <div className="space-y-6">
      {/* Game Info */}
      <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-800/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={category.thumbnail}
              alt={category.nama}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {category.nama}
            </h3>
            <p className="text-sm text-gray-300">{category.subNama}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-blue-950/50 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Category</p>
            <p className="text-sm text-white font-medium">{category.tipe}</p>
          </div>
          <div className="bg-blue-950/50 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Status</p>
            <p className="text-sm text-white font-medium capitalize">
              {category.status}
            </p>
          </div>
        </div>
      </div>

      {/* How To Order */}
      <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">How To Order</h3>
        <div
          className="text-sm text-gray-300 space-y-1"
          dangerouslySetInnerHTML={{ __html: category.ketLayanan ?? '' }}
        ></div>
      </div>
    </div>
  );
}
