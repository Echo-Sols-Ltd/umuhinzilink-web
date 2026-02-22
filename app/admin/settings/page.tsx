'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminGuard from '@/contexts/guard/AdminGuard';
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
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';

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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Settings'
      />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">System Settings</h1>
            <p className="text-xs text-gray-500">Configure platform-wide settings and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 p-6 space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </main>
      </div>
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
