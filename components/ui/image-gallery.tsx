'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Eye, Download, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ImageItem {
  id: string;
  url: string;
  name: string;
  size?: number;
  uploadedAt?: string;
}

export interface ImageGalleryProps {
  images: ImageItem[];
  onDelete?: (id: string) => void;
  onSelect?: (image: ImageItem) => void;
  selectedId?: string;
  className?: string;
  showActions?: boolean;
  columns?: number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onDelete,
  onSelect,
  selectedId,
  className,
  showActions = true,
  columns = 4,
}) => {
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);

  const handlePreview = (image: ImageItem) => {
    setPreviewImage(image);
  };

  const handleDownload = async (image: ImageItem) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = image.name || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[columns] || 'grid-cols-4';

  if (images.length === 0) {
    return (
      <div className={cn('text-center py-12 text-gray-500', className)}>
        <p>No images uploaded yet</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn(`grid ${gridCols} gap-4`, className)}>
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              'relative group bg-white rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md',
              selectedId === image.id && 'ring-2 ring-green-500'
            )}
            onClick={() => onSelect?.(image)}
          >
            {/* Image */}
            <div className="aspect-square relative">
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Overlay with actions */}
              {showActions && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(image);
                      }}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                      title="Preview"
                    >
                      <Eye size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image);
                      }}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                      title="Download"
                    >
                      <Download size={16} className="text-gray-600" />
                    </button>
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(image.id);
                        }}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Image info */}
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 truncate" title={image.name}>
                {image.name}
              </p>
              <div className="flex justify-between items-center mt-1">
                {image.size && (
                  <span className="text-xs text-gray-500">
                    {formatFileSize(image.size)}
                  </span>
                )}
                {image.uploadedAt && (
                  <span className="text-xs text-gray-500">
                    {new Date(image.uploadedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <div className="relative">
              <Image
                src={previewImage.url}
                alt={previewImage.name}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-white font-medium">{previewImage.name}</p>
              {previewImage.size && (
                <p className="text-gray-300 text-sm">
                  {formatFileSize(previewImage.size)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;