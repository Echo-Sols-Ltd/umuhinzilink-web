'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User,
  MapPin, 
  Calendar, 
  Award, 
  Star, 
  TrendingUp, 
  Clock, 
  ShoppingBag,
  Verified,
  Sprout,
  Users,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  BarChart3,
  Shield,
  FileText,
  Activity
} from 'lucide-react';
import { Farmer } from '@/types';
import { FarmerProfileHeader } from './FarmerProfileHeader';
import { FarmerPerformanceMetrics } from './FarmerPerformanceMetrics';
import { FarmerVerificationStatus, VerificationItem } from './FarmerVerificationStatus';

export interface FarmerProfileOverviewProps {
  farmer: Farmer & {
    rating?: number;
    totalSales?: number;
    completedOrders?: number;
    responseTime?: number;
    joinedDate?: string;
    certifications?: string[];
    verified?: boolean;
    profileImage?: string;
    phoneNumber?: string;
    email?: string;
    bio?: string;
    totalProducts?: number;
    activeProducts?: number;
    monthlyRevenue?: number;
    customerSatisfaction?: number;
    repeatCustomers?: number;
    averageOrderValue?: number;
    onTimeDelivery?: number;
    productViews?: number;
    verificationScore?: number;
  };
  verificationItems?: VerificationItem[];
  certificationDetails?: {
    id: string;
    name: string;
    issuer: string;
    issuedDate: string;
    expiryDate?: string;
    status: 'active' | 'expired' | 'pending';
    certificateUrl?: string;
  }[];
  isOwnProfile?: boolean;
  onContact?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
  onEdit?: () => void;
  onRequestVerification?: (type: string) => void;
  onViewCertificate?: (certificateId: string) => void;
  className?: string;
}

export const FarmerProfileOverview = React.forwardRef<HTMLDivElement, FarmerProfileOverviewProps>(
  ({ 
    farmer,
    verificationItems = [],
    certificationDetails = [],
    isOwnProfile = false,
    onContact,
    onMessage,
    onShare,
    onEdit,
    onRequestVerification,
    onViewCertificate,
    className,
    ...props 
  }, ref) => {
    const [activeTab, setActiveTab] = React.useState('overview');

    // Prepare metrics for performance component
    const performanceMetrics = {
      rating: farmer.rating || 0,
      totalSales: farmer.totalSales || 0,
      completedOrders: farmer.completedOrders || 0,
      responseTime: farmer.responseTime || 0,
      monthlyRevenue: farmer.monthlyRevenue || 0,
      customerSatisfaction: farmer.customerSatisfaction || 0,
      repeatCustomers: farmer.repeatCustomers || 0,
      averageOrderValue: farmer.averageOrderValue || 0,
      onTimeDelivery: farmer.onTimeDelivery || 0,
      productViews: farmer.productViews || 0,
    };

    // Calculate activity stats
    const activityStats = [
      {
        label: 'Products Listed',
        value: farmer.totalProducts || 0,
        icon: <ShoppingBag className="w-5 h-5" />,
        color: 'text-agricultural-primary'
      },
      {
        label: 'Active Listings',
        value: farmer.activeProducts || 0,
        icon: <Activity className="w-5 h-5" />,
        color: 'text-growth-success'
      },
      {
        label: 'Profile Views',
        value: farmer.productViews || 0,
        icon: <Users className="w-5 h-5" />,
        color: 'text-sky-blue'
      },
      {
        label: 'Response Rate',
        value: `${Math.round(((farmer.completedOrders || 0) / Math.max(farmer.productViews || 1, 1)) * 100)}%`,
        icon: <MessageCircle className="w-5 h-5" />,
        color: 'text-earth-ochre'
      }
    ];

    return (
      <div ref={ref} className={cn('space-y-6', className)} {...props}>
        {/* Profile Header */}
        <FarmerProfileHeader
          farmer={farmer}
          isOwnProfile={isOwnProfile}
          onContact={onContact}
          onMessage={onMessage}
          onShare={onShare}
          onEdit={onEdit}
        />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Verification</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="lg:col-span-2">
                <Card className="agricultural-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-agricultural-primary" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-agricultural-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-agricultural-primary mb-1">
                          {farmer.rating?.toFixed(1) || '0.0'}
                        </div>
                        <div className="text-sm text-muted-foreground">Rating</div>
                        <div className="flex justify-center mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'w-3 h-3',
                                i < Math.floor(farmer.rating || 0)
                                  ? 'text-harvest-gold fill-current'
                                  : 'text-gray-300'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-growth-success/5 rounded-lg">
                        <div className="text-2xl font-bold text-growth-success mb-1">
                          {farmer.completedOrders || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Orders</div>
                      </div>
                      
                      <div className="text-center p-4 bg-harvest-gold/5 rounded-lg">
                        <div className="text-2xl font-bold text-harvest-gold mb-1">
                          {farmer.responseTime || 0}h
                        </div>
                        <div className="text-sm text-muted-foreground">Response</div>
                      </div>
                      
                      <div className="text-center p-4 bg-sky-blue/5 rounded-lg">
                        <div className="text-2xl font-bold text-sky-blue mb-1">
                          {((farmer.totalSales || 0) / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-muted-foreground">Sales (RWF)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact & Actions */}
              <div>
                <Card className="agricultural-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-agricultural-primary" />
                      Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {farmer.phoneNumber && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{farmer.phoneNumber}</span>
                      </div>
                    )}
                    
                    {farmer.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{farmer.email}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {farmer.user.address.district}, {farmer.user.address.province}
                      </span>
                    </div>
                    
                    {farmer.joinedDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Joined {new Date(farmer.joinedDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {!isOwnProfile && (
                      <div className="space-y-2 pt-4 border-t">
                        {onContact && (
                          <button
                            onClick={onContact}
                            className="w-full px-4 py-2 bg-agricultural-primary text-white rounded-lg hover:bg-agricultural-primary-light transition-colors font-medium"
                          >
                            Contact Farmer
                          </button>
                        )}
                        
                        {onMessage && (
                          <button
                            onClick={onMessage}
                            className="w-full px-4 py-2 border border-agricultural-primary text-agricultural-primary rounded-lg hover:bg-agricultural-primary/5 transition-colors font-medium"
                          >
                            Send Message
                          </button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bio Section */}
            {farmer.bio && (
              <Card className="agricultural-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-agricultural-primary" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{farmer.bio}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <FarmerPerformanceMetrics
              metrics={performanceMetrics}
              period="month"
              showTrends={true}
              variant="grid"
            />
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification">
            <FarmerVerificationStatus
              verified={farmer.verified || false}
              verificationScore={farmer.verificationScore}
              verificationItems={verificationItems}
              certifications={certificationDetails}
              onRequestVerification={onRequestVerification}
              onViewCertificate={onViewCertificate}
            />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="agricultural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-agricultural-primary" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {activityStats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className={cn('flex justify-center mb-2', stat.color)}>
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity placeholder */}
            <Card className="agricultural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-agricultural-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-2 h-2 bg-growth-success rounded-full" />
                    <span className="text-sm">Listed new product: Fresh Tomatoes</span>
                    <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-2 h-2 bg-sky-blue rounded-full" />
                    <span className="text-sm">Completed order #12345</span>
                    <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-2 h-2 bg-harvest-gold rounded-full" />
                    <span className="text-sm">Received 5-star review</span>
                    <span className="text-xs text-muted-foreground ml-auto">3 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
);

FarmerProfileOverview.displayName = 'FarmerProfileOverview';