'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  MapPin,
  Mail,
  Edit2,
  Save,
  X,
  CheckCircle,
  LayoutGrid,
  FilePlus,
  ShoppingCart,
  Settings,
  LogOut,
  Package,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import Sidebar from '@/components/shared/Sidebar';
import { SupplierPages, UserType } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition';

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

function SupplierProfileComponent() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    district: '',
    sector: '',
    businessName: '',
    businessType: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('supplierProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      setProfile({
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '0789000000',
        email: 'jane.smith@supplyco.com',
        district: 'Kicukiro',
        sector: 'Kagarama',
        businessName: 'Agro Supply Co.',
        businessType: 'Agricultural Inputs',
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('supplierProfile', JSON.stringify(profile));
    setIsEditing(false);
    alert('Supplier profile updated successfully!');
  };

  const handleLogout = async () => {
    // Handle logout logic
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar
          userType={UserType.SUPPLIER}
          activeItem='Profile'
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto h-full">
          <div className="max-w-4xl bg-white rounded-lg shadow-sm border p-8">
            {/* Profile Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <Store className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-gray-500">Supplier</p>
                </div>
              </div>

              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
              )}
            </div>

            {/* Profile Sections */}
            <div className="space-y-6">
              <Section title="Personal Information">
                <Field
                  label="First Name"
                  value={profile.firstName}
                  isEditing={isEditing}
                  name="firstName"
                  onChange={handleChange}
                />
                <Field
                  label="Last Name"
                  value={profile.lastName}
                  isEditing={isEditing}
                  name="lastName"
                  onChange={handleChange}
                />
              </Section>

              <Section title="Contact Information">
                <Field
                  label="Phone Number"
                  value={profile.phoneNumber}
                  icon={<Phone className="w-4 h-4 text-gray-500" />}
                  isEditing={isEditing}
                  name="phoneNumber"
                  onChange={handleChange}
                />
                <Field
                  label="Email"
                  value={profile.email}
                  icon={<Mail className="w-4 h-4 text-gray-500" />}
                  isEditing={isEditing}
                  name="email"
                  onChange={handleChange}
                />
              </Section>

              <Section title="Address">
                <Field
                  label="District"
                  value={profile.district}
                  icon={<MapPin className="w-4 h-4 text-gray-500" />}
                  isEditing={isEditing}
                  name="district"
                  onChange={handleChange}
                />
                <Field
                  label="Sector"
                  value={profile.sector}
                  isEditing={isEditing}
                  name="sector"
                  onChange={handleChange}
                />
              </Section>

              <Section title="Business Information">
                <Field
                  label="Business Name"
                  value={profile.businessName}
                  icon={<Package className="w-4 h-4 text-gray-500" />}
                  isEditing={isEditing}
                  name="businessName"
                  onChange={handleChange}
                />
                <Field
                  label="Business Type"
                  value={profile.businessType}
                  isEditing={isEditing}
                  name="businessType"
                  onChange={handleChange}
                />
              </Section>
            </div>
          </div>
        </main>
      </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  icon,
  isEditing,
  name,
  onChange,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isEditing: boolean;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        <input type="text" name={name} value={value} onChange={onChange} className={inputClass} />
      ) : (
        <div className="flex items-center gap-2 text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
          {icon}
          {value || <span className="text-gray-400">Not provided</span>}
        </div>
      )}
    </div>
  );
}

export default function SupplierProfile() {
  return (
    <SupplierGuard>
      <SupplierProfileComponent />
    </SupplierGuard>
  );
}
