'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserRole } from '@/types';
import {
  Shield,
  ArrowLeft,
  Eye,
  Download,
  Trash2,
  Smartphone,
  Monitor,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function SecuritySettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const [security, setSecurity] = useState({
    two_factor_auth: false,
    session_timeout: '30',
    login_alerts: true,
    data_sharing: false,
    profile_visibility: 'public'
  });

  const handleChange = (key: keyof typeof security, value: string | boolean) => {
    setSecurity(prev => ({
      ...prev,
      [key]: value
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

  const handleAction = async (action: string) => {
    switch (action) {
      case 'view_sessions':
        // Navigate to sessions page
        break;
      case 'download_data':
        // Handle data download
        break;
      case 'delete_account':
        // Handle account deletion
        break;
    }
  };

  const activeSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Kigali, Rwanda',
      ip: '192.168.1.1',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Kigali, Rwanda',
      ip: '192.168.1.2',
      lastActive: '1 hour ago',
      current: false
    },
    {
      id: 3,
      device: 'Firefox on Android',
      location: 'Remera, Rwanda',
      ip: '192.168.1.3',
      lastActive: '3 days ago',
      current: false
    }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={user?.role as UserRole} activeItem="Settings" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push('/settings')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Settings</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Security</h1>
              <p className="text-muted-foreground mt-1">Manage your account security and privacy</p>
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-6">
            {/* Authentication Security */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Authentication Security</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
                  </div>
                  <button
                    onClick={() => handleChange('two_factor_auth', !security.two_factor_auth)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      security.two_factor_auth ? 'bg-success' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
                        security.two_factor_auth ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Session Timeout (minutes)
                  </label>
                  <select
                    value={security.session_timeout}
                    onChange={(e) => handleChange('session_timeout', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="240">4 hours</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Automatically log out after period of inactivity
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">Login Alerts</div>
                    <div className="text-sm text-muted-foreground">Get notified when someone logs into your account</div>
                  </div>
                  <button
                    onClick={() => handleChange('login_alerts', !security.login_alerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      security.login_alerts ? 'bg-success' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
                        security.login_alerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Monitor className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Active Sessions</h2>
              </div>

              <div className="space-y-3">
                {activeSessions.map(session => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                        {session.device.includes('iPhone') || session.device.includes('Android') ? 
                          <Smartphone className="w-4 h-4 text-muted-foreground" /> :
                          <Monitor className="w-4 h-4 text-muted-foreground" />
                        }
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{session.device}</div>
                        <div className="text-sm text-muted-foreground">
                          {session.location} • {session.ip}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.current && (
                        <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                          Current
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.lastActive}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 text-sm text-destructive hover:text-destructive/80 transition-colors">
                Sign out all other sessions
              </button>
            </div>

            {/* Privacy Settings */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Privacy Settings</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Profile Visibility
                  </label>
                  <select
                    value={security.profile_visibility}
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
                    <div className="font-medium text-foreground">Data Sharing</div>
                    <div className="text-sm text-muted-foreground">Share anonymized data for platform improvements</div>
                  </div>
                  <button
                    onClick={() => handleChange('data_sharing', !security.data_sharing)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      security.data_sharing ? 'bg-success' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
                        security.data_sharing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                  <Download className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Data Management</h2>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleAction('download_data')}
                  className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">Download My Data</div>
                      <div className="text-sm text-muted-foreground">Export your personal data</div>
                    </div>
                  </div>
                  <div className="w-5 h-5 text-muted-foreground">
                    →
                  </div>
                </button>

                <button
                  onClick={() => handleAction('delete_account')}
                  className="w-full flex items-center justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-lg hover:bg-destructive/20 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <div>
                      <div className="font-medium text-destructive">Delete Account</div>
                      <div className="text-sm text-muted-foreground">Permanently delete your account</div>
                    </div>
                  </div>
                  <div className="w-5 h-5 text-destructive">
                    →
                  </div>
                </button>
              </div>

              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div className="text-sm text-orange-800 dark:text-orange-200">
                    <strong>Warning:</strong> Account deletion is permanent and cannot be undone. All your data will be permanently removed.
                  </div>
                </div>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Security Status</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm text-foreground">Password is strong</span>
                </div>
                <div className="flex items-center gap-2">
                  {security.two_factor_auth ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  )}
                  <span className="text-sm text-foreground">
                    Two-factor authentication {security.two_factor_auth ? 'enabled' : 'disabled'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm text-foreground">No recent security threats detected</span>
                </div>
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
                  <Shield className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
