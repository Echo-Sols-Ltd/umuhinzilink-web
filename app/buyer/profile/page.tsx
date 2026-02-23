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
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition';

const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

function BuyerProfileComponent() {
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
    alert('Buyer profile updated successfully!');
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
      toast.success("Profile image uploaded successfully", {
        title: "Image Updated"
      });
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error("Failed to upload image. Please try again.", {
        title: "Upload Failed"
      });
    }
  };

  const handleLogout = async () => {

  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.BUYER}
        activeItem='Profile'
      />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto h-full">
        <div className="max-w-full bg-white rounded-lg shadow-sm border p-6">
          {/* Profile Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                  {previewUrl || profile.avatar ? (
                    <img
                      src={previewUrl || imageUrl(profile.avatar)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-green-600" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1 cursor-pointer hover:bg-green-600 transition-colors">
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
                <h1 className="text-2xl font-semibold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-gray-500">Buyer</p>
              </div>
            </div>

            {/* Image Upload Section */}
            {imageFile && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={previewUrl || ''}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">New Profile Image</p>
                      <p className="text-xs text-gray-500">{imageFile.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setPreviewUrl(null);
                      }}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImageUpload}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            )}
          </div>

          {/* Profile Sections */}
          <div className="space-y-6">
            <Section title="Personal Information">
              <Field
                label="First Name"
                value={profile.firstName}
                isEditing={isEditing}
                name="firstName"
                onChange={handleChange}
              />
              <Field
                label="Last Name"
                value={profile.lastName}
                isEditing={isEditing}
                name="lastName"
                onChange={handleChange}
              />
            </Section>

            <Section title="Contact Information">
              <Field
                label="Phone"
                value={profile.phone}
                icon={<Phone className="w-4 h-4 text-gray-500" />}
                isEditing={isEditing}
                name="phone"
                onChange={handleChange}
              />
              <Field
                label="Email"
                value={profile.email}
                icon={<Mail className="w-4 h-4 text-gray-500" />}
                isEditing={isEditing}
                name="email"
                onChange={handleChange}
              />
            </Section>

            <Section title="Address">
              <Field
                label="District"
                value={profile.district}
                icon={<MapPin className="w-4 h-4 text-gray-500" />}
                isEditing={isEditing}
                name="district"
                onChange={handleChange}
              />
              <Field
                label="Sector"
                value={profile.sector}
                isEditing={isEditing}
                name="sector"
                onChange={handleChange}
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
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
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
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isEditing: boolean;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        <input type="text" name={name} value={value} onChange={onChange} className={inputClass} />
      ) : (
        <div className="flex items-center gap-2 text-gray-900 bg-white border border-gray-200 rounded-md px-3 py-2">
          {icon}
          {value || <span className="text-gray-400">Not provided</span>}
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
