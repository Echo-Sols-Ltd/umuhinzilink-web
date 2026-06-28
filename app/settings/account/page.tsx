'use client';

import React, { useState } from 'react';
import SettingsSubLayout from '@/components/layout/SettingsSubLayout';
import {
  User,
  Save,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Shield,
  Bell
} from '@/lib/icons';

export default function AccountSettingsPage() {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const [account, setAccount] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
    email_notifications: true,
    profile_visibility: 'public'
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (key: keyof typeof account, value: string | boolean) => {
    setAccount(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleImageUpload = () => {
    // Handle image upload
  };

  return (
    <SettingsSubLayout
      title="Account Settings"
      description="Manage your profile and account preferences"
    >
      <div className="space-y-6">
            {/* Profile Information */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
              </div>

              {/* Profile Picture */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <button
                      onClick={handleImageUpload}
                      className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      Change Photo
                    </button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max size 2MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={account.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={account.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={account.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={account.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="+250 788 123 456"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bio
                  </label>
                  <textarea
                    value={account.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={account.current_password}
                      onChange={(e) => handleChange('current_password', e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => handlePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={account.new_password}
                      onChange={(e) => handleChange('new_password', e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => handlePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={account.confirm_password}
                      onChange={(e) => handleChange('confirm_password', e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => handlePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  <strong>Password requirements:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains uppercase and lowercase letters</li>
                    <li>• Contains at least one number</li>
                    <li>• Contains at least one special character</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Privacy Preferences */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Privacy Preferences</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Profile Visibility
                  </label>
                  <select
                    value={account.profile_visibility}
                    onChange={(e) => handleChange('profile_visibility', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    <option value="public">Public - Everyone can see your profile</option>
                    <option value="registered">Registered - Only registered users</option>
                    <option value="private">Private - Only you</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive account-related emails</div>
                  </div>
                  <button
                    onClick={() => handleChange('email_notifications', !account.email_notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      account.email_notifications ? 'bg-success' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
                        account.email_notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50 flex items-center gap-2"
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <span>✓</span>
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <span>✗</span>
                  Error
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
      </div>
    </SettingsSubLayout>
  );
}
