'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
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
  Mail
} from 'lucide-react';
import { Farmer, Address, FarmSizeCategory, ExperienceLevel, RwandaCrop } from '@/types';

export interface FarmerProfileCardProps {
  farmer: Farmer & {
    rating?: number;
    totalSales?: number;
    completedOrders?: number;
    responseTime?: number; // in hours
    joinedDate?: string;
    certifications?: string[];
    verified?: boolean;
    profileImage?: string;
    phoneNumber?: string;
    email?: string;
  };
  variant?: 'default' | 'compact' | 'detailed';
  showContactInfo?: boolean;
  onContact?: () => void;
  onViewProfile?: () => void;
  className?: string;
}

// Helper function to format experience level
const formatExperienceLevel = (level: ExperienceLevel): string => {
  const levelMap = {
    [ExperienceLevel.LESS_THAN_1Y]: 'Less than 1 year',
    [ExperienceLevel.Y1_TO_3]: '1-3 years',
    [ExperienceLevel.Y3_TO_5]: '3-5 years',
    [ExperienceLevel.Y5_TO_10]: '5-10 years',
    [ExperienceLevel.MORE_THAN_10]: '10+ years',
  };
  return levelMap[level] || 'Unknown';
};

// Helper function to format farm size
const formatFarmSize = (size: FarmSizeCategory): string => {
  const sizeMap = {
    [FarmSizeCategory.SMALLHOLDER]: 'Smallholder',
    [FarmSizeCategory.MEDIUM]: 'Medium Scale',
    [FarmSizeCategory.LARGE]: 'Large Scale',
    [FarmSizeCategory.COOPERATIVE]: 'Cooperative',
  };
  return sizeMap[size] || 'Unknown';
};

// Helper function to format location
const formatLocation = (address: Address): string => {
  return `${address.district}, ${address.province}`.replace(/_/g, ' ');
};

// Helper function to format crop names
const formatCropName = (crop: RwandaCrop): string => {
  return crop.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export const FarmerProfileCard = React.forwardRef<HTMLDivElement, FarmerProfileCardProps>(
  ({ 
    farmer, 
    variant = 'default', 
    showContactInfo = false,
    onContact,
    onViewProfile,
    className,
    ...props 
  }, ref) => {
    const {
      user,
      crops,
      farmSize,
      experienceLevel,
      rating = 0,
      totalSales = 0,
      completedOrders = 0,
      responseTime = 0,
      joinedDate,
      certifications = [],
      verified = false,
      profileImage,
      phoneNumber,
      email
    } = farmer;

    // Calculate performance metrics
    const performanceMetrics = [
      {
        label: 'Rating',
        value: rating.toFixed(1),
        icon: <Star className="w-4 h-4" />,
        color: 'text-harvest-gold',
        bgColor: 'bg-harvest-gold/10'
      },
      {
        label: 'Total Sales',
        value: `${totalSales.toLocaleString()} RWF`,
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'text-agricultural-primary',
        bgColor: 'bg-agricultural-primary/10'
      },
      {
        label: 'Orders',
        value: completedOrders.toString(),
        icon: <ShoppingBag className="w-4 h-4" />,
        color: 'text-sky-blue',
        bgColor: 'bg-sky-blue/10'
      },
      {
        label: 'Response Time',
        value: `${responseTime}h`,
        icon: <Clock className="w-4 h-4" />,
        color: 'text-earth-ochre',
        bgColor: 'bg-earth-ochre/10'
      }
    ];

    if (variant === 'compact') {
      return (
        <Card 
          ref={ref}
          className={cn(
            'agricultural-card hover:shadow-agricultural-md transition-all duration-300',
            'cursor-pointer',
            className
          )}
          onClick={onViewProfile}
          {...props}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar size="lg" className="border-2 border-agricultural-primary/20">
                <AvatarImage src={profileImage} alt={user.names} />
                <AvatarFallback className="bg-agricultural-primary/10 text-agricultural-primary font-semibold">
                  {user.names.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg truncate">{user.names}</h3>
                  {verified && (
                    <Verified className="w-5 h-5 text-agricultural-primary fill-current" />
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{formatLocation(user.address)}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-harvest-gold fill-current" />
                    <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="w-4 h-4 text-agricultural-primary" />
                    <span className="text-sm">{completedOrders} orders</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card 
        ref={ref}
        className={cn(
          'agricultural-card hover:shadow-agricultural-lg transition-all duration-300',
          'overflow-hidden',
          className
        )}
        {...props}
      >
        {/* Header with background gradient */}
        <div className="relative bg-gradient-agricultural p-6 text-white">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <Avatar size="xl" className="border-3 border-white/20">
                  <AvatarImage src={profileImage} alt={user.names} />
                  <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                    {user.names.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold">{user.names}</h2>
                    {verified && (
                      <Verified className="w-6 h-6 text-white fill-current" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-white/90 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{formatLocation(user.address)}</span>
                  </div>
                  
                  {joinedDate && (
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(joinedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {onContact && (
                <button
                  onClick={onContact}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                >
                  Contact
                </button>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {performanceMetrics.map((metric, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className={cn('p-2 rounded-full', metric.bgColor)}>
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="font-semibold">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Farm Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-agricultural-primary" />
                Farm Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Farm Size:</span>
                  <span className="font-medium">{formatFarmSize(farmSize)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-medium">{formatExperienceLevel(experienceLevel)}</span>
                </div>
                
                <div>
                  <span className="text-muted-foreground block mb-2">Primary Crops:</span>
                  <div className="flex flex-wrap gap-1">
                    {crops.slice(0, 3).map((crop, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        size="sm"
                        className="bg-agricultural-primary/10 text-agricultural-primary"
                      >
                        {formatCropName(crop)}
                      </Badge>
                    ))}
                    {crops.length > 3 && (
                      <Badge variant="ghost" size="sm">
                        +{crops.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications & Verification */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-harvest-gold" />
                Certifications
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    verified ? 'bg-growth-success' : 'bg-gray-300'
                  )} />
                  <span className={cn(
                    'font-medium',
                    verified ? 'text-growth-success' : 'text-muted-foreground'
                  )}>
                    {verified ? 'Verified Farmer' : 'Pending Verification'}
                  </span>
                </div>
                
                {certifications.length > 0 ? (
                  <div className="space-y-2">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-harvest-gold" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No certifications yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {showContactInfo && (phoneNumber || email) && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-blue" />
                Contact Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{phoneNumber}</span>
                  </div>
                )}
                
                {email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {variant === 'detailed' && (
            <div className="flex gap-3 mt-6 pt-4 border-t">
              {onViewProfile && (
                <button
                  onClick={onViewProfile}
                  className="flex-1 px-4 py-2 bg-agricultural-primary text-white rounded-lg hover:bg-agricultural-primary-light transition-colors font-medium"
                >
                  View Full Profile
                </button>
              )}
              
              {onContact && (
                <button
                  onClick={onContact}
                  className="px-6 py-2 border border-agricultural-primary text-agricultural-primary rounded-lg hover:bg-agricultural-primary/5 transition-colors font-medium"
                >
                  Contact
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

FarmerProfileCard.displayName = 'FarmerProfileCard';