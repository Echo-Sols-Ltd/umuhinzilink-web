"use client";

import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserType, District } from '@/types';
import { useI18n } from '@/contexts/I18nContext';
import { notify } from '@/lib/notify';
import { cn } from '@/lib/utils';

interface GoogleRoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (role: UserType, district: District) => void;
  loading: boolean;
}

export default function GoogleRoleSelectionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading 
}: GoogleRoleSelectionModalProps) {
  const { t } = useI18n();
  const [selectedRole, setSelectedRole] = React.useState<UserType>(UserType.FARMER);
  const [selectedDistrict, setSelectedDistrict] = React.useState<District>(District.KICUKIRO);
  const [locating, setLocating] = React.useState(false);

  const accountTypes = [
    { value: UserType.FARMER, labelKey: 'auth.accountTypes.farmer' },
    { value: UserType.SUPPLIER, labelKey: 'auth.accountTypes.supplier' },
    { value: UserType.BUYER, labelKey: 'auth.accountTypes.buyer' },
  ];

  const detectLocation = () => {
    if (!navigator.geolocation) {
      notify.error(t('auth.location.notSupported'), t('common.error'));
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = await response.json();
          const address = data.address || {};
          const districtName = (address.county || address.city_district || address.suburb || address.city || '').split(' ')[0].toUpperCase();

          const foundDistrict = Object.values(District).find(d => 
            d.toUpperCase() === districtName || districtName.includes(d.toUpperCase())
          );

          if (foundDistrict) {
            setSelectedDistrict(foundDistrict as District);
            notify.success(t('auth.location.detected', { district: foundDistrict }), t('common.success'));
          } else {
            notify.error(t('auth.location.notFound'), t('common.error'));
          }
        } catch (error) {
          notify.error(t('auth.location.error'), t('common.error'));
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        notify.error(t('auth.location.denied'), t('common.error'));
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = () => {
    if (!selectedRole) {
      notify.error(t('auth.validation.roleRequired'), t('common.error'));
      return;
    }
    if (!selectedDistrict) {
      notify.error(t('auth.validation.districtRequired'), t('common.error'));
      return;
    }
    onSubmit(selectedRole, selectedDistrict);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setSelectedRole(UserType.FARMER);
      setSelectedDistrict(District.KICUKIRO);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 relative shadow-2xl border border-border animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-linear-to-br from-green-400 to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <span className="text-white text-xl font-bold">UL</span>
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">
            {t('auth.googleRoleModal.title')}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t('auth.googleRoleModal.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Role Selection */}
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">
              {t('auth.fields.accountType')}
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {accountTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedRole(type.value as UserType)}
                  className={cn(
                    "py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all duration-200",
                    selectedRole === type.value 
                      ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                      : "bg-background border-input text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {t(type.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* District Selection */}
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
              {t('auth.fields.district')}
            </Label>
            <div className="flex gap-2">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value as District)}
                className="flex-1 text-foreground font-medium text-sm border border-input rounded-xl px-4 py-2 bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                {Object.values(District).map(option => (
                  <option key={option} value={option}>
                    {option.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={detectLocation}
                disabled={locating}
                className="p-2.5 border border-input rounded-xl hover:bg-accent transition-colors flex items-center justify-center min-w-[44px] text-muted-foreground hover:text-primary"
                title="Detect Location"
              >
                {locating ? <Loader2 size={20} className="animate-spin text-primary" /> : <MapPin size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-8">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 font-bold shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            {loading ? t('common.processing') : t('auth.googleRoleModal.completeRegistration')}
          </Button>
          
          {!loading && (
            <button
              onClick={handleClose}
              className="w-full text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              {t('common.cancel')}
            </button>
          )}
        </div>

        {/* Terms Note */}
        <p className="text-[10px] text-muted-foreground text-center mt-6 uppercase tracking-widest leading-relaxed">
          {t('auth.googleRoleModal.termsNote')}
        </p>
      </div>
    </div>
  );
}
