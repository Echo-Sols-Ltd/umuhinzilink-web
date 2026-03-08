'use client';

import React, { useState, useEffect } from 'react';
import {
  Phone,
  MapPin,
  Mail,
  Edit2,
  Save,
  X,
  Package,
  Store,
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import { imageUrl } from '@/lib/utils';
import { userService } from '@/services/users';
import { toast } from '@/components/ui/use-toast';
import { useI18n } from '@/contexts/I18nContext';

const inputClass =
  'w-full px-3 py-2 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-success focus:border-transparent transition text-foreground';

function SupplierProfileComponent() {
  const { t } = useI18n();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    district: '',
    sector: '',
    businessName: '',
    businessType: '',
    avatar: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('supplierProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile({
        firstName: parsed.firstName || '',
        lastName: parsed.lastName || '',
        phoneNumber: parsed.phoneNumber || '',
        email: parsed.email || '',
        district: parsed.district || '',
        sector: parsed.sector || '',
        businessName: parsed.businessName || '',
        businessType: parsed.businessType || '',
        avatar: parsed.avatar || '',
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('supplierProfile', JSON.stringify(profile));
    setIsEditing(false);
    toast.success(t('profile.updated.success'));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => { setPreviewUrl(reader.result as string); };
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
    } catch {
      toast.error(t('profile.upload.error'));
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar userType={UserType.SUPPLIER} activeItem="Profile" />

      <main className="flex-1 p-6 sm:p-8 overflow-auto h-full">
        <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-sm border border-border p-6 sm:p-8">

          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-success/10 flex items-center justify-center border-2 border-border shadow">
                  {previewUrl || profile.avatar ? (
                    <img src={previewUrl || imageUrl(profile.avatar)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-10 h-10 text-success" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-success text-white rounded-full p-1.5 cursor-pointer hover:bg-success/90 transition-colors shadow">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </label>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{profile.firstName} {profile.lastName}</h1>
                <p className="font-medium text-muted-foreground">{t('sidebar.roles.supplier')}</p>
                {profile.businessName && <p className="text-sm text-muted-foreground">{profile.businessName}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              {imageFile && (
                <div className="flex items-center gap-3 bg-muted/40 border border-border rounded-xl p-2 mr-1">
                  <img src={previewUrl || ''} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                  <p className="text-xs truncate max-w-[100px]">{imageFile.name}</p>
                  <button onClick={() => { setImageFile(null); setPreviewUrl(null); }} className="px-2 py-1 text-xs border border-border rounded-lg">
                    {t('profile.actions.cancel')}
                  </button>
                  <button onClick={handleImageUpload} className="px-2 py-1 text-xs bg-success text-white rounded-lg">
                    {t('profile.actions.upload')}
                  </button>
                </div>
              )}
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="bg-success text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold hover:bg-success/90 active:scale-95 transition-all shadow">
                    <Save className="w-4 h-4" /> {t('profile.actions.save')}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="bg-muted text-foreground px-4 py-2 rounded-xl flex items-center gap-2 font-bold hover:bg-muted/80 transition-all">
                    <X className="w-4 h-4" /> {t('profile.actions.cancel')}
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="bg-success text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold hover:bg-success/90 active:scale-95 transition-all shadow">
                  <Edit2 className="w-4 h-4" /> {t('profile.actions.edit')}
                </button>
              )}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            <ProfileSection title={t('profile.sections.personal')}>
              <ProfileField label={t('profile.fields.firstName')} value={profile.firstName} isEditing={isEditing} name="firstName" onChange={handleChange} />
              <ProfileField label={t('profile.fields.lastName')} value={profile.lastName} isEditing={isEditing} name="lastName" onChange={handleChange} />
            </ProfileSection>

            <ProfileSection title={t('profile.sections.contact')}>
              <ProfileField label={t('profile.fields.phone')} value={profile.phoneNumber} icon={<Phone className="w-4 h-4 text-muted-foreground" />} isEditing={isEditing} name="phoneNumber" onChange={handleChange} />
              <ProfileField label={t('profile.fields.email')} value={profile.email} icon={<Mail className="w-4 h-4 text-muted-foreground" />} isEditing={isEditing} name="email" onChange={handleChange} />
            </ProfileSection>

            <ProfileSection title={t('profile.sections.address')}>
              <ProfileField label={t('profile.fields.district')} value={profile.district} icon={<MapPin className="w-4 h-4 text-muted-foreground" />} isEditing={isEditing} name="district" onChange={handleChange} />
              <ProfileField label={t('profile.fields.sector')} value={profile.sector} isEditing={isEditing} name="sector" onChange={handleChange} />
            </ProfileSection>

            <ProfileSection title={t('supplier.profile.businessInfo')}>
              <ProfileField label={t('supplier.profile.businessName')} value={profile.businessName} icon={<Package className="w-4 h-4 text-muted-foreground" />} isEditing={isEditing} name="businessName" onChange={handleChange} />
              <ProfileField label={t('supplier.profile.businessType')} value={profile.businessType} isEditing={isEditing} name="businessType" onChange={handleChange} />
            </ProfileSection>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function ProfileField({
  label, value, icon, isEditing, name, onChange,
}: {
  label: string; value: string; icon?: React.ReactNode;
  isEditing: boolean; name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { t } = useI18n();
  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-0.5">{label}</label>
      {isEditing ? (
        <input type="text" name={name} value={value} onChange={onChange} className={inputClass} />
      ) : (
        <div className="flex items-center gap-2 text-foreground bg-muted/30 border border-border rounded-xl px-4 py-3 min-h-[46px]">
          {icon}
          <span>{value || <span className="text-muted-foreground italic text-sm">{t('profile.notProvided')}</span>}</span>
        </div>
      )}
    </div>
  );
}

export default function SupplierProfile() {
  return (
    <SupplierGuard>
      <SupplierProfileComponent />
    </SupplierGuard>
  );
}
