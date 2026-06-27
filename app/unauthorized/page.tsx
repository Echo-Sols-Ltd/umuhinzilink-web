'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

export default function Unauthorized() {
  const router = useRouter();
  const { t } = useI18n();
  const { user, logout } = useAuth();

  const handleGoToDashboard = () => {
    if (user) {
      router.push('/');
    } else {
      router.push('/auth/signin');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('pages.unauthorized.title')}</h1>
          <p className="text-gray-600">{t('pages.unauthorized.description')}</p>
        </div>

        {user && (
          <div className="mb-6 p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">{t('pages.unauthorized.signedInAs')}</span> {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{t('pages.unauthorized.role')}</span> {user.role}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleGoToDashboard}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Home className="h-4 w-4 mr-2" />
            {t('pages.unauthorized.goToDashboard')}
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('pages.unauthorized.signOut')}
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          {t('pages.unauthorized.contactAdmin')}
        </p>
      </div>
    </div>
  );
}
