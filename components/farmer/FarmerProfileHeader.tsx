'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
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
  Mail,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Edit
} from 'lucide-react';
import { Farmer, Address, FarmSizeCategory, ExperienceLevel, RwandaCrop } from '@/types';

export interface FarmerProfileHeaderProps {
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
    bio?: string;
    totalProducts?: number;
    activeProducts?: number;
  };
  isOwnProfile?: boolean;
  onContact?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
  onEdit?: () => void;
  className?: string;
}

// Helper functions (same as in FarmerProfileCard)
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

const formatFarmSize = (size: FarmSizeCategory): string => {
  const sizeMap = {
    [FarmSizeCategory.SMALLHOLDER]: 'Smallholder Farm',
    [FarmSizeCategory.MEDIUM]: 'Medium Scale Farm',
    [FarmSizeCategory.LARGE]: 'Large Scale Farm',
    [FarmSizeCategory.COOPERATIVE]: 'Cooperative Farm',
  };
  return sizeMap[size] || 'Unknown';
};

const formatLocation = (address: Address): string => {
  return `${address.district}, ${address.province}`.replace(/_/g, ' ');
};

const formatCropName = (crop: RwandaCrop): string => {
  return crop.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export const FarmerProfileHeader = React.forwardRef<HTMLDivElement, FarmerProfileHeaderProps>(
  ({ 
    farmer, 
    isOwnProfile = false,
    onContact,
    onMessage,
    onShare,
    onEdit,
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
      email,
      bio,
      totalProducts = 0,
      activeProducts = 0
    } = farmer;

    // Calculate rating stars
    const renderStars = (rating: number) => {
      return Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'w-5 h-5',
            i < Math.floor(rating) 
              ? 'text-harvest-gold fill-current' 
              : 'text-gray-300'
          )}
        />
      ));
    };

    return (
      <div 
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        {/* Background with gradient */}
        <div className="relative bg-gradient-agricultural">
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Content */}
          <div className="relative px-6 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left side - Avatar and basic info */}
                <div className="flex flex-col sm:flex-row gap-6 lg:flex-col lg:items-center">
                  <Avatar size="2xl" className="border-4 border-white/30 shadow-lg">
                    <AvatarImage src={profileImage} alt={user.names} />
                    <AvatarFallback className="bg-white/20 text-white font-bold text-2xl">
                      {user.names.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Action buttons for mobile */}
                  <div className="flex gap-2 sm:hidden">
                    {!isOwnProfile && onContact && (
                      <button
                        onClick={onContact}
                        className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium text-white"
                      >
                        Contact
                      </button>
                    )}
                    
                    {!isOwnProfile && onMessage && (
                      <button
                        onClick={onMessage}
                        className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium text-white"
                      >
                        Message
                      </button>
                    )}
                    
                    {isOwnProfile && onEdit && (
                      <button
                        onClick={onEdit}
                        className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium text-white"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Right side - Detailed information */}
                <div className="flex-1 text-white">
                  {/* Header with name and verification */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl lg:text-4xl font-bold">{user.names}</h1>
                        {verified && (
                          <Verified className="w-7 h-7 text-white fill-current" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-white/90 mb-2">
                        <MapPin className="w-5 h-5" />
                        <span className="text-lg">{formatLocation(user.address)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-white/80">
                        <Sprout className="w-4 h-4" />
                        <span>{formatFarmSize(farmSize)}</span>
                        <span className="mx-2">•</span>
                        <span>{formatExperienceLevel(experienceLevel)} experience</span>
                      </div>
                    </div>

                    {/* Action buttons for desktop */}
                    <div className="hidden sm:flex gap-2">
                      {!isOwnProfile && (
                        <>
                          {onContact && (
                            <button
                              onClick={onContact}
                              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium flex items-center gap-2"
                            >
                              <Phone className="w-4 h-4" />
                              Contact
                            </button>
                          )}
                          
                          {onMessage && (
                            <button
                              onClick={onMessage}
                              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium flex items-center gap-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Message
                            </button>
                          )}
                        </>
                      )}
                      
                      {isOwnProfile && onEdit && (
                        <button
                          onClick={onEdit}
                          className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Profile
                        </button>
                      )}
                      
                      {onShare && (
                        <button
                          onClick={onShare}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {bio && (
                    <p className="text-white/90 text-lg mb-4 leading-relaxed">
                      {bio}
                    </p>
                  )}

                  {/* Rating and key metrics */}
                  <div className="flex flex-wrap items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(rating)}
                      </div>
                      <span className="text-xl font-semibold">{rating.toFixed(1)}</span>
                      <span className="text-white/80">({completedOrders} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">{totalSales.toLocaleString()} RWF</span>
                      <span className="text-white/80">total sales</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">{responseTime}h</span>
                      <span className="text-white/80">response time</span>
                    </div>
                  </div>

                  {/* Crops and certifications */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Primary Crops */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Sprout className="w-5 h-5" />
                        Primary Crops
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {crops.slice(0, 4).map((crop, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                          >
                            {formatCropName(crop)}
                          </Badge>
                        ))}
                        {crops.length > 4 && (
                          <Badge 
                            variant="ghost" 
                            className="text-white/80 hover:bg-white/20"
                          >
                            +{crops.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Certifications
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            verified ? 'bg-white' : 'bg-white/50'
                          )} />
                          <span className={cn(
                            'text-sm',
                            verified ? 'text-white' : 'text-white/70'
                          )}>
                            {verified ? 'Verified Farmer' : 'Pending Verification'}
                          </span>
                        </div>
                        
                        {certifications.slice(0, 2).map((cert, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Award className="w-3 h-3 text-harvest-gold" />
                            <span className="text-sm text-white/90">{cert}</span>
                          </div>
                        ))}
                        
                        {certifications.length > 2 && (
                          <span className="text-sm text-white/70">
                            +{certifications.length - 2} more certifications
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Join date and additional info */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/20 text-white/80">
                    {joinedDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Joined {new Date(joinedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span className="text-sm">{activeProducts} active products</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{completedOrders} completed orders</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FarmerProfileHeader.displayName = 'FarmerProfileHeader';