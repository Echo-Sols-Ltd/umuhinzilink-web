import { useToast } from '@/components/ui/toast/Toast';
import axios, { isAxiosError, isCancel } from 'axios';
import { useTranslation } from 'react-i18next';
import { userService } from '@/services/users';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function useUserAction() {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { updateAvatar } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<
    { file: string; progress: number; cancel: () => void }[]
  >([]);

  const uploadFile = async (file: string) => {
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
        showToast({
          title: t('success.uploadSuccess'),
          description: t('success.uploadSuccessFor', { file }),
          type: 'default',
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (isCancel(error)) {
        showToast({
          title: t('errors.uploadCancelled'),
          description: t('errors.uploadCancelledFor', { file }),
          type: 'default',
        });
      } else if (isAxiosError(error)) {
        showToast({
          title: t('errors.fileUploadFailed'),
          description: error?.message?.includes('timeout')
            ? t('errors.uploadTimedOut', { file })
            : t('errors.failedToUpload', { file }),
          type: 'error',
        });
      } else {
        showToast({
          title: t('errors.fileUploadFailed'),
          description: t('errors.retryLater'),
          type: 'error',
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
