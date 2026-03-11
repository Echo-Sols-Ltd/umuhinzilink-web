'use client';

import React, { useState } from 'react';
import { User, Phone, MapPin, Mail, Loader2, Edit2, Save, X } from 'lucide-react';
import { Buyer } from '@/types/user';
import { useProfile } from '@/contexts/ProfileContext';
import { imageUrl } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { BuyerType } from '@/types';

interface BuyerProfileProps {
  profile: Buyer | null;
}

function BuyerProfileComponent({ profile }: BuyerProfileProps) {
  const { updateBuyerProfile, uploadAvatar } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Buyer>>({});

  React.useEffect(() => {
    if (profile) {
      setEditData(profile);
    }
  }, [profile]);

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
      setLoading(true);
      const avatarUrl = await uploadAvatar(imageFile);
      toast.success("Profile image uploaded successfully", {
        title: "Image Updated"
      });
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error("Failed to upload image. Please try again.", {
        title: "Upload Failed"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      await updateBuyerProfile(editData);
      setIsEditing(false);
      toast.success("Profile updated successfully", {
        title: "Success"
      });
    } catch (error) {
      toast.error("Failed to update profile. Please try again.", {
        title: "Update Failed"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile || {});
    setIsEditing(false);
  };

  const handleChange = (field: keyof Buyer, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (!profile) {
    return (
      <div className="bg-background border-border rounded-lg shadow-sm p-6 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  const displayName = profile.user?.names || 'Buyer';
  const [firstName, ...restNames] = displayName.split(' ');
  const lastName = restNames.join(' ');

  return (
    <div className="max-w-4xl bg-card rounded-lg shadow-sm border p-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-success/10 flex items-center justify-center">
              {previewUrl || profile.user?.avatar ? (
                <img
                  src={imageUrl(previewUrl || profile.user?.avatar)}
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
            <h1 className="text-2xl font-semibold text-foreground">{displayName}</h1>
            <p className="text-muted-foreground">Buyer</p>
            <p className="text-sm text-muted-foreground">{profile.buyerType}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {profile.user?.updatedAt ? new Date(profile.user.updatedAt).toLocaleDateString() : '—'}
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-success text-primary-foreground rounded-md hover:bg-success/600 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="bg-muted text-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-muted"
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
      </div>

      {/* Image Upload Section */}
      {imageFile && (
        <div className="bg-card border-border rounded-lg p-4 mb-6">
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
                disabled={loading}
                className="px-3 py-1 text-sm bg-success text-primary-foreground rounded-md hover:bg-success/600 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <Section title="Personal Information">
          <Field
            label="First Name"
            value={firstName}
            isEditing={isEditing}
            onChange={(value) => handleChange('user', { ...profile.user, names: `${value} ${lastName}`.trim() })}
          />
          <Field
            label="Last Name"
            value={lastName}
            isEditing={isEditing}
            onChange={(value) => handleChange('user', { ...profile.user, names: `${firstName} ${value}`.trim() })}
          />
        </Section>

        <Section title="Contact Information">
          <Field
            label="Phone Number"
            value={profile.user?.phoneNumber || '—'}
            icon={<Phone className="w-4 h-4 text-muted-foreground" />}
            isEditing={isEditing}
            onChange={(value) => handleChange('user', { ...profile.user, phoneNumber: value })}
          />
          <Field
            label="Email"
            value={profile.user?.email || '—'}
            icon={<Mail className="w-4 h-4 text-muted-foreground" />}
            isEditing={isEditing}
            onChange={(value) => handleChange('user', { ...profile.user, email: value })}
          />
        </Section>

        <Section title="Address">
          <Field
            label="District"
            value={profile.user?.address?.district || '—'}
            icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
            isEditing={isEditing}
            onChange={(value) => handleChange('user', { 
              ...profile.user, 
              address: { ...profile.user?.address, district: value }
            })}
          />
          <Field
            label="Province"
            value={profile.user?.address?.province || '—'}
            icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
            isEditing={isEditing}
            onChange={(value) => handleChange('user', { 
              ...profile.user, 
              address: { ...profile.user?.address, province: value }
            })}
          />
        </Section>

        <Section title="Buyer Information">
          <Field
            label="Buyer Type"
            value={profile.buyerType || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('buyerType', value as BuyerType)}
          />
          <Field
            label="Business Name"
            value={profile.businessName || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('businessName', value)}
          />
          <Field
            label="Business Registration"
            value={profile.businessRegistrationNumber || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('businessRegistrationNumber', value)}
          />
          <Field
            label="Years in Business"
            value={profile.yearsInBusiness ? `${profile.yearsInBusiness} years` : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('yearsInBusiness', parseInt(value) || 0)}
          />
        </Section>

        <Section title="Purchase Preferences">
          <Field
            label="Preferred Categories"
            value={profile.preferredCategories && profile.preferredCategories.length ? profile.preferredCategories.join(', ') : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('preferredCategories', value.split(',').map(c => c.trim()))}
          />
          <Field
            label="Budget Range"
            value={profile.budgetRange || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('budgetRange', value)}
          />
          <Field
            label="Order Frequency"
            value={profile.orderFrequency || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('orderFrequency', value)}
          />
          <Field
            label="Quality Requirements"
            value={profile.qualityRequirements || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('qualityRequirements', value)}
          />
        </Section>

        <Section title="Order History & Statistics">
          <Field
            label="Total Orders"
            value={profile.totalOrders ? `${profile.totalOrders} orders` : '—'}
            isEditing={false}
          />
          <Field
            label="Total Spent"
            value={profile.totalSpent ? `RWF ${profile.totalSpent.toLocaleString()}` : '—'}
            isEditing={false}
          />
          <Field
            label="Average Order Value"
            value={profile.averageOrderValue ? `RWF ${profile.averageOrderValue.toLocaleString()}` : '—'}
            isEditing={false}
          />
          <Field
            label="Last Order Date"
            value={profile.lastOrderDate ? new Date(profile.lastOrderDate).toLocaleDateString() : '—'}
            isEditing={false}
          />
        </Section>

        <Section title="Delivery & Logistics">
          <Field
            label="Delivery Address"
            value={profile.deliveryAddress || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('deliveryAddress', value)}
          />
          <Field
            label="Delivery Schedule"
            value={profile.deliverySchedule || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('deliverySchedule', value)}
          />
          <Field
            label="Preferred Suppliers"
            value={profile.preferredSuppliers && profile.preferredSuppliers.length ? profile.preferredSuppliers.join(', ') : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('preferredSuppliers', value.split(',').map(s => s.trim()))}
          />
          <Field
            label="Special Requirements"
            value={profile.specialRequirements || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('specialRequirements', value)}
          />
        </Section>

        <Section title="Payment & Billing">
          <Field
            label="Payment Methods"
            value={profile.paymentMethods && profile.paymentMethods.length ? profile.paymentMethods.join(', ') : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('paymentMethods', value.split(',').map(m => m.trim()))}
          />
          <Field
            label="Credit Limit"
            value={profile.creditLimit ? `RWF ${profile.creditLimit.toLocaleString()}` : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('creditLimit', parseFloat(value) || 0)}
          />
          <Field
            label="Billing Cycle"
            value={profile.billingCycle || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('billingCycle', value)}
          />
          <Field
            label="Tax Exemption"
            value={profile.taxExempt ? 'Yes' : 'No'}
            isEditing={isEditing}
            onChange={(value) => handleChange('taxExempt', value === 'Yes')}
          />
        </Section>
      </div>
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
  onChange 
}: { 
  label: string; 
  value: string; 
  icon?: React.ReactNode; 
  isEditing: boolean; 
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      {isEditing && onChange ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-success focus:border-transparent transition"
        />
      ) : (
        <div className="flex items-center gap-2 text-foreground bg-card border border-border rounded-md px-3 py-2 min-h-10">
          {icon}
          <span>{value || <span className="text-muted-foreground">Not provided</span>}</span>
        </div>
      )}
    </div>
  );
}

export default BuyerProfileComponent;
