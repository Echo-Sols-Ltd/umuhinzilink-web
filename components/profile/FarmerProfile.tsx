'use client';

import React, { useState } from 'react';
import { User, Phone, MapPin, Mail, Loader2, Edit2, Save, X } from 'lucide-react';
import { Farmer } from '@/types/user';
import { useProfile } from '@/contexts/ProfileContext';
import { imageUrl } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { RwandaCrop, FarmSizeCategory, ExperienceLevel } from '@/types/enums';
import ProfileActivityComponent from './ProfileActivity';
import ProfileBadgesComponent from './ProfileBadges';

interface FarmerProfileProps {
  profile: Farmer | null;
}

function FarmerProfileComponent({ profile }: FarmerProfileProps) {
  const { updateFarmerProfile, uploadAvatar } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'activity' | 'badges'>('info');
  const [editData, setEditData] = useState<Partial<Farmer>>({});

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
      await updateFarmerProfile(editData);
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

  const handleChange = (field: keyof Farmer, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (!profile) {
    return (
      <div className="bg-background border-border rounded-lg shadow-sm p-6 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  const displayName = profile.names || profile.user?.names || 'Farmer';
  const [firstName, ...restNames] = displayName.split(' ');
  const lastName = restNames.join(' ');

  return (
    <div className="max-w-4xl bg-card rounded-lg shadow-sm border p-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
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
            <p className="text-muted-foreground">Registered Farmer</p>
            {profile.farmSize && (
              <p className="text-xs text-muted-foreground">Farm size: {profile.farmSize}</p>
            )}
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
                className="bg-success text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-success/600 disabled:opacity-50"
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
              className="bg-success text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-success/600"
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

      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-success text-success'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'activity'
                ? 'border-success text-success'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Activity & Analytics
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'badges'
                ? 'border-success text-success'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Badges & Verification
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
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

        <Section title="Farming Details">
          <Field 
            label="Farm Size" 
            value={profile.farmSize || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('farmSize', value as FarmSizeCategory)}
          />
          <Field
            label="Crops"
            value={profile.crops && profile.crops.length ? profile.crops.join(', ') : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('crops', value.split(',').map(c => c.trim()) as RwandaCrop[])}
          />
          <Field 
            label="Experience Level" 
            value={profile.experienceLevel || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('experienceLevel', value as ExperienceLevel)}
          />
        </Section>

        <Section title="Farm Information">
          <Field
            label="Farm Name"
            value={profile.farmName || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('farmName', value)}
          />
          <Field
            label="Farm Registration"
            value={profile.farmRegistrationNumber || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('farmRegistrationNumber', value)}
          />
          <Field
            label="Soil Type"
            value={profile.soilType || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('soilType', value)}
          />
          <Field
            label="Water Source"
            value={profile.waterSource || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('waterSource', value)}
          />
        </Section>

        <Section title="Production & Harvest">
          <Field
            label="Annual Production"
            value={profile.annualProduction ? `${profile.annualProduction} tons` : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('annualProduction', parseFloat(value) || 0)}
          />
          <Field
            label="Harvest Seasons"
            value={profile.harvestSeasons && profile.harvestSeasons.length ? profile.harvestSeasons.join(', ') : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('harvestSeasons', value.split(',').map(s => s.trim()))}
          />
          <Field
            label="Storage Capacity"
            value={profile.storageCapacity ? `${profile.storageCapacity} tons` : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('storageCapacity', parseFloat(value) || 0)}
          />
          <Field
            label="Organic Certified"
            value={profile.isOrganicCertified ? 'Yes' : 'No'}
            isEditing={isEditing}
            onChange={(value) => handleChange('isOrganicCertified', value === 'Yes')}
          />
        </Section>

        <Section title="Market & Sales">
          <Field
            label="Primary Markets"
            value={profile.primaryMarkets && profile.primaryMarkets.length ? profile.primaryMarkets.join(', ') : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('primaryMarkets', value.split(',').map(m => m.trim()))}
          />
          <Field
            label="Payment Methods"
            value={profile.paymentMethods && profile.paymentMethods.length ? profile.paymentMethods.join(', ') : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('paymentMethods', value.split(',').map(m => m.trim()))}
          />
          <Field
            label="Delivery Radius"
            value={profile.deliveryRadius ? `${profile.deliveryRadius} km` : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('deliveryRadius', parseFloat(value) || 0)}
          />
          <Field
            label="Years in Business"
            value={profile.yearsInBusiness ? `${profile.yearsInBusiness} years` : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('yearsInBusiness', parseInt(value) || 0)}
          />
        </Section>

        <Section title="Certifications & Training">
          <Field
            label="Certifications"
            value={profile.certifications && profile.certifications.length ? profile.certifications.join(', ') : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('certifications', value.split(',').map(c => c.trim()))}
          />
          <Field
            label="Training Completed"
            value={profile.trainingCompleted && profile.trainingCompleted.length ? profile.trainingCompleted.join(', ') : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('trainingCompleted', value.split(',').map(t => t.trim()))}
          />
          <Field
            label="Last Inspection"
            value={profile.lastInspectionDate ? new Date(profile.lastInspectionDate).toLocaleDateString() : '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('lastInspectionDate', value)}
          />
          <Field
            label="Inspection Status"
            value={profile.inspectionStatus || '—'}
            isEditing={isEditing}
            onChange={(value) => handleChange('inspectionStatus', value)}
          />
        </Section>
        </div>
      )}

      {activeTab === 'activity' && (
        <ProfileActivityComponent />
      )}

      {activeTab === 'badges' && (
        <ProfileBadgesComponent />
      )}
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
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      {isEditing ? (
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

export default FarmerProfileComponent;
