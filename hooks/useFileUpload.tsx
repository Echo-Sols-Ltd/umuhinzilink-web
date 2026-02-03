import { useState, useCallback } from 'react';
import { uploadService, UploadProgress } from '@/services/upload';
import { useToast } from '@/components/ui/use-toast';

export interface UseFileUploadOptions {
  uploadType?: 'profile' | 'message' | 'generic';
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
  resizeImage?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
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

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const { toast } = useToast()
  const {
    uploadType = 'generic',
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    resizeImage = true,
    maxWidth = 800,
    maxHeight = 600,
    quality = 0.8,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<FileUploadState>({
    file: null,
    preview: null,
    uploading: false,
    progress: 0,
    error: null,
    success: false,
    uploadedUrl: null,
  });

  const reset = useCallback(() => {
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

  const selectFile = useCallback(async (file: File) => {
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
      const errorMessage = validation.error || 'Invalid file';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        file: null,
        preview: null,
      }));
      onError?.(errorMessage);
      toast({
        title: "File Error",
        description: errorMessage,
        variant: "error",
      });
      return false;
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
    const preview = uploadService.createPreviewUrl(processedFile);

    setState(prev => ({
      ...prev,
      file: processedFile,
      preview,
      error: null,
      success: false,
    }));

    return true;
  }, [maxSize, allowedTypes, allowedExtensions, resizeImage, maxWidth, maxHeight, quality, state.preview, onError]);

  const upload = useCallback(async (): Promise<string | null> => {
    if (!state.file) {
      const errorMessage = 'No file selected';
      setState(prev => ({ ...prev, error: errorMessage }));
      onError?.(errorMessage);
      return null;
    }

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

        onSuccess?.(response.data);
        toast({
          title: "Upload Successful",
          description: "File uploaded successfully!",
          variant:'success'
        });

        return response.data;
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

      onError?.(errorMessage);
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "error",
      });

      return null;
    }
  }, [state.file, uploadType, onSuccess, onError]);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const selected = await selectFile(file);
    if (!selected) return null;

    return await upload();
  }, [selectFile, upload]);

  return {
    state,
    selectFile,
    upload,
    uploadFile,
    reset,
    // Utility functions
    formatFileSize: uploadService.formatFileSize,
    createPreviewUrl: uploadService.createPreviewUrl,
    revokePreviewUrl: uploadService.revokePreviewUrl,
  };
};