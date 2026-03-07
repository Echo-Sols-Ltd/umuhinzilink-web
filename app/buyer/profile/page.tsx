'use client';
import React, { useEffect, useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Mail,
  Edit2,
  Save,
  X,
  MessageSquare,
  Settings,
  LogOut,
  CheckCircle,
  FilePlus,
  GridIcon,
  UserIcon,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import Sidebar from '@/components/shared/Sidebar';
import { BuyerPages, UserType } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import { imageUrl } from '@/lib/utils';
import { userService } from '@/services/users';

const inputClass =
  'w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-success focus:border-transparent transition';

const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-success">Umuhinzi</span>
    <span className="text-foreground">Link</span>
  </span>
);

import { useI18n } from '@/contexts/I18nContext';

function BuyerProfileComponent() {
  const { t } = useI18n();
  const router = useRouter();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    district: '',
    sector: '',
    avatar: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('buyerProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile({
        firstName: parsed.firstName || '',
        lastName: parsed.lastName || '',
        phone: parsed.phone || '',
        email: parsed.email || '',
        district: parsed.district || '',
        sector: parsed.sector || '',
        avatar: parsed.avatar || '',
      });
    } else {
      setProfile({
        firstName: 'John',
        lastName: 'Doe',
        phone: '0788000000',
        email: 'john.doe@example.com',
        district: 'Kigali',
        sector: 'Technology',
        avatar: '',
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('buyerProfile', JSON.stringify(profile));
    setIsEditing(false);
    toast.success(t('profile.updated.success'));
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
      const res = await userService.uploadAvatar(imageFile);
      setProfile(prev => ({ ...prev, avatar: res.data! }));
      toast.success(t('profile.upload.success'));
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(t('profile.upload.error'));
    }
  };

  const handleLogout = async () => {

  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.BUYER}
        activeItem='Profile'
      />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto h-full">
        <div className="max-w-full bg-card rounded-lg shadow-sm border p-6">
          {/* Profile Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-success/10 flex items-center justify-center border border-border">
                  {previewUrl || profile.avatar ? (
                    <img
                      src={previewUrl || imageUrl(profile.avatar)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-success" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-success text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-success/90 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </label>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  {profile.firstName || t('common.user')} {profile.lastName}
                </h1>
                <p className="text-muted-foreground">{t('sidebar.roles.buyer')}</p>
              </div>
            </div>

            {/* Image Upload Section */}
            {imageFile && (
              <div className="bg-card border border-border rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border">
                      <img
                        src={previewUrl || ''}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t('profile.actions.newImage')}</p>
                      <p className="text-xs text-muted-foreground">{imageFile.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setPreviewUrl(null);
                      }}
                      className="px-3 py-1 text-sm border border-border rounded-md hover:bg-card"
                    >
                      {t('profile.actions.cancel')}
                    </button>
                    <button
                      onClick={handleImageUpload}
                      className="px-3 py-1 text-sm bg-success text-primary-foreground rounded-md hover:bg-success/90"
                    >
                      {t('profile.actions.upload')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" /> {t('profile.actions.save')}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-muted text-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-muted/80 transition-colors"
                >
                  <X className="w-4 h-4" /> {t('profile.actions.cancel')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" /> {t('profile.actions.edit')}
              </button>
            )}
          </div>

          {/* Profile Sections */}
          <div className="space-y-6">
            <Section title={t('profile.sections.personal')}>
              <Field
                label={t('profile.fields.firstName')}
                value={profile.firstName}
                isEditing={isEditing}
                name="firstName"
                onChange={handleChange}
                placeholder={t('profile.fields.firstName')}
              />
              <Field
                label={t('profile.fields.lastName')}
                value={profile.lastName}
                isEditing={isEditing}
                name="lastName"
                onChange={handleChange}
                placeholder={t('profile.fields.lastName')}
              />
            </Section>

            <Section title={t('profile.sections.contact')}>
              <Field
                label={t('profile.fields.phone')}
                value={profile.phone}
                icon={<Phone className="w-4 h-4 text-muted-foreground" />}
                isEditing={isEditing}
                name="phone"
                onChange={handleChange}
                placeholder={t('profile.fields.phone')}
              />
              <Field
                label={t('profile.fields.email')}
                value={profile.email}
                icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                isEditing={isEditing}
                name="email"
                onChange={handleChange}
                placeholder={t('profile.fields.email')}
              />
            </Section>

            <Section title={t('profile.sections.address')}>
              <Field
                label={t('profile.fields.district')}
                value={profile.district}
                icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
                isEditing={isEditing}
                name="district"
                onChange={handleChange}
                placeholder={t('profile.fields.district')}
              />
              <Field
                label={t('profile.fields.sector')}
                value={profile.sector}
                isEditing={isEditing}
                name="sector"
                onChange={handleChange}
                placeholder={t('profile.fields.sector')}
              />
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-3">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  icon,
  isEditing,
  name,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isEditing: boolean;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  const { t } = useI18n();
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClass}
        />
      ) : (
        <div className="flex items-center gap-2 text-foreground bg-card border border-border rounded-md px-3 py-2 min-h-[42px]">
          {icon}
          <span className="truncate">
            {value || <span className="text-muted-foreground italic">{t('profile.notProvided')}</span>}
          </span>
        </div>
      )}
    </div>
  );
}

export default function BuyerProfile() {
  return (
    <BuyerGuard>
      <BuyerProfileComponent />
    </BuyerGuard>
  );
}
