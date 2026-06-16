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
import Sidebar from '@/components/shared/Sidebar';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import { UserRole } from '@/types';

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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        userType={UserRole.ADMIN}
        activeItem='Settings'
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminPageHeader
          title="System Settings"
          description="Configure platform-wide settings and preferences"
          actions={
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50 flex items-center gap-2 text-sm"
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
          }
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          {/* General Settings */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-success"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-success"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-2">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-success"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return <SystemSettingsPage />;
}
