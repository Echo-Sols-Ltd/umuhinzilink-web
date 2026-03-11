"use client";

import React from 'react';
import { useSession, signIn } from "next-auth/react";
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserType } from '@/types';
import { useI18n } from '@/contexts/I18nContext';
import { notify } from '@/lib/notify';
import { cn } from '@/lib/utils';

interface GoogleRoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (role: UserType) => void;
  loading: boolean;
}

export default function GoogleRoleSelectionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading 
}: GoogleRoleSelectionModalProps) {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [selectedRole, setSelectedRole] = React.useState<UserType>(UserType.FARMER);

  const accountTypes = [
    { value: UserType.FARMER, labelKey: 'auth.accountTypes.farmer' },
    { value: UserType.SUPPLIER, labelKey: 'auth.accountTypes.supplier' },
    { value: UserType.BUYER, labelKey: 'auth.accountTypes.buyer' },
  ];

  const handleSubmit = () => {
    if (!selectedRole) {
      notify.error(t('auth.validation.roleRequired'), t('common.error'));
      return;
    }
    onSubmit(selectedRole);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setSelectedRole(UserType.FARMER);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        {!loading && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">UL</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('auth.googleRoleModal.title')}
          </h2>
          <p className="text-gray-600 text-sm">
            {t('auth.googleRoleModal.subtitle')}
          </p>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            {session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || ''}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-semibold">G</span>
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{session?.user?.name || 'Google User'}</p>
              <p className="text-sm text-gray-600">{session?.user?.email || 'google@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            {t('auth.fields.accountType')}
          </Label>
          <div className="space-y-2">
            {accountTypes.map((type) => (
              <label
                key={type.value}
                className={cn(
                  "flex items-center p-3 border rounded-lg cursor-pointer transition-colors",
                  selectedRole === type.value 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={type.value}
                  checked={selectedRole === type.value}
                  onChange={(e) => setSelectedRole(e.target.value as UserType)}
                  className="mr-3 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">{t(type.labelKey)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? t('common.loading') : t('auth.googleRoleModal.completeRegistration')}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="w-full"
          >
            {t('common.cancel')}
          </Button>
        </div>

        {/* Terms Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          {t('auth.googleRoleModal.termsNote')}
        </p>
      </div>
    </div>
  );
}
