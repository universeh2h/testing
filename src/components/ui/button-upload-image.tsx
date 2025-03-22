import { useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ButtonUploadImageProps {
  onUpload: (file: File, type: string) => void;
  imageUrl: string;
  className?: string;
  type: string;
}

export function ButtonUploadImage({
  imageUrl,
  className,
  type,
  onUpload,
}: ButtonUploadImageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      // Validate file size (e.g., 5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setError(null);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = () => {
    if (file) {
      setLoading(true);
      onUpload(file, type);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 space-y-2">
      <div
        className={cn(
          `relative w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors`,
          className
        )}
        onClick={handleClick}
      >
        {preview || imageUrl ? (
          <Image
            src={preview || imageUrl}
            alt="Preview"
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Click to upload image</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      )}
    </div>
  );
}
