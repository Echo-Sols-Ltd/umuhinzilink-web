'use client';

import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Mail,
  Loader2,
  Edit2,
  Save,
  X,
  Package,
  Store,
  Building2,
  TrendingUp,
  Award,
  CheckCircle,
  Globe,
  Truck,
  Shield,
  Star,
  Calendar,
  DollarSign,
  Users,
  FileText,
  BarChart3
} from 'lucide-react';
import { Supplier } from '@/types';
import { useProfile } from '@/contexts/ProfileContext';
import { imageUrl } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { SupplierType } from '@/types';
import ProfileActivityComponent from './ProfileActivity';
import ProfileBadgesComponent from './ProfileBadges';

interface ExtendedSupplier extends Supplier {
  yearsInBusiness?: number;
  numberOfEmployees?: number;
  annualRevenue?: number;
  businessLicenseNumber?: string;
  taxId?: string;
  productCategories?: string[];
  serviceAreas?: string[];
  deliveryOptions?: string[];
  paymentTerms?: string;
  warehouseLocation?: string;
  storageCapacity?: number;
  fleetSize?: number;
  deliveryRadius?: number;
  certifications?: string[];
  qualityStandards?: string;
  insuranceCoverage?: string;
  complianceStatus?: string;
}

interface SupplierProfileProps {
  profile: ExtendedSupplier | null;
}

