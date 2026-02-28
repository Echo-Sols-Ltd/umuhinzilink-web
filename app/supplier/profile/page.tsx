'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  MapPin,
  Mail,
  Edit2,
  Save,
  X,
  Package,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import Sidebar from '@/components/shared/Sidebar';
import { SupplierPages, UserType } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import { imageUrl } from '@/lib/utils';
import { userService } from '@/services/users';
import { toast } from '@/components/ui/use-toast';

const inputClass =
  'w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-success focus:border-transparent transition';

const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-success">Umuhinzi</span>
    <span className="text-foreground">Link</span>
  </span>
);

function SupplierProfileComponent() {
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
  const [logoutPending, setLogoutPending] = useState(false);
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
    } else {
      setProfile({
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '0789000000',
        email: 'jane.smith@example.com',
        district: 'Kigali',
        sector: 'Agriculture',
        businessName: 'AgriSupply Ltd',
        businessType: 'Equipment Supplier',
        avatar: '',
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
    alert('Supplier profile updated successfully!');
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
    // Handle logout logic
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        userType={UserType.SUPPLIER}
        activeItem='Profile'
      />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto h-full">
        <div className="max-w-4xl bg-card rounded-lg shadow-sm border p-6">
          {/* Profile Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-success/10 flex items-center justify-center">
                  {previewUrl || profile.avatar ? (
                    <img
                      src={imageUrl(previewUrl || profile.avatar)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="w-10 h-10 text-success" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-success text-white rounded-full p-1 cursor-pointer hover:bg-success/90 transition-colors">
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
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-muted-foreground">Supplier</p>
                <p className="text-sm text-muted-foreground">{profile.businessName}</p>
              </div>
            </div>

            {/* Image Upload Section */}
            {imageFile && (
              <div className="bg-card border border-border rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl(previewUrl)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">New Profile Image</p>
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
                      Cancel
                    </button>
                    <button
                      onClick={handleImageUpload}
                      className="px-3 py-1 text-sm bg-success text-white rounded-md hover:bg-success/90"
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
                  className="bg-success text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-success/90"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-muted text-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-muted/80"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-success text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-success/90"
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
                label="Phone Number"
                value={profile.phoneNumber}
                icon={<Phone className="w-4 h-4 text-muted-foreground" />}
                isEditing={isEditing}
                name="phoneNumber"
                onChange={handleChange}
              />
              <Field
                label="Email"
                value={profile.email}
                icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                isEditing={isEditing}
                name="email"
                onChange={handleChange}
              />
            </Section>

            <Section title="Address">
              <Field
                label="District"
                value={profile.district}
                icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
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

            <Section title="Business Information">
              <Field
                label="Business Name"
                value={profile.businessName}
                icon={<Package className="w-4 h-4 text-muted-foreground" />}
                isEditing={isEditing}
                name="businessName"
                onChange={handleChange}
              />
              <Field
                label="Business Type"
                value={profile.businessType}
                isEditing={isEditing}
                name="businessType"
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
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      {isEditing ? (
        <input type="text" name={name} value={value} onChange={onChange} className={inputClass} />
      ) : (
        <div className="flex items-center gap-2 text-foreground bg-card border border-border rounded-md px-3 py-2">
          {icon}
          {value || <span className="text-muted-foreground">Not provided</span>}
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
