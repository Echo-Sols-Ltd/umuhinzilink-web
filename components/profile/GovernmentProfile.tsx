'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Camera, Save, X, Loader2 } from 'lucide-react';
import { User as UserType } from '@/types';
import { useProfile } from '@/contexts/ProfileContext';
import { imageUrl } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface ExtendedGovernmentUser extends UserType {
  department?: string;
  employeeId?: string;
  position?: string;
  securityClearance?: string;
  officeLocation?: string;
  supervisor?: string;
  jurisdiction?: string;
}

interface GovernmentProfileProps {
  profile: ExtendedGovernmentUser | null;
}

function GovernmentProfileComponent({ profile }: GovernmentProfileProps) {
  const { updateProfile, uploadAvatar } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ExtendedGovernmentUser>>({});

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
      await updateProfile(editData);
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

  const handleChange = (field: keyof ExtendedGovernmentUser, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (!profile) {
    return (
      <div className="bg-background border-border rounded-lg shadow-sm p-6 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  const firstName = profile.firstName || '';
  const lastName = profile.lastName || '';
  const displayName = `${firstName} ${lastName}`.trim() || 'Official';

  return (
    <div className="max-w-4xl bg-card rounded-lg shadow-sm border p-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
              {previewUrl || profile.avatar ? (
                <img
                  src={imageUrl(previewUrl || profile.avatar)}
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
              <Camera className="w-3 h-3" />
            </label>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editData.firstName || ''}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="First Name"
                    className="text-xl font-semibold bg-transparent border-b border-border focus:border-success outline-none w-1/2"
                  />
                  <input
                    type="text"
                    value={editData.lastName || ''}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Last Name"
                    className="text-xl font-semibold bg-transparent border-b border-border focus:border-success outline-none w-1/2"
                  />
                </div>
              ) : (
                displayName
              )}
            </h2>
            <p className="text-muted-foreground">Government Official</p>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 mr-1" />
              Government Official
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : '—'}
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="bg-muted text-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-muted"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-success text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-success/600 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
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
                className="px-3 py-1 text-sm bg-success text-white rounded-md hover:bg-success/90 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-success"
              />
            ) : (
              <p className="text-foreground mt-1">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phoneNumber || ''}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-success"
              />
            ) : (
              <p className="text-foreground mt-1">{profile.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.province || ''}
                onChange={(e) => handleChange('province', e.target.value as any)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-success"
              />
            ) : (
              <p className="text-foreground mt-1">{profile.province || '—'}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground flex items-center">
              <User className="w-4 h-4 mr-2" />
              Department
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.department || ''}
                onChange={(e) => handleChange('department', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-success"
              />
            ) : (
              <p className="text-foreground mt-1">{profile.department || 'Ministry of Agriculture'}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Join Date
            </label>
            <p className="text-foreground mt-1">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Account Status</label>
            <div className="mt-1">
              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-success/10 text-success">
                {profile.isVerified ? 'Verified' : 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Government-specific sections */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Government Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Employee ID
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.employeeId || ''}
                  onChange={(e) => handleChange('employeeId', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-success"
                />
              ) : (
                <p className="text-foreground mt-1">{profile.employeeId || '—'}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Position Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.position || ''}
                  onChange={(e) => handleChange('position', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-success"
                />
              ) : (
                <p className="text-foreground mt-1">{profile.position || 'Agricultural Inspector'}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Security Clearance</label>
              {isEditing ? (
                <select
                  value={editData.securityClearance || ''}
                  onChange={(e) => handleChange('securityClearance', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-success"
                >
                  <option value="">Select clearance level</option>
                  <option value="Level 1">Level 1</option>
                  <option value="Level 2">Level 2</option>
                  <option value="Level 3">Level 3</option>
                </select>
              ) : (
                <p className="text-foreground mt-1">{profile.securityClearance || '—'}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Office Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.officeLocation || ''}
                  onChange={(e) => handleChange('officeLocation', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-success"
                />
              ) : (
                <p className="text-foreground mt-1">{profile.officeLocation || '—'}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Supervisor</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.supervisor || ''}
                  onChange={(e) => handleChange('supervisor', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-success"
                />
              ) : (
                <p className="text-foreground mt-1">{profile.supervisor || '—'}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Jurisdiction</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.jurisdiction || ''}
                  onChange={(e) => handleChange('jurisdiction', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-success"
                />
              ) : (
                <p className="text-foreground mt-1">{profile.jurisdiction || 'National'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Regulatory Authority */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Regulatory Authority</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Shield className="w-5 h-5 text-success" />
            <div>
              <p className="font-medium text-foreground">Inspection Authority</p>
              <p className="text-sm text-muted-foreground">Farm inspections</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <User className="w-5 h-5 text-success" />
            <div>
              <p className="font-medium text-foreground">Certification Power</p>
              <p className="text-sm text-muted-foreground">Issue certifications</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Calendar className="w-5 h-5 text-success" />
            <div>
              <p className="font-medium text-foreground">Reporting Access</p>
              <p className="text-sm text-muted-foreground">Generate reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GovernmentProfileComponent;
