'use client';

import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Save,
  RefreshCw
} from 'lucide-react';
import { GovernmentLayout } from '../components/GovernmentLayout';
import { GovernmentPages } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { notify } from '@/lib/notify';
import GovernmentGuard from '@/contexts/guard/GovernmentGuard';

function GovernmentSettings() {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Settings state
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    weeklyReports: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: '30',

    // Display Settings
    darkMode: false,
    language: 'en',
    timezone: 'Africa/Kigali',

    // Password Change
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveSettings = async (section: string) => {
    setLoading(true);
    try {
      // TODO: Implement settings update API call
      // await settingsService.updateSettings(settings);

      notify.success(`${section} settings have been successfully updated.`, 'Settings Updated');
    } catch (error) {
      notify.error('Failed to update settings. Please try again.', 'Update Failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (settings.newPassword !== settings.confirmPassword) {
      notify.error('New password and confirm password do not match.', 'Password Mismatch');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement password change API call
      // await authService.changePassword(settings.currentPassword, settings.newPassword);

      setSettings({
        ...settings,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      notify.success('Your password has been successfully changed.', 'Password Changed');
    } catch (error) {
      notify.error('Failed to change password. Please check your current password.', 'Password Change Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GovernmentLayout activePage={GovernmentPages.SETTINGS}>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your government portal preferences and security</p>
        </div>

        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="bg-card rounded-lg shadow-sm border border-border">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Bell className="w-5 h-5 text-success mr-3" />
                <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-success' : 'bg-muted'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.pushNotifications ? 'bg-success' : 'bg-muted'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Critical alerts via SMS</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, smsAlerts: !settings.smsAlerts })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.smsAlerts ? 'bg-success' : 'bg-muted'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${settings.smsAlerts ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Summary of agricultural activities</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, weeklyReports: !settings.weeklyReports })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.weeklyReports ? 'bg-success' : 'bg-muted'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${settings.weeklyReports ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={() => handleSaveSettings('Notification')}
                  disabled={loading}
                  className="bg-success hover:bg-success/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-card rounded-lg shadow-sm border border-border">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-5 h-5 text-success mr-3" />
                <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.twoFactorAuth ? 'bg-success' : 'bg-muted'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                <div>
                  <Label className="text-primary">Session Timeout (minutes)</Label>
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-success focus:border-success"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={() => handleSaveSettings('Security')}
                  disabled={loading}
                  className="bg-success hover:bg-success/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-card rounded-lg shadow-sm border border-border">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Lock className="w-5 h-5 text-success mr-3" />
                <h2 className="text-lg font-semibold text-primary">Change Password</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-primary">Current Password</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={settings.currentPassword}
                      onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="text-primary">New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      value={settings.newPassword}
                      onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="text-primary">Confirm New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={settings.confirmPassword}
                      onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="bg-success hover:bg-success/90 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GovernmentLayout>
  );
}

export default function GovernmentSettingsPage() {
  return (
    <GovernmentGuard>
      <GovernmentSettings />
    </GovernmentGuard>
  );
}
