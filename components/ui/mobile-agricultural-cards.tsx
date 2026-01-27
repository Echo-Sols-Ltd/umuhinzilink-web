'use client';

import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TouchButton, ProgressiveContent } from './mobile-first-patterns';
import { ProgressiveImage } from './progressive-loading';
import { 
  MapPin, 
  Star, 
  Clock, 
  Truck, 
  Shield, 
  Heart, 
  Share2, 
  Phone, 
  MessageCircle,
  Calendar,
  Package,
  TrendingUp,
  Leaf,
  Award
} from 'lucide-react';

// Mobile-optimized farm product card
interface MobileProductCardProps {
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    quantity: number;
    harvestDate: string;
    location: string;
    farmer: {
      name: string;
      verified: boolean;
      rating: number;
      responseTime: string;
    };
    image?: string;
    images?: string[];
    freshness: 'fresh' | 'good' | 'fair';
    organic: boolean;
    description?: string;
    deliveryOptions: string[];
    minimumOrder?: number;
  };
  variant?: 'grid' | 'list' | 'featured';
  onContact?: (farmerId: string) => void;
  onSave?: (productId: string) => void;
  onShare?: (productId: string) => void;
  className?: string;
}

export function MobileProductCard({
  product,
  variant = 'grid',
  onContact,
  onSave,
  onShare,
  className = '',
}: MobileProductCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMobile = useIsMobile();

  const freshnessColors = {
    fresh: 'bg-green-100 text-green-800 border-green-200',
    good: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    fair: 'bg-orange-100 text-orange-800 border-orange-200',
  };

  const freshnessLabels = {
    fresh: 'Just Harvested',
    good: 'Fresh',
    fair: 'Good Quality',
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(product.id);
  };

  const handleShare = () => {
    onShare?.(product.id);
  };

  const handleContact = () => {
    onContact?.(product.farmer.name);
  };

  // Featured variant for hero products
  if (variant === 'featured') {
    return (
      <div className={`bg-white rounded-organic shadow-green-lg border border-gray-200 overflow-hidden ${className}`}>
        {/* Image carousel */}
        <div className="relative h-64 sm:h-80">
          <ProgressiveImage
            src={product.images?.[currentImageIndex] || product.image || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
            lowQualitySrc={product.image ? `${product.image}?w=400&q=30` : undefined}
          />
          
          {/* Image indicators */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${freshnessColors[product.freshness]}`}>
              {freshnessLabels[product.freshness]}
            </span>
            {product.organic && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 flex items-center space-x-1">
                <Leaf className="w-3 h-3" />
                <span>Organic</span>
              </span>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <TouchButton
              onClick={handleSave}
              variant="ghost"
              size="sm"
              className={`bg-white bg-opacity-90 hover:bg-opacity-100 ${isSaved ? 'text-red-500' : 'text-gray-600'}`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </TouchButton>
            <TouchButton
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-600"
            >
              <Share2 className="w-5 h-5" />
            </TouchButton>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-agricultural-primary">
                {product.price.toLocaleString()} RWF
              </p>
              <p className="text-sm text-gray-600">per {product.unit}</p>
            </div>
          </div>
          
          {/* Farmer info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-agricultural-200 rounded-full flex items-center justify-center">
              <span className="text-agricultural-800 font-medium text-sm">
                {product.farmer.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-900">{product.farmer.name}</p>
                {product.farmer.verified && (
                  <Shield className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{product.farmer.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{product.farmer.responseTime}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Available: {product.quantity} {product.unit}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{product.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Harvested: {product.harvestDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{product.deliveryOptions.join(', ')}</span>
            </div>
          </div>
          
          {/* Description */}
          {product.description && (
            <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
          )}
          
          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <TouchButton
              onClick={handleContact}
              variant="primary"
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contact Farmer</span>
            </TouchButton>
            <TouchButton
              onClick={handleContact}
              variant="outline"
              className="flex items-center justify-center space-x-2 px-4"
            >
              <Phone className="w-5 h-5" />
            </TouchButton>
          </div>
        </div>
      </div>
    );
  }

  // List variant for compact display
  if (variant === 'list') {
    return (
      <div className={`bg-white rounded-organic shadow-green-sm border border-gray-200 overflow-hidden ${className}`}>
        <div className="flex">
          {/* Image */}
          <div className="w-24 h-24 flex-shrink-0">
            <ProgressiveImage
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
              lowQualitySrc={product.image ? `${product.image}?w=200&q=30` : undefined}
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 p-4 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
              </div>
              <div className="text-right ml-2">
                <p className="font-bold text-agricultural-primary">
                  {product.price.toLocaleString()} RWF
                </p>
                <p className="text-xs text-gray-600">per {product.unit}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{product.location}</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${freshnessColors[product.freshness]}`}>
                {freshnessLabels[product.freshness]}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className={`bg-white rounded-organic shadow-green-sm hover:shadow-green-md border border-gray-200 overflow-hidden transition-all duration-200 ${className}`}>
      {/* Image */}
      <div className="relative h-48">
        <ProgressiveImage
          src={product.image || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
          lowQualitySrc={product.image ? `${product.image}?w=400&q=30` : undefined}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${freshnessColors[product.freshness]}`}>
            {freshnessLabels[product.freshness]}
          </span>
        </div>
        
        {/* Save button */}
        <TouchButton
          onClick={handleSave}
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 ${isSaved ? 'text-red-500' : 'text-gray-600'}`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </TouchButton>
        
        {/* Organic badge */}
        {product.organic && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 flex items-center space-x-1">
              <Leaf className="w-3 h-3" />
              <span>Organic</span>
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.category}</p>
        </div>
        
        {/* Price */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-bold text-agricultural-primary">
              {product.price.toLocaleString()} RWF
            </p>
            <p className="text-xs text-gray-600">per {product.unit}</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>{product.quantity} {product.unit} available</p>
          </div>
        </div>
        
        {/* Farmer info */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-agricultural-200 rounded-full flex items-center justify-center">
            <span className="text-agricultural-800 font-medium text-xs">
              {product.farmer.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1">
              <p className="text-sm font-medium text-gray-900 truncate">{product.farmer.name}</p>
              {product.farmer.verified && (
                <Shield className="w-3 h-3 text-blue-500 flex-shrink-0" />
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span>{product.farmer.rating}</span>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{product.location}</span>
        </div>
        
        {/* Action button */}
        <TouchButton
          onClick={handleContact}
          variant="primary"
          size="sm"
          fullWidth
          className="mt-3"
        >
          Contact Farmer
        </TouchButton>
      </div>
    </div>
  );
}

// Mobile-optimized farmer profile card
interface MobileFarmerCardProps {
  farmer: {
    id: string;
    name: string;
    farmName?: string;
    location: string;
    experience: number;
    rating: number;
    totalSales: number;
    responseTime: string;
    verified: boolean;
    specialties: string[];
    avatar?: string;
    coverImage?: string;
    description?: string;
  };
  onContact?: (farmerId: string) => void;
  onViewProfile?: (farmerId: string) => void;
  className?: string;
}

export function MobileFarmerCard({
  farmer,
  onContact,
  onViewProfile,
  className = '',
}: MobileFarmerCardProps) {
  return (
    <div className={`bg-white rounded-organic shadow-green-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Cover image */}
      {farmer.coverImage && (
        <div className="h-24 relative">
          <ProgressiveImage
            src={farmer.coverImage}
            alt={`${farmer.name}'s farm`}
            className="w-full h-full object-cover"
            lowQualitySrc={`${farmer.coverImage}?w=400&q=30`}
          />
        </div>
      )}
      
      {/* Profile content */}
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start space-x-3">
          <div className="w-16 h-16 bg-agricultural-200 rounded-full flex items-center justify-center flex-shrink-0">
            {farmer.avatar ? (
              <ProgressiveImage
                src={farmer.avatar}
                alt={farmer.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-agricultural-800 font-bold text-xl">
                {farmer.name.charAt(0)}
              </span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{farmer.name}</h3>
              {farmer.verified && (
                <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
              )}
            </div>
            {farmer.farmName && (
              <p className="text-sm text-gray-600 truncate">{farmer.farmName}</p>
            )}
            <div className="flex items-center space-x-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{farmer.rating}</span>
              <span className="text-sm text-gray-600">({farmer.totalSales} sales)</span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-agricultural-primary">{farmer.experience}</p>
            <p className="text-xs text-gray-600">Years Experience</p>
          </div>
          <div>
            <p className="text-lg font-bold text-agricultural-primary">{farmer.totalSales}</p>
            <p className="text-xs text-gray-600">Total Sales</p>
          </div>
          <div>
            <p className="text-lg font-bold text-agricultural-primary">{farmer.responseTime}</p>
            <p className="text-xs text-gray-600">Response Time</p>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{farmer.location}</span>
        </div>
        
        {/* Specialties */}
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">Specialties</p>
          <div className="flex flex-wrap gap-2">
            {farmer.specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-agricultural-100 text-agricultural-800 rounded-full text-xs"
              >
                {specialty}
              </span>
            ))}
            {farmer.specialties.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{farmer.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        {/* Description */}
        {farmer.description && (
          <p className="text-sm text-gray-700 line-clamp-2">{farmer.description}</p>
        )}
        
        {/* Actions */}
        <div className="flex space-x-3 pt-2">
          <TouchButton
            onClick={() => onViewProfile?.(farmer.id)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            View Profile
          </TouchButton>
          <TouchButton
            onClick={() => onContact?.(farmer.id)}
            variant="primary"
            size="sm"
            className="flex-1"
          >
            Contact
          </TouchButton>
        </div>
      </div>
    </div>
  );
}