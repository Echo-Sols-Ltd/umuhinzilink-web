import { toast } from '@/components/ui/use-toast';
import axios, { isAxiosError, isCancel } from 'axios';
import { userService } from '@/services/users';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function useUserAction() {
  const { updateAvatar } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<
    { file: File; progress: number; cancel: () => void }[]
  >([]);

  const uploadFile = async (file: File) => {
    setLoading(true);
    const source = axios.CancelToken.source();
    setUploadingFiles(prev => [...prev, { file, progress: 0, cancel: source.cancel }]);
    try {
      const response = await userService.uploadAvatar(
        file,
        (event: import('axios').AxiosProgressEvent) => {
          const percent = event.total ? Math.round((event.loaded * 100) / event.total) : 0;
          setUploadingFiles(prev =>
            prev.map(f => (f.file === file ? { ...f, progress: percent } : f))
          );
        },
        source.token,
        60000
      );

      if (response.success && response.data) {
        updateAvatar(response.data);
        setLoading(false);
        toast({
          title: 'Upload successful',
          description: `File ${file} uploaded successfully`,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (isCancel(error)) {
        toast({
          title: 'Upload cancelled',
          description: `Upload for ${file} was cancelled`,
        });
      } else if (isAxiosError(error)) {
        toast({
          title: 'File upload failed',
          description: error?.message?.includes('timeout')
            ? `Upload for ${file} timed out`
            : `Failed to upload ${file}`,
          variant: 'error',
        });
      } else {
        toast({
          title: 'File upload failed',
          description: 'Please try again later',
          variant: 'error',
        });
      }
    } finally {
      setUploadingFiles(prev => prev.filter(f => f.file !== file));
    }
  };
  return {
    uploadFile,
    uploadingFiles,
    loading,
  };
}
