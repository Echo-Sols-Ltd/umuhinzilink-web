import { notify } from '@/lib/notify';
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
        notify.success(`File ${file} uploaded successfully`, 'Upload successful');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (isCancel(error)) {
        notify.error(`Upload for ${file} was cancelled`, 'Upload cancelled');
      } else if (isAxiosError(error)) {
        notify.error(
          error?.message?.includes('timeout')
            ? `Upload for ${file.name} timed out`
            : `Failed to upload ${file.name}`,
          'File upload failed'
        );
      } else {
        notify.error('Please try again later', 'File upload failed');
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
