'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types';
import BuyerDashboard from '@/components/dashboard/buyer/BuyerDashboard';
import FarmerDashboard from '@/components/dashboard/farmer/FarmerDashboard';
import SupplierDashboard from '@/components/dashboard/supplier/SupplierDashboard';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import GovernmentDashboard from '@/components/dashboard/government/GovernmentDashboard';
import Sidebar from '@/components/shared/Sidebar';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case UserType.BUYER:
        return <BuyerDashboard />;
      case UserType.FARMER:
        return <FarmerDashboard />;
      case UserType.SUPPLIER:
        return <SupplierDashboard />;
      case UserType.ADMIN:
        return <AdminDashboard />;
      case UserType.GOVERNMENT:
        return <GovernmentDashboard />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Dashboard not available for your role</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="hidden md:block shrink-0">
          <Sidebar
            userType={user.role as UserType}
            activeItem="Dashboard"
          />
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Welcome back, {user.names}
                  </h1>
                  <p className="text-muted-foreground">
                    Here&apos;s what&apos;s happening with your {user.role.toLowerCase()} account today
                  </p>
                </div>
              </div>
            </div>

            <div className="min-h-screen">
              {renderDashboard()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
