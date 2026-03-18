'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  User,
  Phone,
  MapPin,
  Mail,

  Loader2,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/shared/Sidebar';
import { FarmerPages, UserType } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import { imageUrl } from '@/lib/utils';
import { userService } from '@/services/users';

const inputClass =
  'w-full px-3 py-2 border border-border bg-card rounded-md focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition';

type FarmerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  district?: string;
  province?: string;
  farmSize?: string;
  crops?: string[];
  experienceLevel?: string;
  createdAt?: string;
  updatedAt?: string;
};

import { useI18n } from '@/contexts/I18nContext';

function FarmerProfileComponent() {
  const { t, locale } = useI18n();
  const { user: currentUser, logout } = useAuth();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoutPending, setLogoutPending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { updateAvatar } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setError(t('common.error'));
      return;
    }
    setProfile(currentUser);
    setLoading(false);
  }, [currentUser, t]);

  const handleLogout = async () => {
    if (logoutPending) return;
    setLogoutPending(true);
    logout();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    try {
      const res = await userService.uploadAvatar(imageFile)
      updateAvatar(res.data!)
      toast.success(t('farmer.profile.toasts.imageUpdatedDesc'), {
        title: t('farmer.profile.toasts.imageUpdated')
      });
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(t('farmer.profile.toasts.uploadFailedDesc'), {
        title: t('farmer.profile.toasts.uploadFailed')
      });
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(locale === 'rw' ? 'rw-RW' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const displayName = profile?.firstName || currentUser?.firstName || t('sidebar.roles.farmer');
  const [firstName, ...restNames] = displayName.split(' ');
  const lastName = restNames.join(' ');

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar
        userType={UserType.FARMER}
        activeItem='Profile'
      />

      <main className="flex-1 h-full bg-background overflow-auto">
        <header className="bg-card border-b h-16 flex items-center px-6 shadow-sm justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold">{t('farmer.profile.title')}</h1>
            <p className="text-xs text-muted-foreground">{t('farmer.profile.subtitle')}</p>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          {loading ? (
            <div className="bg-card border border-border rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-success" />
              <p className="font-medium">{t('farmer.profile.loading')}</p>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl shadow-sm p-8 text-destructive flex items-center gap-4">
              <div className="p-3 bg-destructive/20 rounded-full">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{t('common.error')}</h3>
                <p>{error}</p>
              </div>
            </div>
          ) : !profile ? (
            <div className="bg-card border border-border rounded-xl shadow-sm p-12 text-center">
               <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
               <p className="text-muted-foreground font-medium">{t('farmer.profile.notAvailable')}</p>
            </div>
          ) : (
            <section className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
              {/* Banner Area */}
              <div className="h-32 bg-success/20 w-full"></div>

              <div className="px-6 pb-8 -mt-12">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                  <div className="flex items-end gap-6">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden bg-card border-4 border-card shadow-xl flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                        {previewUrl || profile?.avatar ? (
                          <img
                            src={imageUrl(previewUrl || profile?.avatar)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-success/10 flex items-center justify-center">
                            <User className="w-16 h-16 text-success" />
                          </div>
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 bg-success text-white rounded-xl p-2.5 cursor-pointer hover:bg-success/90 transition-all shadow-lg hover:scale-110 active:scale-95 border-2 border-card">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                      </label>
                    </div>
                    <div className="pb-1">
                      <h1 className="text-3xl font-bold text-foreground mb-1">{displayName}</h1>
                      <div className="flex items-center gap-3">
                         <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-bold rounded uppercase tracking-wider">{t('farmer.profile.registeredFarmer')}</span>
                         {profile.farmSize && (
                           <span className="text-xs text-muted-foreground font-medium">{t('farmer.profile.farmSize')}: {profile.farmSize}</span>
                         )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-3 py-1.5 rounded-lg border border-border/50">
                    {t('farmer.profile.lastUpdated')}: {formatDate(profile.updatedAt || profile.createdAt)}
                  </div>
                </div>

                {/* Image Upload Preview */}
                {imageFile && (
                  <div className="bg-success/5 border border-success/20 rounded-2xl p-5 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-md">
                          <img
                            src={imageUrl(previewUrl)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{t('farmer.profile.newProfileImage')}</p>
                          <p className="text-xs text-muted-foreground font-medium">{imageFile.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setImageFile(null);
                            setPreviewUrl(null);
                          }}
                          className="px-5 py-2 text-sm font-bold border border-border rounded-xl hover:bg-muted transition-colors"
                        >
                          {t('farmer.profile.cancel')}
                        </button>
                        <button
                          onClick={handleImageUpload}
                          className="px-5 py-2 text-sm font-bold bg-success text-white rounded-xl hover:bg-success/90 transition-all shadow-md active:scale-95"
                        >
                          {t('farmer.profile.upload')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <Section title={t('farmer.profile.sections.personal')}>
                    <Field
                      label={t('farmer.profile.fields.firstName')}
                      value={firstName}
                      icon={<User className="w-4 h-4 text-muted-foreground" />}
                      placeholder={t('farmer.profile.fields.notProvided')}
                    />
                    <Field
                      label={t('farmer.profile.fields.lastName')}
                      value={lastName || '—'}
                      icon={<User className="w-4 h-4 text-muted-foreground" />}
                      placeholder={t('farmer.profile.fields.notProvided')}
                    />
                  </Section>

                  <Section title={t('farmer.profile.sections.contact')}>
                    <Field
                      label={t('farmer.profile.fields.phone')}
                      value={profile.phoneNumber || '—'}
                      icon={<Phone className="w-4 h-4 text-muted-foreground" />}
                      placeholder={t('farmer.profile.fields.notProvided')}
                    />
                    <Field
                      label={t('farmer.profile.fields.email')}
                      value={profile.email || '—'}
                      icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                      placeholder={t('farmer.profile.fields.notProvided')}
                    />
                  </Section>

                  <Section title={t('farmer.profile.sections.address')}>
                    <Field
                      label={t('farmer.profile.fields.district')}
                      value={profile.district || '—'}
                      icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
                      placeholder={t('farmer.profile.fields.notProvided')}
                    />
                    <Field
                      label={t('farmer.profile.fields.province')}
                      value={profile.province || '—'}
                      icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
                      placeholder={t('farmer.profile.fields.notProvided')}
                    />
                  </Section>

                  <Section title={t('farmer.profile.sections.farming')}>
                    <Field label={t('farmer.profile.fields.farmSize')} value={profile.farmSize || '—'} placeholder={t('farmer.profile.fields.notProvided')} />
                    <Field
                      label={t('farmer.profile.fields.crops')}
                      value={profile.crops && profile.crops.length ? profile.crops.join(', ') : '—'}
                      placeholder={t('farmer.profile.fields.notProvided')}
                    />
                    <Field label={t('farmer.profile.fields.experience')} value={profile.experienceLevel || '—'} placeholder={t('farmer.profile.fields.notProvided')} />
                  </Section>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default function FarmerProfilePage() {
  return (
    <FarmerGuard>
      <FarmerProfileComponent />
    </FarmerGuard>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground border-l-4 border-success pl-4">{title}</h2>
      <div className="grid grid-cols-1 gap-5">{children}</div>
    </div>
  );
}

function Field({ label, value, icon, placeholder }: { label: string; value: string; icon?: React.ReactNode; placeholder?: string }) {
  const isProvided = value && value !== '—';

  const content = isProvided ? (
    <span className="font-semibold">{value}</span>
  ) : (
    <span className="text-muted-foreground italic">{placeholder || 'Not provided'}</span>
  );

  return (
    <div className="space-y-1.5 group">
      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
      <div className="flex items-center gap-3 text-foreground bg-muted/30 border border-border/50 rounded-xl px-4 py-3 min-h-12 transition-all group-hover:border-success/30 group-hover:bg-card">
        {icon}
        {content}
      </div>
    </div>
  );
}
