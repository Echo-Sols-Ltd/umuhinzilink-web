'use client';

import React, { useState, useCallback } from 'react';
import { Upload, Folder, File, Image as ImageIcon, Trash2, Search, Grid, List } from 'lucide-react';
import FileUpload from './file-upload';
import ImageGallery, { ImageItem } from './image-gallery';
import { cn } from '@/lib/utils';

export interface FileItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'other';
  size: number;
  uploadedAt: string;
  mimeType: string;
}

export interface FileManagerProps {
  files: FileItem[];
  onUpload?: (url: string, file: File) => void;
  onDelete?: (id: string) => void;
  onSelect?: (file: FileItem) => void;
  selectedId?: string;
  uploadType?: 'profile' | 'message' | 'generic';
  allowMultiple?: boolean;
  showUpload?: boolean;
  showSearch?: boolean;
  className?: string;
  maxFiles?: number;
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  onUpload,
  onDelete,
  onSelect,
  selectedId,
  uploadType = 'generic',
  allowMultiple = true,
  showUpload = true,
  showSearch = true,
  className,
  maxFiles,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'documents'>('all');

  // Filter files based on search and type
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || 
      (filterType === 'images' && file.type === 'image') ||
      (filterType === 'documents' && file.type === 'document');
    
    return matchesSearch && matchesType;
  });

  // Convert files to image items for gallery
  const imageFiles: ImageItem[] = filteredFiles
    .filter(file => file.type === 'image')
    .map(file => ({
      id: file.id,
      url: file.url,
      name: file.name,
      size: file.size,
      uploadedAt: file.uploadedAt,
    }));

  const handleUploadComplete = useCallback((url: string) => {
    // This would typically be handled by the parent component
    // The parent should add the new file to the files array
    console.log('File uploaded:', url);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: FileItem) => {
    switch (file.type) {
      case 'image':
        return <ImageIcon size={20} className="text-blue-500" />;
      case 'document':
        return <File size={20} className="text-green-500" />;
      default:
        return <File size={20} className="text-gray-500" />;
    }
  };

  const canUploadMore = !maxFiles || files.length < maxFiles;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">File Manager</h3>
          <p className="text-sm text-gray-500">
            {files.length} file{files.length !== 1 ? 's' : ''} 
            {maxFiles && ` (${files.length}/${maxFiles})`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-l-lg transition-colors',
                viewMode === 'grid' ? 'bg-green-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              )}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-r-lg transition-colors',
                viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              )}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      {showSearch && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Files</option>
            <option value="images">Images</option>
            <option value="documents">Documents</option>
          </select>
        </div>
      )}

      {/* Upload Area */}
      {showUpload && canUploadMore && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <FileUpload
            onUploadComplete={handleUploadComplete}
            uploadType={uploadType}
            className="border-none p-0"
          />
        </div>
      )}

      {/* Files Display */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Folder size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No files found</p>
          <p className="text-sm">
            {searchTerm ? 'Try adjusting your search terms' : 'Upload some files to get started'}
          </p>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && filterType !== 'documents' && (
            <ImageGallery
              images={imageFiles}
              onDelete={onDelete}
              onSelect={(image) => {
                const file = files.find(f => f.id === image.id);
                if (file) onSelect?.(file);
              }}
              selectedId={selectedId}
              columns={4}
            />
          )}

          {/* List View or Documents */}
          {(viewMode === 'list' || filterType === 'documents') && (
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFiles.map((file) => (
                      <tr
                        key={file.id}
                        className={cn(
                          'hover:bg-gray-50 cursor-pointer',
                          selectedId === file.id && 'bg-green-50'
                        )}
                        onClick={() => onSelect?.(file)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getFileIcon(file)}
                            <span className="ml-3 text-sm font-medium text-gray-900 truncate max-w-xs">
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {file.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {onDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(file.id);
                              }}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FileManager;