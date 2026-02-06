import { ApiResponse } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export class UploadService {
  // Upload user profile image
  async uploadUserProfile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<ApiResponse<string>> {
    try {
      const response = await apiClient.uploadFile<ApiResponse<string>>(
        API_ENDPOINTS.FILES.UPLOAD_AVATAR,
        file,
        (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage,
            });
          }
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Upload message file
  async uploadMessageFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<ApiResponse<string>> {
    try {
      const response = await apiClient.uploadFile<ApiResponse<string>>(
        API_ENDPOINTS.FILES.UPLOAD_MESSAGE,
        file,
        (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage,
            });
          }
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Upload generic file
  async uploadGenericFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<ApiResponse<string>> {
    try {
      const response = await apiClient.uploadFile<ApiResponse<string>>(
        API_ENDPOINTS.FILES.UPLOAD_GENERIC,
        file,
        (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage,
            });
          }
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Validate file before upload
  validateFile(file: File, options?: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  }): { valid: boolean; error?: string } {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    } = options || {};

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${this.formatFileSize(maxSize)}`
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check file extension
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return {
        valid: false,
        error: `File extension ${fileExtension} is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`
      };
    }

    return { valid: true };
  }

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Create image preview URL
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  // Revoke preview URL to free memory
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  // Resize image before upload (client-side)
  async resizeImage(
    file: File,
    maxWidth: number = 800,
    maxHeight: number = 600,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}

export const uploadService = new UploadService();