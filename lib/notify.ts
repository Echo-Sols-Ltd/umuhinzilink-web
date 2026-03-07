import { toast } from '@/components/ui/use-toast';
import { MESSAGES } from './messages';
import { translate } from '@/lib/i18n';
import { getStoredLocale } from '@/lib/language-switch';

export const notify = {
    success: (description: string, title: string = MESSAGES.SUCCESS) => {
        const locale = getStoredLocale();
        toast.success(translate(locale, description), { title: translate(locale, title) });
    },
    error: (error: unknown, fallbackDescription: string = MESSAGES.UNKNOWN_ERROR, title: string = MESSAGES.ERROR) => {
        const description =
            typeof error === 'string'
                ? error
                : error instanceof Error
                    ? error.message
                    : fallbackDescription;
        const locale = getStoredLocale();
        toast.error(translate(locale, description), { title: translate(locale, title) });
    },
    warning: (description: string, title: string = MESSAGES.WARNING) => {
        const locale = getStoredLocale();
        toast.warning(translate(locale, description), { title: translate(locale, title) });
    },
    info: (description: string, title: string = MESSAGES.INFO) => {
        const locale = getStoredLocale();
        toast.info(translate(locale, description), { title: translate(locale, title) });
    },
    loading: (description: string, title: string = MESSAGES.LOADING) => {
        const locale = getStoredLocale();
        toast.loading(translate(locale, description), { title: translate(locale, title) });
    },
};
