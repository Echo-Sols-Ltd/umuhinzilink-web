'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminGuard from '@/contexts/guard/AdminGuard';
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
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';

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
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'failed':
        return <Ban className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-success/10 text-success';
      case 'failed':
        return 'bg-destructive/10 text-destructive';
      case 'warning':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Security'
      />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Security Center</h1>
            <p className="text-xs text-muted-foreground">Monitor and manage platform security</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-colors">
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-background p-6 space-y-6">
          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                  <p className="text-2xl font-semibold text-foreground">{securityMetrics.totalLogs}</p>
                </div>
                <div className="w-10 h-10 bg-info rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Failed Attempts</p>
                  <p className="text-2xl font-semibold text-foreground">{securityMetrics.failedAttempts}</p>
                </div>
                <div className="w-10 h-10 bg-destructive rounded-lg flex items-center justify-center">
                  <Ban className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-semibold text-foreground">{securityMetrics.warnings}</p>
                </div>
                <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Settings</p>
                  <p className="text-2xl font-semibold text-foreground">{securityMetrics.activeSettings}</p>
                </div>
                <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Security Settings</h2>
            <div className="space-y-4">
              {securitySettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-card rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{setting.name}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting(setting.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${setting.enabled ? 'bg-success' : 'bg-muted'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security Logs */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Security Logs</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Timestamp</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">User</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">IP Address</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {securityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-card">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{log.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{log.action}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{log.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{log.ip}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                          {getStatusIcon(log.status)}
                          <span className="ml-1">{log.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
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
