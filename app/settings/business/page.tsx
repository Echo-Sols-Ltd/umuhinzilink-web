'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserRole as UserType } from '@/types';
import {
  Building,
  ArrowLeft,
  Save,
  MapPin,
  Ruler,
  Sprout,
  Phone,
  Mail,
  Globe,
  Camera
} from 'lucide-react';

export default function BusinessSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const [business, setBusiness] = useState({
    business_name: '',
    district: '',
    sector: '',
    gps_location: '',
    farm_size: '',
    crop_types: [] as string[],
    business_description: '',
    contact_phone: '',
    contact_email: '',
    website: '',
    established_year: ''
  });

  const handleChange = (key: keyof typeof business, value: string | string[]) => {
    setBusiness(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCropToggle = (crop: string) => {
    setBusiness(prev => ({
      ...prev,
      crop_types: prev.crop_types.includes(crop)
        ? prev.crop_types.filter(c => c !== crop)
        : [...prev.crop_types, crop]
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

  const rwandaDistricts = [
    "Kigali", "Northern", "Southern", "Eastern", "Western"
  ];

  const rwandaSectors = {
    "Kigali": ["Gasabo", "Kicukiro", "Nyarugenge"],
    "Northern": ["Burera", "Gicumbi", "Gakenke", "Musanze", "Rulindo"],
    "Southern": ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyagatare", "Ruhango"],
    "Eastern": ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Rwamagana"],
    "Western": ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rutsiro"]
  };

  const cropOptions = [
    "Tomatoes", "Cabbage", "Carrots", "Onions", "Potatoes", 
    "Maize", "Beans", "Coffee", "Tea", "Fruits",
    "Vegetables", "Bananas", "Sorghum", "Wheat", "Rice"
  ];

  const currentSectors = business.district ? rwandaSectors[business.district as keyof typeof rwandaSectors] || [] : [];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={user?.role as UserType} activeItem="Settings" />
      
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
              <h1 className="text-2xl font-bold text-foreground">Business / Farm Information</h1>
              <p className="text-muted-foreground mt-1">Manage your farm or business details visible to buyers</p>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Building className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Business/Farm Name *
                  </label>
                  <input
                    type="text"
                    value={business.business_name}
                    onChange={(e) => handleChange('business_name', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="Enter your farm or business name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Established Year
                  </label>
                  <input
                    type="number"
                    value={business.established_year}
                    onChange={(e) => handleChange('established_year', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="e.g., 2020"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Business Description
                  </label>
                  <textarea
                    value={business.business_description}
                    onChange={(e) => handleChange('business_description', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="Describe your farm or business..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Location Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    District *
                  </label>
                  <select
                    value={business.district}
                    onChange={(e) => {
                      handleChange('district', e.target.value);
                      handleChange('sector', ''); // Reset sector when district changes
                    }}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    required
                  >
                    <option value="">Select District</option>
                    {rwandaDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Sector *
                  </label>
                  <select
                    value={business.sector}
                    onChange={(e) => handleChange('sector', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    required
                    disabled={!business.district}
                  >
                    <option value="">Select Sector</option>
                    {currentSectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    GPS Coordinates
                  </label>
                  <input
                    type="text"
                    value={business.gps_location}
                    onChange={(e) => handleChange('gps_location', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="e.g., -1.9444, 30.0614"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional: Helps buyers locate your farm precisely
                  </p>
                </div>
              </div>
            </div>

            {/* Farm Details */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                  <Ruler className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Farm Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Farm Size (hectares)
                  </label>
                  <input
                    type="number"
                    value={business.farm_size}
                    onChange={(e) => handleChange('farm_size', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="0.0"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Crop Types
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {cropOptions.map(crop => (
                      <label key={crop} className="flex items-center p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                        <input
                          type="checkbox"
                          checked={business.crop_types.includes(crop)}
                          onChange={() => handleCropToggle(crop)}
                          className="mr-2"
                        />
                        <span className="text-sm">{crop}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                  <Phone className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={business.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="+250 788 123 456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={business.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="business@example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={business.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="https://yourwebsite.com"
                  />
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
                  <Save className="w-4 h-4" />
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
