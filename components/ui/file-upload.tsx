'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, File, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadService, UploadProgress } from '@/services/upload';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
  uploadType?: 'profile' | 'message' | 'generic';
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  resizeImage?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface FileUploadState {
  file: File | null;
  preview: string | null;
  uploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  uploadedUrl: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  onFileSelect,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  uploadType = 'generic',
  className,
  disabled = false,
  showPreview = true,
  resizeImage = true,
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.8,
}) => {
  const [state, setState] = useState<FileUploadState>({
    file: null,
    preview: null,
    uploading: false,
    progress: 0,
    error: null,
    success: false,
    uploadedUrl: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const resetState = useCallback(() => {
    if (state.preview) {
      uploadService.revokePreviewUrl(state.preview);
    }
    setState({
      file: null,
      preview: null,
      uploading: false,
      progress: 0,
      error: null,
      success: false,
      uploadedUrl: null,
    });
  }, [state.preview]);

  const handleFileSelect = useCallback(async (file: File) => {
    // Reset previous state
    if (state.preview) {
      uploadService.revokePreviewUrl(state.preview);
    }

    // Validate file
    const validation = uploadService.validateFile(file, {
      maxSize,
      allowedTypes,
      allowedExtensions,
    });

    if (!validation.valid) {
      setState(prev => ({
        ...prev,
        error: validation.error || 'Invalid file',
        file: null,
        preview: null,
      }));
      onUploadError?.(validation.error || 'Invalid file');
      return;
    }

    // Process file
    let processedFile = file;
    
    // Resize image if needed
    if (resizeImage && file.type.startsWith('image/')) {
      try {
        processedFile = await uploadService.resizeImage(file, maxWidth, maxHeight, quality);
      } catch (error) {
        console.warn('Failed to resize image, using original:', error);
      }
    }

    // Create preview
    const preview = showPreview ? uploadService.createPreviewUrl(processedFile) : null;

    setState(prev => ({
      ...prev,
      file: processedFile,
      preview,
      error: null,
      success: false,
    }));

    onFileSelect?.(processedFile);
  }, [maxSize, allowedTypes, allowedExtensions, resizeImage, maxWidth, maxHeight, quality, showPreview, onFileSelect, state.preview, onUploadError]);

  const handleUpload = useCallback(async () => {
    if (!state.file) return;

    setState(prev => ({ ...prev, uploading: true, progress: 0, error: null }));

    try {
      const onProgress = (progress: UploadProgress) => {
        setState(prev => ({ ...prev, progress: progress.percentage }));
      };

      let response;
      switch (uploadType) {
        case 'profile':
          response = await uploadService.uploadUserProfile(state.file, onProgress);
          break;
        case 'message':
          response = await uploadService.uploadMessageFile(state.file, onProgress);
          break;
        default:
          response = await uploadService.uploadGenericFile(state.file, onProgress);
      }

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          uploading: false,
          success: true,
          uploadedUrl: response.data || null,
        }));
        onUploadComplete?.(response.data);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Upload failed';
      setState(prev => ({
        ...prev,
        uploading: false,
        error: errorMessage,
      }));
      onUploadError?.(errorMessage);
    }
  }, [state.file, uploadType, onUploadComplete, onUploadError]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [disabled, handleFileSelect]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleRemove = useCallback(() => {
    resetState();
  }, [resetState]);

  const isImage = state.file?.type.startsWith('image/');

  return (
    <div className={cn('w-full', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          isDragOver ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed',
          state.error && 'border-red-300 bg-red-50',
          state.success && 'border-green-300 bg-green-50'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {state.file ? (
          <div className="space-y-4">
            {/* File Preview */}
            {showPreview && state.preview && isImage ? (
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={state.preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <File className="w-8 h-8 text-gray-400" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{state.file.name}</p>
                  <p className="text-gray-500">{uploadService.formatFileSize(state.file.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {/* Upload Progress */}
            {state.uploading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Uploading... {state.progress}%
                </p>
              </div>
            )}

            {/* Upload Button */}
            {!state.uploading && !state.success && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                disabled={disabled}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Upload File
              </button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
              {accept.includes('image') ? <ImageIcon size={48} /> : <Upload size={48} />}
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Max size: {uploadService.formatFileSize(maxSize)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supported: {allowedExtensions.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {state.error && (
        <div className="mt-3 flex items-center space-x-2 text-red-600">
          <AlertCircle size={16} />
          <span className="text-sm">{state.error}</span>
        </div>
      )}

      {state.success && (
        <div className="mt-3 flex items-center space-x-2 text-green-600">
          <CheckCircle size={16} />
          <span className="text-sm">File uploaded successfully!</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;