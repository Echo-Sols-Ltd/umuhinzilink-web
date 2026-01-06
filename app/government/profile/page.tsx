'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Camera, Save, X } from 'lucide-react';
import { GovernmentLayout } from '../components/GovernmentLayout';
import { GovernmentPages } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export default function GovernmentProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Mock user data - replace with actual user data from auth context
  const [profileData, setProfileData] = useState({
    names: 'John Government Official',
    email: 'john@government.rw',
    phoneNumber: '+250 788 123 456',
    department: 'Ministry of Agriculture',
    position: 'Agricultural Inspector',
    location: 'Kigali, Rwanda',
    joinDate: '2022-03-15',
    avatar: '',
  });

  const [editData, setEditData] = useState({ ...profileData });

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement profile update API call
      // await userService.updateProfile(editData);
      
      setProfileData({ ...editData });
      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement image upload
      console.log('Image upload:', file);
    }
  };

  return (
    <GovernmentLayout activePage={GovernmentPages.PROFILE}>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-1">Manage your government official profile</p>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-green-600" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditing ? (
                    <Input
                      value={editData.names}
                      onChange={(e) => setEditData({ ...editData, names: e.target.value })}
                      className="text-xl font-semibold"
                    />
                  ) : (
                    profileData.names
                  )}
                </h2>
                <p className="text-gray-600">
                  {isEditing ? (
                    <Input
                      value={editData.position}
                      onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                      className="text-gray-600"
                    />
                  ) : (
                    profileData.position
                  )}
                </p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4 mr-1" />
                  Government Official
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-gray-900 mt-1">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.phoneNumber}
                      onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-gray-900 mt-1">{profileData.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.location}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-gray-900 mt-1">{profileData.location}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Department
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.department}
                      onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-gray-900 mt-1">{profileData.department}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Join Date
                  </Label>
                  <p className="text-gray-900 mt-1">{profileData.joinDate}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Account Status</Label>
                  <div className="mt-1">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GovernmentLayout>
  );
}
