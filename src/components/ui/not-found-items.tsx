export function NotFoundItems({
  text = 'Item  tidak ditemukan',
  subText = 'Tidak ada item yang ditemukan dengan filter yang dipilih',
}: {
  text?: string;
  subText?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-60 p-6">
      <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-muted-foreground"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium">{text}</h3>
      <p className="text-muted-foreground text-sm mt-1">{subText}</p>
    </div>
  );
}
