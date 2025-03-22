export default function PopularSkeleton() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Popular</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Skeleton cards */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-blue-600/10 rounded-lg border border-transparent animate-pulse"
          >
            <div className="flex space-x-2 p-2 items-center shadow-md shadow-blue-200">
              <div className="relative overflow-hidden rounded-md">
                <div className="size-16 bg-gray-700"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-700 rounded"></div>
                <div className="h-3 w-16 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
