'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Camera, Save, X, Loader2, Settings } from 'lucide-react';
import { User as UserType } from '@/types';
import { useProfile } from '@/contexts/ProfileContext';
import { imageUrl } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface AdminProfileProps {
  profile: UserType | null;
}

function AdminProfileComponent({ profile }: AdminProfileProps) {
  const { updateProfile, uploadAvatar } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UserType>>({});

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

  const handleChange = (field: keyof UserType, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (!profile) {
    return (
      <div className="bg-background border-border rounded-lg shadow-sm p-6 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl bg-card rounded-lg shadow-sm border p-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
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
                <Shield className="w-10 h-10 text-success" />
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
                <input
                  type="text"
                  value={editData.names || ''}
                  onChange={(e) => handleChange('names', e.target.value)}
                  className="text-xl font-semibold bg-transparent border-b border-border focus:border-green-500 outline-none"
                />
              ) : (
                profile.names
              )}
            </h2>
            <p className="text-muted-foreground">System Administrator</p>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Settings className="w-4 h-4 text-muted-foreground" />
              Full System Access
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
                className="bg-muted text-muted-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-muted"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
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
                <p className="text-sm font-medium text-foreground">System Administrator</p>
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
            <label className="text-sm font-medium text-muted-foreground flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <p className="text-foreground mt-1">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phoneNumber || ''}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <p className="text-foreground mt-1">{profile.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.address?.province || ''}
                onChange={(e) => handleChange('address', { ...profile.address, province: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <p className="text-foreground mt-1">{profile.address?.province || '—'}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Role
            </label>
            <p className="text-foreground mt-1">System Administrator</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Member Since
            </label>
            <p className="text-foreground mt-1">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Account Status</label>
            <div className="mt-1">
              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-success/10 text-success">
                {profile.verified ? 'Verified Admin' : 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin-specific section */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Administrative Privileges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <User className="w-5 h-5 text-success" />
            <div>
              <p className="font-medium text-foreground">User Management</p>
              <p className="text-sm text-muted-foreground">Manage all user accounts</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Settings className="w-5 h-5 text-success" />
            <div>
              <p className="font-medium text-foreground">System Settings</p>
              <p className="text-sm text-muted-foreground">Configure system parameters</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Shield className="w-5 h-5 text-success" />
            <div>
              <p className="font-medium text-foreground">Security Control</p>
              <p className="text-sm text-muted-foreground">Oversee security measures</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">System Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-info">Total Users</p>
                <p className="text-2xl font-bold text-info">2,847</p>
              </div>
              <User className="w-8 h-8 text-info" />
            </div>
            <p className="text-xs text-info mt-2">+12% from last month</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success">Active Farmers</p>
                <p className="text-2xl font-bold text-success">1,234</p>
              </div>
              <Settings className="w-8 h-8 text-success" />
            </div>
            <p className="text-xs text-success mt-2">+8% from last month</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warning">Total Orders</p>
                <p className="text-2xl font-bold text-warning">8,456</p>
              </div>
              <Shield className="w-8 h-8 text-warning" />
            </div>
            <p className="text-xs text-warning mt-2">+23% from last month</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Revenue</p>
                <p className="text-2xl font-bold text-orange-600">RWF 45M</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-xs text-orange-600 mt-2">+18% from last month</p>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Server Status</span>
                <span className="text-sm text-success">Online</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Database Performance</span>
                <span className="text-sm text-success">Optimal</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">API Response Time</span>
                <span className="text-sm text-success">120ms</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-foreground">Last Backup</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
              <span className="text-success text-sm">Success</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-foreground">Security Scan</p>
                <p className="text-sm text-muted-foreground">Daily at 2:00 AM</p>
              </div>
              <span className="text-success text-sm">Pass</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-foreground">System Updates</p>
                <p className="text-sm text-muted-foreground">Version 2.4.1</p>
              </div>
              <span className="text-info text-sm">Up to date</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent System Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">New user registration spike detected</p>
              <p className="text-xs text-muted-foreground">45 new farmers registered in the last 24 hours</p>
            </div>
            <span className="text-xs text-muted-foreground">2 hours ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-2 h-2 bg-info rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Database optimization completed</p>
              <p className="text-xs text-muted-foreground">Query performance improved by 23%</p>
            </div>
            <span className="text-xs text-muted-foreground">5 hours ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Payment gateway maintenance scheduled</p>
              <p className="text-xs text-muted-foreground">Scheduled for Sunday 2:00 AM - 4:00 AM</p>
            </div>
            <span className="text-xs text-muted-foreground">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfileComponent;
