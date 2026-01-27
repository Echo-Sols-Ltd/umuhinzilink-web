'use client';

import React from 'react';
import { 
  FarmerProfileCard, 
  FarmerProfileHeader, 
  FarmerPerformanceMetrics, 
  FarmerVerificationStatus,
  FarmerProfileOverview,
  type VerificationItem
} from '@/components/farmer';
import { 
  Farmer, 
  User, 
  Address, 
  Province, 
  District, 
  FarmSizeCategory, 
  ExperienceLevel, 
  RwandaCrop,
  UserType,
  Language
} from '@/types';

export default function FarmerProfileDemoPage() {
  // Mock farmer data
  const mockUser: User = {
    id: '1',
    names: 'Jean Baptiste Uwimana',
    email: 'jean.uwimana@example.com',
    phoneNumber: '+250788123456',
    address: {
      province: Province.NORTHERN,
      district: District.MUSANZE
    } as Address,
    avatar: '/placeholder-user.jpg',
    createdAt: '2022-03-15T00:00:00Z',
    lastLogin: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    verified: true,
    password: '',
    role: UserType.FARMER,
    language: Language.ENGLISH
  };

  const mockFarmer: Farmer & {
    rating: number;
    totalSales: number;
    completedOrders: number;
    responseTime: number;
    joinedDate: string;
    certifications: string[];
    verified: boolean;
    profileImage: string;
    phoneNumber: string;
    email: string;
    bio: string;
    totalProducts: number;
    activeProducts: number;
    monthlyRevenue: number;
    customerSatisfaction: number;
    repeatCustomers: number;
    averageOrderValue: number;
    onTimeDelivery: number;
    productViews: number;
    verificationScore: number;
  } = {
    id: '1',
    user: mockUser,
    crops: [
      RwandaCrop.TOMATO,
      RwandaCrop.CABBAGE,
      RwandaCrop.CARROT,
      RwandaCrop.IRISH_POTATO,
      RwandaCrop.MAIZE
    ],
    farmSize: FarmSizeCategory.MEDIUM,
    experienceLevel: ExperienceLevel.Y5_TO_10,
    rating: 4.8,
    totalSales: 2450000,
    completedOrders: 156,
    responseTime: 2,
    joinedDate: '2022-03-15',
    certifications: ['Organic Certification', 'Rwanda GAP', 'Cooperative Member'],
    verified: true,
    profileImage: '/african-farmer-woman.png',
    phoneNumber: '+250788123456',
    email: 'jean.uwimana@example.com',
    bio: 'Experienced organic farmer specializing in vegetables and root crops. I have been farming for over 8 years in the fertile soils of Musanze district. My farm focuses on sustainable practices and high-quality produce for local and regional markets.',
    totalProducts: 24,
    activeProducts: 18,
    monthlyRevenue: 450000,
    customerSatisfaction: 96,
    repeatCustomers: 78,
    averageOrderValue: 15700,
    onTimeDelivery: 94,
    productViews: 1240,
    verificationScore: 92
  };

  // Mock verification items
  const mockVerificationItems: VerificationItem[] = [
    {
      id: '1',
      type: 'identity',
      label: 'National ID Verification',
      status: 'verified',
      verifiedDate: '2022-03-20',
      description: 'Government-issued national identification',
      verifiedBy: 'Rwanda Development Board'
    },
    {
      id: '2',
      type: 'farm',
      label: 'Farm Location Verification',
      status: 'verified',
      verifiedDate: '2022-03-25',
      description: 'Physical farm location and ownership verification',
      verifiedBy: 'Local Agricultural Officer'
    },
    {
      id: '3',
      type: 'certification',
      label: 'Organic Certification',
      status: 'verified',
      verifiedDate: '2023-01-15',
      expiryDate: '2025-01-15',
      description: 'Certified organic farming practices',
      verifiedBy: 'Rwanda Organic Agriculture Movement'
    },
    {
      id: '4',
      type: 'contact',
      label: 'Phone Number Verification',
      status: 'verified',
      verifiedDate: '2022-03-15',
      description: 'Mobile phone number verification'
    },
    {
      id: '5',
      type: 'business',
      label: 'Business Registration',
      status: 'pending',
      description: 'Formal business registration with RDB'
    }
  ];

  // Mock certification details
  const mockCertifications = [
    {
      id: '1',
      name: 'Organic Farming Certification',
      issuer: 'Rwanda Organic Agriculture Movement (ROAM)',
      issuedDate: '2023-01-15',
      expiryDate: '2025-01-15',
      status: 'active' as const,
      certificateUrl: '/certificates/organic-cert.pdf'
    },
    {
      id: '2',
      name: 'Rwanda GAP Certification',
      issuer: 'Rwanda Agriculture and Animal Resources Development Board',
      issuedDate: '2022-08-10',
      expiryDate: '2024-08-10',
      status: 'active' as const,
      certificateUrl: '/certificates/gap-cert.pdf'
    },
    {
      id: '3',
      name: 'Cooperative Membership',
      issuer: 'Musanze Farmers Cooperative',
      issuedDate: '2022-03-20',
      status: 'active' as const
    }
  ];

  const handleContact = () => {
    console.log('Contact farmer');
  };

  const handleMessage = () => {
    console.log('Send message to farmer');
  };

  const handleShare = () => {
    console.log('Share farmer profile');
  };

  const handleEdit = () => {
    console.log('Edit profile');
  };

  const handleRequestVerification = (type: string) => {
    console.log('Request verification for:', type);
  };

  const handleViewCertificate = (certificateId: string) => {
    console.log('View certificate:', certificateId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-agricultural-primary mb-4">
            Farmer Profile Components Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive farmer profile components showcasing farm details, experience, 
            location, verification status, certifications, and performance metrics.
          </p>
        </div>

        {/* Farmer Profile Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-agricultural-primary">Profile Cards</h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Compact Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4">Compact Variant</h3>
              <FarmerProfileCard
                farmer={mockFarmer}
                variant="compact"
                onViewProfile={() => console.log('View profile')}
              />
            </div>

            {/* Default Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4">Default Variant</h3>
              <FarmerProfileCard
                farmer={mockFarmer}
                variant="default"
                showContactInfo={true}
                onContact={handleContact}
                onViewProfile={() => console.log('View profile')}
              />
            </div>
          </div>

          {/* Detailed Variant */}
          <div>
            <h3 className="text-lg font-medium mb-4">Detailed Variant</h3>
            <FarmerProfileCard
              farmer={mockFarmer}
              variant="detailed"
              showContactInfo={true}
              onContact={handleContact}
              onViewProfile={() => console.log('View profile')}
            />
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-agricultural-primary">Performance Metrics</h2>
          
          <div className="space-y-6">
            {/* Grid Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4">Grid Layout</h3>
              <FarmerPerformanceMetrics
                metrics={{
                  rating: mockFarmer.rating,
                  totalSales: mockFarmer.totalSales,
                  completedOrders: mockFarmer.completedOrders,
                  responseTime: mockFarmer.responseTime,
                  monthlyRevenue: mockFarmer.monthlyRevenue,
                  customerSatisfaction: mockFarmer.customerSatisfaction,
                  repeatCustomers: mockFarmer.repeatCustomers,
                  averageOrderValue: mockFarmer.averageOrderValue,
                  onTimeDelivery: mockFarmer.onTimeDelivery,
                  productViews: mockFarmer.productViews
                }}
                period="month"
                showTrends={true}
                variant="grid"
              />
            </div>

            {/* Compact Variant */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Compact Layout</h3>
                <FarmerPerformanceMetrics
                  metrics={{
                    rating: mockFarmer.rating,
                    totalSales: mockFarmer.totalSales,
                    completedOrders: mockFarmer.completedOrders,
                    responseTime: mockFarmer.responseTime
                  }}
                  variant="compact"
                  showTrends={false}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">List Layout</h3>
                <FarmerPerformanceMetrics
                  metrics={{
                    rating: mockFarmer.rating,
                    totalSales: mockFarmer.totalSales,
                    completedOrders: mockFarmer.completedOrders,
                    responseTime: mockFarmer.responseTime
                  }}
                  variant="list"
                  showTrends={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Verification Status */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-agricultural-primary">Verification Status</h2>
          
          <FarmerVerificationStatus
            verified={mockFarmer.verified}
            verificationScore={mockFarmer.verificationScore}
            verificationItems={mockVerificationItems}
            certifications={mockCertifications}
            onRequestVerification={handleRequestVerification}
            onViewCertificate={handleViewCertificate}
          />
        </section>

        {/* Complete Profile Overview */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-agricultural-primary">Complete Profile Overview</h2>
          
          <FarmerProfileOverview
            farmer={mockFarmer}
            verificationItems={mockVerificationItems}
            certificationDetails={mockCertifications}
            isOwnProfile={false}
            onContact={handleContact}
            onMessage={handleMessage}
            onShare={handleShare}
            onEdit={handleEdit}
            onRequestVerification={handleRequestVerification}
            onViewCertificate={handleViewCertificate}
          />
        </section>
      </div>
    </div>
  );
}