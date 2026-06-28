'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Loader2, Save } from '@/lib/icons';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import PageLoading from '@/components/layout/PageLoading';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { userService } from '@/services/users';
import { uploadService } from '@/services/upload';
import { notify } from '@/lib/notify';
import { Language, UserRole } from '@/types';
import { imageUrl } from '@/lib/utils';

const STORAGE_KEYS = { USER: 'user' };

export default function ProfileEditPage() {
  const { t } = useI18n();
  const { user, loading: authLoading, loadAuthState } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    profilePicture: '',
    language: Language.ENGLISH,
  });
  const [sellerForm, setSellerForm] = useState({
    displayName: '',
    location: '',
    description: '',
    phone: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/signin?redirect=/profile/edit');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phoneNumber: user.phoneNumber ?? '',
      profilePicture: user.profilePicture ?? '',
      language: user.language ?? Language.ENGLISH,
    });

    if (user.role === UserRole.SELLER) {
      userService.getSellerMe().then((res) => {
        if (res.success && res.data) {
          setSellerForm({
            displayName: res.data.displayName ?? '',
            location: res.data.location ?? '',
            description: res.data.description ?? '',
            phone: res.data.phone ?? '',
          });
        }
      }).catch(() => {});
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const validation = uploadService.validateFile(file);
    if (!validation.valid) {
      notify.error(validation.error ?? t('profile.edit.toast.invalidFile'), t('profile.actions.upload'));
      return;
    }

    setUploading(true);
    try {
      const resized = await uploadService.resizeImage(file, 400, 400);
      const res = await uploadService.uploadUserProfile(resized);
      if (res.success && res.data) {
        setForm(prev => ({ ...prev, profilePicture: res.data! }));
        notify.success(t('profile.edit.toast.photoUploaded'), t('common.success'));
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch {
      notify.error(t('profile.edit.toast.uploadFailed'), t('common.error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!form.firstName.trim() || !form.lastName.trim()) {
      notify.error(t('profile.edit.validation.namesRequired'), t('common.warning'));
      return;
    }

    setSaving(true);
    try {
      const res = await userService.updateProfile(user.id, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        profilePicture: form.profilePicture,
        language: form.language,
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to update profile');
      }

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data));
      await loadAuthState();
      applyLocale(languageToLocale(form.language));

      if (user.role === UserRole.SELLER) {
        await userService.updateSellerProfile(user.id, sellerForm);
      }

      notify.success(t('profile.edit.toast.saved'), t('common.saved'));
      router.push('/profile');
    } catch (err) {
      notify.error(err instanceof Error ? err.message : t('profile.edit.toast.saveFailed'), t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return <PageLoading label={t('profile.edit.loadingLabel')} description={t('profile.edit.loadingDescription')} />;
  }

  const initials = `${form.firstName[0] ?? ''}${form.lastName[0] ?? ''}`.toUpperCase();

  return (
    <AppLayout maxWidth="max-w-2xl">
      <PageHeader
        title={t('profile.edit.title')}
        description={t('profile.edit.description')}
        backHref="/profile"
        backLabel={t('profile.edit.backLabel')}
        actions={
          <Button
            onClick={handleSave}
            disabled={saving || uploading}
            className="rounded-xl bg-green-600 hover:bg-green-700">
            {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
            {t('profile.edit.saveChanges')}
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-20 h-20 rounded-2xl bg-green-100 dark:bg-green-900 flex items-center justify-center overflow-hidden border border-border group">
            {form.profilePicture ? (
              <img src={imageUrl(form.profilePicture)} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-green-700 dark:text-green-300">{initials || 'U'}</span>
            )}
            <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {uploading ? <Loader2 size={18} className="text-white animate-spin" /> : <Camera size={18} className="text-white" />}
            </span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <div>
            <p className="text-sm font-semibold text-foreground">{t('profile.edit.profilePhoto')}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t('profile.edit.photoHint')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('profile.fields.firstName')}</label>
            <Input
              value={form.firstName}
              onChange={e => setForm(prev => ({ ...prev, firstName: e.target.value }))}
              className="h-11 rounded-xl bg-muted/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('profile.fields.lastName')}</label>
            <Input
              value={form.lastName}
              onChange={e => setForm(prev => ({ ...prev, lastName: e.target.value }))}
              className="h-11 rounded-xl bg-muted/50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('profile.fields.email')}</label>
          <Input value={user.email} disabled className="h-11 rounded-xl bg-muted/30" />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('profile.fields.phone')}</label>
          <Input
            value={form.phoneNumber}
            onChange={e => setForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
            placeholder="+250 7XX XXX XXX"
            className="h-11 rounded-xl bg-muted/50"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('profile.edit.language')}</label>
          <select
            value={form.language}
            onChange={e => setForm(prev => ({ ...prev, language: e.target.value as Language }))}
            className="w-full h-11 px-3 text-sm bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value={Language.ENGLISH}>{t('settings.localization.options.language.en')}</option>
            <option value={Language.KINYARWANDA}>{t('settings.localization.options.language.rw')}</option>
            <option value={Language.FRENCH}>{t('settings.localization.options.language.fr')}</option>
          </select>
        </div>

        {user.role === UserRole.SELLER && (
          <div className="pt-4 border-t border-border space-y-4">
            <h2 className="text-sm font-bold text-foreground">{t('profile.edit.sellerProfile')}</h2>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('profile.edit.businessName')}</label>
              <Input
                value={sellerForm.displayName}
                onChange={e => setSellerForm(prev => ({ ...prev, displayName: e.target.value }))}
                className="h-11 rounded-xl bg-muted/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('profile.edit.location')}</label>
              <Input
                value={sellerForm.location}
                onChange={e => setSellerForm(prev => ({ ...prev, location: e.target.value }))}
                className="h-11 rounded-xl bg-muted/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('profile.edit.descriptionLabel')}</label>
              <textarea
                value={sellerForm.description}
                onChange={e => setSellerForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2.5 text-sm bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