function SupplierProfileComponent({ profile }: SupplierProfileProps) {
  const { updateSupplierProfile, uploadAvatar } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'activity' | 'badges'>('info');
  const [editData, setEditData] = useState<Partial<ExtendedSupplier>>({});

  React.useEffect(() => {
    if (profile) {
      setEditData(profile);
    }
  }, [profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    try {
      setLoading(true);
      const avatarUrl = await uploadAvatar(imageFile);
      toast.success("Profile image uploaded successfully", {
        title: "Image Updated"
      });
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error("Failed to upload image. Please try again.", {
        title: "Upload Failed"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      await updateSupplierProfile(editData);
      setIsEditing(false);
      toast.success("Profile updated successfully", {
        title: "Success"
      });
    } catch (error) {
      toast.error("Failed to update profile. Please try again.", {
        title: "Update Failed"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile || {});
    setIsEditing(false);
  };

  const handleChange = (field: keyof ExtendedSupplier, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (!profile) {
    return (
      <div className="bg-card border border-gray-100 rounded-lg shadow-sm p-6 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  const firstName = profile.user?.firstName || '';
  const lastName = profile.user?.lastName || '';
  const displayName = `${firstName} ${lastName}`.trim() || 'Supplier';

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    const fields = [
      profile.businessName,
      profile.supplierType,
      profile.user?.phoneNumber,
      profile.user?.email,
      profile.user?.province,
      profile.businessRegistrationNumber,
      profile.yearsInBusiness,
      profile.productCategories
    ];
    const completedFields = fields.filter(field => field && field.toString().trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Enhanced Profile Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-card/20 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-lg">
                {previewUrl || profile.user?.avatar ? (
                  <img
                    src={imageUrl(previewUrl || profile.user?.avatar)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-12 h-12 text-white" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-card text-success rounded-full p-2 cursor-pointer hover:bg-muted transition-colors shadow-lg">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Edit2 className="w-4 h-4" />
              </label>
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
              <p className="text-green-100 text-lg mb-1">{profile.businessName}</p>
              <div className="flex items-center gap-4 text-sm text-green-100">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{profile.supplierType || 'Supplier'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{profile.yearsInBusiness ? `${profile.yearsInBusiness} years` : 'New Business'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            {/* Profile Completion */}
            <div className="bg-card/20 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-lg font-bold">{profileCompletion}%</span>
              </div>
              <div className="w-48 bg-card/30 rounded-full h-2">
                <div
                  className="bg-card h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-card text-success px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-muted disabled:opacity-50 shadow-lg"
                >
                  <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-card/20 backdrop-blur-sm text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-card/30 border border-white/30"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-card text-success px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-muted shadow-lg"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Image Upload Section */}
      {imageFile && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md">
                <img
                  src={imageUrl(previewUrl)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">New Profile Image</p>
                <p className="text-sm text-muted-foreground">{imageFile.name}</p>
                <p className="text-xs text-muted-foreground">Size: {(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setImageFile(null);
                  setPreviewUrl(null);
                }}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-card transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImageUpload}
                disabled={loading}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {loading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-card rounded-xl shadow-sm border border-border mb-6">
        <div className="border-b border-border">
          <nav className="flex space-x-1 p-1">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'info'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
            >
              <FileText className="w-4 h-4" />
              Business Information
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'activity'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
            >
              <BarChart3 className="w-4 h-4" />
              Activity & Analytics
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'badges'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
            >
              <Award className="w-4 h-4" />
              Badges & Verification
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'info' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-8 h-8 text-info" />
                    <span className="text-2xl font-bold text-info">{profile.yearsInBusiness || '0'}</span>
                  </div>
                  <p className="text-sm font-medium text-info">Years in Business</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-success" />
                    <span className="text-2xl font-bold text-success">{profile.numberOfEmployees || '0'}</span>
                  </div>
                  <p className="text-sm font-medium text-success">Employees</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-8 h-8 text-warning" />
                    <span className="text-2xl font-bold text-warning">{profile.productCategories?.length || '0'}</span>
                  </div>
                  <p className="text-sm font-medium text-warning">Product Categories</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Truck className="w-8 h-8 text-orange-600" />
                    <span className="text-2xl font-bold text-orange-600">{profile.deliveryRadius || '0'}km</span>
                  </div>
                  <p className="text-sm font-medium text-orange-600">Delivery Radius</p>
                </div>
              </div>

              {/* Business Information Section */}
              <div className="bg-muted rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedField
                    label="Business Name"
                    value={profile.businessName || '—'}
                    icon={<Store className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('businessName', value)}
                  />
                  <EnhancedField
                    label="Business Type"
                    value={profile.supplierType || '—'}
                    icon={<Building2 className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('supplierType', value as SupplierType)}
                  />
                  <EnhancedField
                    label="Business Registration"
                    value={profile.businessRegistrationNumber || '—'}
                    icon={<FileText className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('businessRegistrationNumber', value)}
                  />
                  <EnhancedField
                    label="Tax ID"
                    value={profile.taxId || '—'}
                    icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('taxId', value)}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-muted rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedField
                    label="First Name"
                    value={firstName}
                    icon={<User className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('user', { ...profile.user, firstName: value })}
                  />
                  <EnhancedField
                    label="Last Name"
                    value={lastName}
                    icon={<User className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('user', { ...profile.user, lastName: value })}
                  />
                  <EnhancedField
                    label="Phone Number"
                    value={profile.user?.phoneNumber || '—'}
                    icon={<Phone className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('user', { ...profile.user, phoneNumber: value })}
                  />
                  <EnhancedField
                    label="Email Address"
                    value={profile.user?.email || '—'}
                    icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('user', { ...profile.user, email: value })}
                  />
                  <EnhancedField
                    label="Province"
                    value={profile.user?.province || '—'}
                    icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('user', {
                      ...profile.user,
                      province: value as any
                    })}
                  />
                </div>
              </div>

              {/* Business Operations */}
              <div className="bg-muted rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  Business Operations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedField
                    label="Years in Business"
                    value={profile.yearsInBusiness ? `${profile.yearsInBusiness} years` : '—'}
                    icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('yearsInBusiness', parseInt(value) || 0)}
                  />
                  <EnhancedField
                    label="Number of Employees"
                    value={profile.numberOfEmployees ? `${profile.numberOfEmployees} employees` : '—'}
                    icon={<Users className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('numberOfEmployees', parseInt(value) || 0)}
                  />
                  <EnhancedField
                    label="Annual Revenue"
                    value={profile.annualRevenue ? `RWF ${profile.annualRevenue.toLocaleString()}` : '—'}
                    icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('annualRevenue', parseFloat(value) || 0)}
                  />
                  <EnhancedField
                    label="Business License"
                    value={profile.businessLicenseNumber || '—'}
                    icon={<Shield className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('businessLicenseNumber', value)}
                  />
                </div>
              </div>

              {/* Products & Services */}
              <div className="bg-muted rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  Products & Services
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedField
                    label="Product Categories"
                    value={profile.productCategories && profile.productCategories.length ? profile.productCategories.join(', ') : '—'}
                    icon={<Package className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('productCategories', value.split(',').map(c => c.trim()))}
                  />
                  <EnhancedField
                    label="Service Areas"
                    value={profile.serviceAreas && profile.serviceAreas.length ? profile.serviceAreas.join(', ') : '—'}
                    icon={<Globe className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('serviceAreas', value.split(',').map(a => a.trim()))}
                  />
                  <EnhancedField
                    label="Delivery Options"
                    value={profile.deliveryOptions && profile.deliveryOptions.length ? profile.deliveryOptions.join(', ') : '—'}
                    icon={<Truck className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('deliveryOptions', value.split(',').map(o => o.trim()))}
                  />
                  <EnhancedField
                    label="Payment Terms"
                    value={profile.paymentTerms || '—'}
                    icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('paymentTerms', value)}
                  />
                </div>
              </div>

              {/* Warehouse & Logistics */}
              <div className="bg-muted rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                  Warehouse & Logistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedField
                    label="Warehouse Location"
                    value={profile.warehouseLocation || '—'}
                    icon={<Building2 className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('warehouseLocation', value)}
                  />
                  <EnhancedField
                    label="Storage Capacity"
                    value={profile.storageCapacity ? `${profile.storageCapacity} sq meters` : '—'}
                    icon={<Package className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('storageCapacity', parseFloat(value) || 0)}
                  />
                  <EnhancedField
                    label="Fleet Size"
                    value={profile.fleetSize ? `${profile.fleetSize} vehicles` : '—'}
                    icon={<Truck className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('fleetSize', parseInt(value) || 0)}
                  />
                  <EnhancedField
                    label="Delivery Radius"
                    value={profile.deliveryRadius ? `${profile.deliveryRadius} km` : '—'}
                    icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('deliveryRadius', parseFloat(value) || 0)}
                  />
                </div>
              </div>

              {/* Certifications & Compliance */}
              <div className="bg-muted rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  Certifications & Compliance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedField
                    label="Business Certifications"
                    value={profile.certifications && profile.certifications.length ? profile.certifications.join(', ') : '—'}
                    icon={<Award className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('certifications', value.split(',').map(c => c.trim()))}
                  />
                  <EnhancedField
                    label="Quality Standards"
                    value={profile.qualityStandards || '—'}
                    icon={<Star className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('qualityStandards', value)}
                  />
                  <EnhancedField
                    label="Insurance Coverage"
                    value={profile.insuranceCoverage || '—'}
                    icon={<Shield className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('insuranceCoverage', value)}
                  />
                  <EnhancedField
                    label="Compliance Status"
                    value={profile.complianceStatus || '—'}
                    icon={<CheckCircle className="w-4 h-4 text-muted-foreground" />}
                    isEditing={isEditing}
                    onChange={(value) => handleChange('complianceStatus', value)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <ProfileActivityComponent />
          )}

          {activeTab === 'badges' && (
            <ProfileBadgesComponent />
          )}
        </div>
      </div>
    </div>
  );
}

function EnhancedField({
  label,
  value,
  icon,
  isEditing,
  onChange
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isEditing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
        {icon}
        {label}
      </label>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-gray-400"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <div className="flex items-center gap-3 text-foreground bg-card border border-border rounded-lg px-4 py-3 min-h-12">
          {icon}
          <span className="font-medium">{value || <span className="text-muted-foreground ">Not provided</span>}</span>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-3">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  icon,
  isEditing,
  onChange
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isEditing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        />
      ) : (
        <div className="flex items-center gap-2 text-foreground bg-card border border-border rounded-md px-3 py-2 min-h-10">
          {icon}
          <span>{value || <span className="text-muted-foreground">Not provided</span>}</span>
        </div>
      )}
    </div>
  );
}

export default SupplierProfileComponent;
