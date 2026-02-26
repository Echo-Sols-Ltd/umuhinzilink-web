import { toast } from '@/components/ui/use-toast';
import { MESSAGES } from './messages';

export const notify = {
    success: (description: string, title: string = MESSAGES.SUCCESS) => {
        toast.success(description, { title });
    },
    error: (error: unknown, fallbackDescription: string = MESSAGES.UNKNOWN_ERROR, title: string = MESSAGES.ERROR) => {
        const description =
            typeof error === 'string'
                ? error
                : error instanceof Error
                    ? error.message
                    : fallbackDescription;
        toast.error(description, { title });
    },
    warning: (description: string, title: string = MESSAGES.WARNING) => {
        toast.warning(description, { title });
    },
    info: (description: string, title: string = MESSAGES.INFO) => {
        toast.info(description, { title });
    },
    loading: (description: string, title: string = MESSAGES.LOADING) => {
        toast.loading(description, { title });
    },
};
