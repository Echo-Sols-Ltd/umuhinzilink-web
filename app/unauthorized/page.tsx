'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Unauthorized() {
  const router = useRouter();
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        </div>

        {user && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Signed in as:</span> {user.names}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Role:</span> {user.role}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleGoToDashboard}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          If you believe this is an error, please contact your administrator.
        </p>
      </div>
    </div>
  );
}
