'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  ChevronLeft,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Key,
  UserX,
  Activity,
  Clock,
  Ban,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

interface SecurityLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  ip: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
}

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'authentication' | 'access' | 'monitoring' | 'data';
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

function SecurityPage() {
  const router = useRouter();
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setSecurityLogs([
      {
        id: '1',
        timestamp: '2024-03-17 14:32:15',
        action: 'Admin Login',
        user: 'admin@umuhinzilink.rw',
        ip: '192.168.1.100',
        status: 'success',
        details: 'Successful admin dashboard login',
      },
      {
        id: '2',
        timestamp: '2024-03-17 14:28:42',
        action: 'Failed Login Attempt',
        user: 'unknown@malicious.com',
        ip: '192.168.1.101',
        status: 'failed',
        details: 'Invalid credentials - user not found',
      },
      {
        id: '3',
        timestamp: '2024-03-17 14:15:30',
        action: 'Password Reset',
        user: 'john@farm.com',
        ip: '192.168.1.102',
        status: 'success',
        details: 'Password reset request initiated',
      },
      {
        id: '4',
        timestamp: '2024-03-17 13:45:22',
        action: 'Suspicious Activity',
        user: 'mary@buy.com',
        ip: '192.168.1.103',
        status: 'warning',
        details: 'Multiple failed login attempts detected',
      },
    ]);

    setSecuritySettings([
      {
        id: '1',
        name: 'Two-Factor Authentication',
        description: 'Require 2FA for admin accounts',
        enabled: true,
        category: 'authentication',
      },
      {
        id: '2',
        name: 'Session Timeout',
        description: 'Auto-logout after inactivity',
        enabled: true,
        category: 'authentication',
      },
      {
        id: '3',
        name: 'IP Whitelisting',
        description: 'Restrict admin access to specific IPs',
        enabled: false,
        category: 'access',
      },
      {
        id: '4',
        name: 'Failed Login Lockout',
        description: 'Lock accounts after failed attempts',
        enabled: true,
        category: 'authentication',
      },
      {
        id: '5',
        name: 'Activity Logging',
        description: 'Log all admin activities',
        enabled: true,
        category: 'monitoring',
      },
      {
        id: '6',
        name: 'Data Encryption',
        description: 'Encrypt sensitive data at rest',
        enabled: true,
        category: 'data',
      },
    ]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <Ban className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleSetting = (settingId: string) => {
    setSecuritySettings(prev =>
      prev.map(setting =>
        setting.id === settingId ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const securityMetrics = {
    totalLogs: securityLogs.length,
    failedAttempts: securityLogs.filter(log => log.status === 'failed').length,
    warnings: securityLogs.filter(log => log.status === 'warning').length,
    activeSettings: securitySettings.filter(setting => setting.enabled).length,
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
              <h1 className="text-xl font-semibold text-gray-900">Security Center</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{securityMetrics.totalLogs}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <Ban className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Failed Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{securityMetrics.failedAttempts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Warnings</p>
                <p className="text-2xl font-bold text-gray-900">{securityMetrics.warnings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Protections</p>
                <p className="text-2xl font-bold text-gray-900">{securityMetrics.activeSettings}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
              <div className="space-y-4">
                {securitySettings.map(setting => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{setting.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                        {setting.category}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleSetting(setting.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        setting.enabled ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          setting.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Logs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h2>
              <div className="space-y-3">
                {securityLogs.map(log => (
                  <div
                    key={log.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="mt-1">{getStatusIcon(log.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{log.action}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(log.status)}`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>User: {log.user}</span>
                        <span>IP: {log.ip}</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Password Policy */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Minimum Length</span>
                  <span className="text-sm font-medium text-gray-900">8 characters</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Require Uppercase</span>
                  <span className="text-sm font-medium text-green-600">✓ Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Require Numbers</span>
                  <span className="text-sm font-medium text-green-600">✓ Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Require Symbols</span>
                  <span className="text-sm font-medium text-green-600">✓ Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Expiry Period</span>
                  <span className="text-sm font-medium text-gray-900">90 days</span>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Current Session</p>
                    <p className="text-sm text-gray-500">192.168.1.100</p>
                    <p className="text-xs text-gray-400">Started 2 hours ago</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Mobile App</p>
                    <p className="text-sm text-gray-500">192.168.1.105</p>
                    <p className="text-xs text-gray-400">Started 1 day ago</p>
                  </div>
                  <button className="text-red-600 hover:text-red-800 text-sm">Terminate</button>
                </div>
              </div>
            </div>

            {/* Security Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5" />
                  <p className="text-sm text-gray-600">Enable 2FA for all admin accounts</p>
                </div>
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5" />
                  <p className="text-sm text-gray-600">Regularly review security logs</p>
                </div>
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5" />
                  <p className="text-sm text-gray-600">Keep software updated</p>
                </div>
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5" />
                  <p className="text-sm text-gray-600">Use strong, unique passwords</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SecurityCenterPage() {
  return (
    <AdminGuard>
      <SecurityPage />
    </AdminGuard>
  );
}
