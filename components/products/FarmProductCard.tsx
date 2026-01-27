'use client';

/**
 * Enhanced Farm Product Card Component
 * 
 * Features implemented for Task 3.1:
 * - Organic rounded corners using agricultural design system (12px)
 * - Natural shadow system with green tints (shadow-green-*)
 * - Freshness indicators with agricultural color-coded badges
 * - Farmer verification badges and rating display
 * - Touch-optimized interactions with 44px minimum targets
 * - Agricultural color palette integration
 * - Mobile-first responsive design
 * 
 * Requirements: 5.1 - Farm product cards with agricultural design elements
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Star, 
  Shield, 
  Leaf, 
  MessageCircle,
  Share2,
  Eye,
  Clock,
  Package,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressiveImage } from '@/components/ui/progressive-loading';
import { FarmerProduct } from '@/types/product';
import { CertificationType, ProductStatus, MeasurementUnit } from '@/types/enums';

// Enhanced interface for the farm product card with additional agricultural features
export interface EnhancedFarmProduct extends Omit<FarmerProduct, 'farmer'> {
  farmer: {
    id: string;
    name: string;
    verified: boolean;
    rating: number;
    totalSales?: number;
    responseTime?: number; // in hours
    profileImage?: string;
    farmName?: string;
    experience?: number; // years
  };
  freshness: 'just_harvested' | 'fresh' | 'good' | 'fair';
  organic: boolean;
  views?: number;
  inquiries?: number;
  trending?: boolean;
  discount?: number; // percentage
  originalPrice?: number;
  availableQuantity?: number;
  minimumOrder?: number;
  deliveryOptions?: ('pickup' | 'delivery' | 'shipping')[];
  estimatedDelivery?: string;
  lastUpdated?: Date;
}

export interface FarmProductCardProps {
  product: EnhancedFarmProduct;
  variant?: 'grid' | 'list' | 'featured' | 'compact';
  showFarmerInfo?: boolean;
  showActions?: boolean;
  onContact?: (farmerId: string) => void;
  onSave?: (productId: string) => void;
  onShare?: (productId: string) => void;
  onView?: (productId: string) => void;
  saved?: boolean;
  className?: string;
}

// Freshness indicator configuration with agricultural color system
const freshnessConfig = {
  just_harvested: {
    label: 'Just Harvested',
    color: 'bg-gradient-to-r from-agricultural-500 to-agricultural-600',
    textColor: 'text-white',
    icon: <Leaf className="w-3 h-3" />,
    priority: 4
  },
  fresh: {
    label: 'Fresh',
    color: 'bg-gradient-to-r from-agricultural-400 to-agricultural-500',
    textColor: 'text-white',
    icon: <Leaf className="w-3 h-3" />,
    priority: 3
  },
  good: {
    label: 'Good',
    color: 'bg-gradient-to-r from-harvest-gold-400 to-harvest-gold-500',
    textColor: 'text-white',
    icon: <Clock className="w-3 h-3" />,
    priority: 2
  },
  fair: {
    label: 'Fair',
    color: 'bg-gradient-to-r from-sunrise-orange-400 to-sunrise-orange-500',
    textColor: 'text-white',
    icon: <AlertCircle className="w-3 h-3" />,
    priority: 1
  }
};

// Product status configuration
const statusConfig = {
  [ProductStatus.IN_STOCK]: {
    label: 'In Stock',
    color: 'success',
    icon: <CheckCircle className="w-3 h-3" />
  },
  [ProductStatus.LOW_STOCK]: {
    label: 'Low Stock',
    color: 'warning',
    icon: <AlertCircle className="w-3 h-3" />
  },
  [ProductStatus.OUT_OF_STOCK]: {
    label: 'Out of Stock',
    color: 'destructive',
    icon: <AlertCircle className="w-3 h-3" />
  }
};

// Certification badge configuration
const certificationConfig = {
  [CertificationType.RSB]: {
    label: 'RSB Certified',
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    icon: <Award className="w-3 h-3" />
  },
  [CertificationType.RWANDA_GAP]: {
    label: 'Rwanda GAP',
    color: 'bg-gradient-to-r from-green-600 to-green-700',
    icon: <Shield className="w-3 h-3" />
  },
  [CertificationType.NAEB]: {
    label: 'NAEB Certified',
    color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    icon: <Award className="w-3 h-3" />
  },
  [CertificationType.COOPERATIVE_CERT]: {
    label: 'Cooperative',
    color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    icon: <Shield className="w-3 h-3" />
  },
  [CertificationType.OTHER]: {
    label: 'Certified',
    color: 'bg-gradient-to-r from-gray-500 to-gray-600',
    icon: <Award className="w-3 h-3" />
  },
  [CertificationType.NONE]: null
};

// Format price with currency
const formatPrice = (price: number, unit: MeasurementUnit) => {
  return `${price.toLocaleString()} RWF/${unit.toLowerCase()}`;
};

// Format date relative to now
const formatRelativeDate = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  return `${Math.floor(diffInHours / 24)}d ago`;
};

export const FarmProductCard: React.FC<FarmProductCardProps> = ({
  product,
  variant = 'grid',
  showFarmerInfo = true,
  showActions = true,
  onContact,
  onSave,
  onShare,
  onView,
  saved = false,
  className
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const freshness = freshnessConfig[product.freshness];
  const status = statusConfig[product.productStatus];
  const certification = product.certification !== CertificationType.NONE 
    ? certificationConfig[product.certification] 
    : null;

  const handleCardClick = () => {
    onView?.(product.id);
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  // Calculate discount percentage if applicable
  const hasDiscount = product.originalPrice && product.originalPrice > product.unitPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.unitPrice) / product.originalPrice!) * 100)
    : 0;

  const cardVariants = {
    grid: 'w-full max-w-sm',
    list: 'w-full',
    featured: 'w-full max-w-md',
    compact: 'w-full max-w-xs'
  };

  const imageAspects = {
    grid: 'aspect-[4/3]',
    list: 'aspect-square w-24 h-24 md:w-32 md:h-32',
    featured: 'aspect-[16/10]',
    compact: 'aspect-square'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(cardVariants[variant], className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          'group cursor-pointer overflow-hidden',
          'bg-white dark:bg-gray-900',
          'border border-gray-200 dark:border-gray-700',
          'hover:border-[var(--agricultural-primary-light)] dark:hover:border-[var(--agricultural-primary-lighter)]',
          'transition-all duration-300 ease-out',
          'hover:shadow-green-lg', // Using agricultural shadow system
          'rounded-card-agricultural', // Using agricultural radius system (12px)
          variant === 'list' && 'flex flex-row'
        )}
        onClick={handleCardClick}
      >
        {/* Image Container */}
        <div className={cn(
          'relative overflow-hidden',
          imageAspects[variant],
          variant === 'list' && 'flex-shrink-0'
        )}>
          <ProgressiveImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Overlay Badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* Freshness Badge */}
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
              'backdrop-blur-sm border border-white/20',
              freshness.color,
              freshness.textColor
            )}>
              {freshness.icon}
              <span>{freshness.label}</span>
            </div>
            
            {/* Organic Badge */}
            {product.organic && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-agricultural-600/90 text-white backdrop-blur-sm border border-white/20">
                <Leaf className="w-3 h-3" />
                <span>Organic</span>
              </div>
            )}
            
            {/* Trending Badge */}
            {product.trending && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-sunrise-orange-500/90 text-white backdrop-blur-sm border border-white/20">
                <TrendingUp className="w-3 h-3" />
                <span>Trending</span>
              </div>
            )}
          </div>

          {/* Top Right Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Discount Badge */}
            {hasDiscount && (
              <div className="px-2 py-1 rounded-full text-xs font-bold bg-alert-red text-white backdrop-blur-sm border border-white/20">
                -{discountPercentage}%
              </div>
            )}
            
            {/* Certification Badge */}
            {certification && (
              <div className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white',
                'backdrop-blur-sm border border-white/20',
                certification.color
              )}>
                {certification.icon}
                <span className="hidden sm:inline">{certification.label}</span>
              </div>
            )}
          </div>

          {/* Action Buttons - Show on Hover - Touch Optimized (44px minimum) */}
          {showActions && (
            <div className={cn(
              'absolute top-3 right-3 flex gap-2 transition-all duration-300',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
              certification && 'top-16' // Adjust position if certification badge is present
            )}>
              {onSave && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-11 w-11 min-h-[44px] min-w-[44px] bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 backdrop-blur-sm rounded-organic shadow-green-sm hover:shadow-green-md transition-all duration-200"
                  onClick={(e) => handleActionClick(e, () => onSave(product.id))}
                >
                  <Heart className={cn('w-5 h-5', saved && 'fill-red-500 text-red-500')} />
                </Button>
              )}
              
              {onShare && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-11 w-11 min-h-[44px] min-w-[44px] bg-white/90 hover:bg-white text-gray-700 hover:text-blue-500 backdrop-blur-sm rounded-organic shadow-green-sm hover:shadow-green-md transition-all duration-200"
                  onClick={(e) => handleActionClick(e, () => onShare(product.id))}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              )}
            </div>
          )}

          {/* Bottom Status Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge 
              variant={status.color as any}
              className="text-xs backdrop-blur-sm border border-white/20"
            >
              {status.icon}
              <span className="ml-1">{status.label}</span>
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className={cn(
          'p-4 flex-1',
          variant === 'compact' && 'p-3'
        )}>
          <div className={cn(
            'space-y-3',
            variant === 'list' && 'flex flex-col justify-between h-full'
          )}>
            {/* Product Name and Category */}
            <div>
              <h3 className={cn(
                'font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight',
                variant === 'featured' ? 'text-lg' : 'text-base',
                variant === 'compact' && 'text-sm'
              )}>
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {product.category.toLowerCase().replace('_', ' ')}
              </p>
            </div>

            {/* Location and Harvest Date */}
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatRelativeDate(new Date(product.harvestDate))}</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  'font-bold text-[var(--agricultural-primary)]',
                  variant === 'featured' ? 'text-xl' : 'text-lg',
                  variant === 'compact' && 'text-base'
                )}>
                  {formatPrice(product.unitPrice, product.measurementUnit)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice!, product.measurementUnit)}
                  </span>
                )}
              </div>
              
              {/* Quantity Available */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Package className="w-3 h-3" />
                <span>{product.quantity} {product.measurementUnit.toLowerCase()} available</span>
                {product.minimumOrder && (
                  <span className="text-gray-400">
                    • Min: {product.minimumOrder} {product.measurementUnit.toLowerCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Farmer Information */}
            {showFarmerInfo && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  {product.farmer.profileImage ? (
                    <img
                      src={product.farmer.profileImage}
                      alt={product.farmer.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[var(--agricultural-primary-light)] flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {product.farmer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {product.farmer.name}
                      </span>
                      {product.farmer.verified && (
                        <CheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    {product.farmer.farmName && (
                      <p className="text-xs text-gray-500 truncate">{product.farmer.farmName}</p>
                    )}
                  </div>
                </div>
                
                {/* Farmer Rating */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {product.farmer.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons - Touch Optimized (44px minimum) */}
            {showActions && variant !== 'compact' && (
              <div className="flex gap-2 pt-2">
                {onContact && (
                  <Button
                    size="default"
                    variant="outline"
                    className="flex-1 h-11 min-h-[44px] text-sm border-[var(--agricultural-primary)] text-[var(--agricultural-primary)] hover:bg-[var(--agricultural-primary)] hover:text-white rounded-button-agricultural shadow-green-sm hover:shadow-green-md transition-all duration-200"
                    onClick={(e) => handleActionClick(e, () => onContact(product.farmer.id))}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                )}
                
                <Button
                  size="default"
                  className="flex-1 h-11 min-h-[44px] text-sm bg-[var(--agricultural-primary)] hover:bg-[var(--agricultural-primary-light)] rounded-button-agricultural shadow-green-sm hover:shadow-green-md transition-all duration-200"
                  onClick={(e) => handleActionClick(e, handleCardClick)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            )}

            {/* Metadata */}
            {(product.views || product.inquiries) && (
              <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                {product.views && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{product.views} views</span>
                  </div>
                )}
                {product.inquiries && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{product.inquiries} inquiries</span>
                  </div>
                )}
                {product.lastUpdated && (
                  <span>Updated {formatRelativeDate(product.lastUpdated)}</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FarmProductCard;