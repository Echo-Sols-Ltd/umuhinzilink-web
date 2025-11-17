'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Settings,
  ChevronLeft,
  Save,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  CreditCard,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  currency: string;
  timezone: string;
  language: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  paymentMethods: {
    mobileMoney: boolean;
    bankTransfer: boolean;
    cashOnDelivery: boolean;
    creditCard: boolean;
  };
  commissionRate: number;
  maxFileSize: number;
  autoApproveProducts: boolean;
  requireEmailVerification: boolean;
  sessionTimeout: number;
}

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Temporarily bypass authentication for admin dashboard access
        // const user = await getCurrentUser();
        // if (user?.role !== 'ADMIN') {
        //   window.location.href = '/unauthorized';
        //   return;
        // }
        // setCurrentUser(user);
      } catch (error) {
        // window.location.href = '/signin';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

function SystemSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'UmuhinziLink',
    siteDescription: 'Connecting farmers and buyers in Rwanda',
    contactEmail: 'support@umuhinzilink.rw',
    supportPhone: '+250 788 123 456',
    currency: 'RWF',
    timezone: 'Africa/Kigali',
    language: 'en',
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
    smsNotifications: false,
    paymentMethods: {
      mobileMoney: true,
      bankTransfer: true,
      cashOnDelivery: true,
      creditCard: false,
    },
    commissionRate: 5,
    maxFileSize: 10,
    autoApproveProducts: false,
    requireEmailVerification: true,
    sessionTimeout: 24,
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleToggle = (key: keyof SystemSettings, value?: any) => {
    if (key === 'paymentMethods') {
      setSettings(prev => ({
        ...prev,
        paymentMethods: {
          ...prev.paymentMethods,
          ...value,
        },
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: typeof value !== 'undefined' ? value : !prev[key],
      }));
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('success');

      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin_dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">System Settings</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Save Status Alert */}
        {saveStatus === 'success' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Settings saved successfully!</span>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">Error saving settings. Please try again.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* General Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Site Configuration */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Site Configuration
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={e => handleToggle('siteName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={e => handleToggle('siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={e => handleToggle('currency', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="RWF">RWF - Rwandan Franc</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={e => handleToggle('timezone', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Africa/Kigali">Africa/Kigali</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      value={settings.language}
                      onChange={e => handleToggle('language', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="rw">Kinyarwanda</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={e => handleToggle('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Support Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.supportPhone}
                    onChange={e => handleToggle('supportPhone', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* System Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                System Controls
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Maintenance Mode</p>
                    <p className="text-sm text-gray-500">Temporarily disable the platform</p>
                  </div>
                  <button
                    onClick={() => handleToggle('maintenanceMode')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {settings.maintenanceMode ? (
                      <ToggleRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Allow Registrations</p>
                    <p className="text-sm text-gray-500">Enable new user signups</p>
                  </div>
                  <button
                    onClick={() => handleToggle('allowRegistrations')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {settings.allowRegistrations ? (
                      <ToggleRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto-approve Products</p>
                    <p className="text-sm text-gray-500">
                      Automatically approve new product listings
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('autoApproveProducts')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {settings.autoApproveProducts ? (
                      <ToggleRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Verification</p>
                    <p className="text-sm text-gray-500">
                      Require email verification for new accounts
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('requireEmailVerification')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {settings.requireEmailVerification ? (
                      <ToggleRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Methods
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Mobile Money</p>
                    <p className="text-sm text-gray-500">MTN, Airtel Money</p>
                  </div>
                  <button
                    onClick={() =>
                      handleToggle('paymentMethods', {
                        mobileMoney: !settings.paymentMethods.mobileMoney,
                      })
                    }
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {settings.paymentMethods.mobileMoney ? (
                      <ToggleRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Bank Transfer</p>
                    <p className="text-sm text-gray-500">Direct bank transfers</p>
                  </div>
                  <button
                    onClick={() =>
                      handleToggle('paymentMethods', {
                        bankTransfer: !settings.paymentMethods.bankTransfer,
                      })
                    }
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {settings.paymentMethods.bankTransfer ? (
                      <ToggleRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when receiving</p>
                  </div>
                  <button
                    onClick={() =>
                      handleToggle('paymentMethods', {
                        cashOnDelivery: !settings.paymentMethods.cashOnDelivery,
                      })
                    }
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {settings.paymentMethods.cashOnDelivery ? (
                      <ToggleRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Credit Card</p>
                    <p className="text-sm text-gray-500">Visa, Mastercard</p>
                  </div>
                  <button
                    onClick={() =>
                      handleToggle('paymentMethods', {
                        creditCard: !settings.paymentMethods.creditCard,
                      })
                    }
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {settings.paymentMethods.creditCard ? (
                      <ToggleRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Platform Status</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="text-sm text-gray-900">2.3GB / 10GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm text-gray-900">2 hours ago</span>
                </div>
              </div>
            </div>

            {/* Commission Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.commissionRate}
                    onChange={e => handleToggle('commissionRate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      This percentage will be deducted from each transaction as platform commission.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">File Upload</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max File Size (MB)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.maxFileSize}
                    onChange={e => handleToggle('maxFileSize', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Session Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Timeout (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={settings.sessionTimeout}
                    onChange={e => handleToggle('sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AdminGuard>
      <SystemSettingsPage />
    </AdminGuard>
  );
}
