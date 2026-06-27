'use client';

import React, { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import SettingsSubLayout from '@/components/layout/SettingsSubLayout';
import {
  Building,
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
  const { t } = useI18n();
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

  const handleCropToggle = (crop: typeof cropOptions[number]) => {
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
    'tomatoes', 'cabbage', 'carrots', 'onions', 'potatoes',
    'maize', 'beans', 'coffee', 'tea', 'fruits',
    'vegetables', 'bananas', 'sorghum', 'wheat', 'rice',
  ] as const;

  const currentSectors = business.district ? rwandaSectors[business.district as keyof typeof rwandaSectors] || [] : [];

  return (
    <SettingsSubLayout
      title={t('settings.hub.sections.business.title')}
      description={t('settings.hub.sections.business.description')}
    >
      <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Building className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.business.sections.basicInformation')}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.business.fields.businessName')}
                  </label>
                  <input
                    type="text"
                    value={business.business_name}
                    onChange={(e) => handleChange('business_name', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder={t('settings.business.placeholders.businessName')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.business.fields.establishedYear')}
                  </label>
                  <input
                    type="number"
                    value={business.established_year}
                    onChange={(e) => handleChange('established_year', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder={t('settings.business.placeholders.establishedYear')}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.business.fields.businessDescription')}
                  </label>
                  <textarea
                    value={business.business_description}
                    onChange={(e) => handleChange('business_description', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder={t('settings.business.placeholders.businessDescription')}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.business.sections.locationDetails')}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.business.fields.district')}
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
                    <option value="">{t('settings.business.placeholders.selectDistrict')}</option>
                    {rwandaDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.business.fields.sector')}
                  </label>
                  <select
                    value={business.sector}
                    onChange={(e) => handleChange('sector', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    required
                    disabled={!business.district}
                  >
                    <option value="">{t('settings.business.placeholders.selectSector')}</option>
                    {currentSectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.business.fields.gpsCoordinates')}
                  </label>
                  <input
                    type="text"
                    value={business.gps_location}
                    onChange={(e) => handleChange('gps_location', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder={t('settings.business.placeholders.gpsCoordinates')}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('settings.business.gpsHint')}
                  </p>
                </div>
              </div>
            </div>

            {/* Farm Details */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                  <Ruler className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.business.sections.farmDetails')}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.business.fields.farmSize')}
                  </label>
                  <input
                    type="number"
                    value={business.farm_size}
                    onChange={(e) => handleChange('farm_size', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder={t('settings.business.placeholders.farmSize')}
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.business.fields.cropTypes')}
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
                        <span className="text-sm">{t(`settings.business.crops.${crop}`)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                  <Phone className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.business.sections.contactInformation')}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.business.fields.phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    value={business.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder={t('settings.business.placeholders.phone')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.business.fields.emailAddress')}
                  </label>
                  <input
                    type="email"
                    value={business.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder={t('settings.business.placeholders.email')}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.business.fields.website')}
                  </label>
                  <input
                    type="url"
                    value={business.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder={t('settings.business.placeholders.website')}
                  />
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
                  {t('common.saving')}
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <span>✓</span>
                  {t('common.saved')}
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <span>✗</span>
                  {t('common.error')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('common.saveChanges')}
                </>
              )}
            </button>
          </div>
      </div>
    </SettingsSubLayout>
  );
}
