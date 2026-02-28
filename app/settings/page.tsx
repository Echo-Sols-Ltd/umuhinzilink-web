'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import {
  Settings,
  Building,
  CreditCard,
  Bell,
  Globe,
  Shield,
  ChevronRight,
  Eye,
  Download,
  Trash2,
  Smartphone,
  Mail,
  AlertTriangle,
  User,
  Wallet
} from 'lucide-react';

// Settings Configuration
const settingsConfig = {
  "sections": [
    {
      "id": "business",
      "title": "Business / Farm Information",
      "description": "Manage your farm or business details visible to buyers.",
      "roles": ["farmer", "supplier"],
      "icon": Building,
      "href": "/settings/business",
      "color": "bg-blue-500",
      "fields": ["Business Name", "District", "Sector", "GPS Location", "Farm Size", "Crop Types"]
    },
    {
      "id": "payments",
      "title": "Payments & Payouts",
      "description": "Configure how you receive payments.",
      "roles": ["farmer", "supplier"],
      "icon": CreditCard,
      "href": "/settings/payments",
      "color": "bg-green-500",
      "fields": ["Mobile Money Provider", "Mobile Money Number", "Bank Account"]
    },
    {
      "id": "notifications",
      "title": "Notifications",
      "description": "Choose how you receive alerts.",
      "roles": ["farmer", "supplier", "buyer", "admin"],
      "icon": Bell,
      "href": "/settings/notifications",
      "color": "bg-purple-500",
      "fields": ["SMS Notifications", "Email Notifications", "Order Alerts", "Price Alerts"]
    },
    {
      "id": "localization",
      "title": "Language & Region",
      "description": "Adjust platform language and currency.",
      "roles": ["farmer", "supplier", "buyer", "admin"],
      "icon": Globe,
      "href": "/settings/localization",
      "color": "bg-orange-500",
      "fields": ["Language", "Currency", "Time Zone", "Date Format"]
    },
    {
      "id": "security",
      "title": "Security",
      "description": "Manage your account security.",
      "roles": ["farmer", "supplier", "buyer", "admin"],
      "icon": Shield,
      "href": "/settings/security",
      "color": "bg-red-500",
      "fields": ["Two-Factor Authentication", "Active Sessions", "Data Download", "Account Deletion"]
    },
    {
      "id": "account",
      "title": "Account Settings",
      "description": "Manage your profile and account preferences.",
      "roles": ["farmer", "supplier", "buyer", "admin"],
      "icon": User,
      "href": "/settings/account",
      "color": "bg-indigo-500",
      "fields": ["Profile Information", "Password Change", "Email Preferences", "Privacy Settings"]
    }
  ]
};

export default function GlobalSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Filter sections based on user role
  const userRole = user?.role || 'BUYER';
  const availableSections = settingsConfig.sections.filter(
    section => section.roles.includes(userRole.toLowerCase())
  );

  const handleSectionClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={user?.role as UserType} activeItem="Settings" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  onClick={() => handleSectionClick(section.href)}
                  className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all cursor-pointer hover:border-success/50 group"
                >
                  {/* Icon and Title */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-success transition-colors" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-success transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.description}
                    </p>
                    
                    {/* Fields Preview */}
                    <div className="pt-3 border-t border-border">
                      <div className="flex flex-wrap gap-1">
                        {section.fields.slice(0, 3).map((field, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                          >
                            {field}
                          </span>
                        ))}
                        {section.fields.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                            +{section.fields.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
              >
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">View Profile</div>
                  <div className="text-sm text-muted-foreground">Manage your public profile</div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/chat')}
                className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
              >
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Messages</div>
                  <div className="text-sm text-muted-foreground">Check your messages</div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/notifications')}
                className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Notifications</div>
                  <div className="text-sm text-muted-foreground">View recent alerts</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
