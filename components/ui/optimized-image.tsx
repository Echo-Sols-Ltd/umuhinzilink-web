'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Skeleton } from './loading-states';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  quality,
  fill = false,
  style,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { isSlowConnection, effectiveType } = useNetworkStatus();

  // Adjust quality based on connection speed
  const getOptimalQuality = () => {
    if (quality) return quality;
    
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 30; // Very low quality for 2G
      case '3g':
        return isSlowConnection ? 40 : 60; // Low to medium quality for 3G
      case '4g':
        return 75; // Good quality for 4G
      default:
        return 85; // High quality for fast connections
    }
  };

  // Generate responsive sizes based on connection
  const getResponsiveSizes = () => {
    if (sizes) return sizes;
    
    if (isSlowConnection) {
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    }
    
    return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  };

  // Generate blur placeholder for better perceived performance
  const generateBlurDataURL = (w: number = 10, h: number = 10) => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a simple blur placeholder
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a simple gradient placeholder
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#e5e7eb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }
    
    return canvas.toDataURL();
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Error fallback
  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center text-gray-400 ${className}`}
        style={{ width, height, ...style }}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading && placeholder === 'empty') {
    return (
      <Skeleton 
        className={className}
        style={{ width, height, ...style }}
      />
    );
  }

  const imageProps = {
    src,
    alt,
    className: `transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`,
    priority,
    quality: getOptimalQuality(),
    sizes: getResponsiveSizes(),
    onLoad: handleLoad,
    onError: handleError,
    style,
    ...(placeholder === 'blur' && {
      placeholder: 'blur' as const,
      blurDataURL: blurDataURL || generateBlurDataURL(width || 10, height || 10),
    }),
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width || 400}
      height={height || 300}
    />
  );
}

interface LazyImageProps extends OptimizedImageProps {
  threshold?: number;
  rootMargin?: string;
}

export function LazyImage({
  threshold = 0.1,
  rootMargin = '50px',
  ...imageProps
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  return (
    <div ref={setRef}>
      {isVisible ? (
        <OptimizedImage {...imageProps} />
      ) : (
        <Skeleton 
          className={imageProps.className}
          style={{ 
            width: imageProps.width, 
            height: imageProps.height,
            ...imageProps.style 
          }}
        />
      )}
    </div>
  );
}

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  variant?: 'card' | 'hero' | 'thumbnail' | 'gallery';
}

export function ProductImage({
  src,
  alt,
  className = '',
  priority = false,
  variant = 'card',
}: ProductImageProps) {
  const { isSlowConnection } = useNetworkStatus();

  const variantConfig = {
    card: {
      width: 400,
      height: 300,
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      quality: isSlowConnection ? 40 : 75,
    },
    hero: {
      width: 1200,
      height: 600,
      sizes: '100vw',
      quality: isSlowConnection ? 50 : 85,
    },
    thumbnail: {
      width: 150,
      height: 150,
      sizes: '150px',
      quality: isSlowConnection ? 30 : 60,
    },
    gallery: {
      width: 800,
      height: 600,
      sizes: '(max-width: 768px) 100vw, 80vw',
      quality: isSlowConnection ? 45 : 80,
    },
  };

  const config = variantConfig[variant];

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={config.width}
      height={config.height}
      className={className}
      priority={priority}
      sizes={config.sizes}
      quality={config.quality}
      placeholder="blur"
    />
  );
}

interface AvatarImageProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

export function AvatarImage({
  src,
  alt,
  size = 'md',
  className = '',
  fallback,
}: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  const sizeConfig = {
    sm: { width: 32, height: 32, text: 'text-xs' },
    md: { width: 48, height: 48, text: 'text-sm' },
    lg: { width: 64, height: 64, text: 'text-base' },
    xl: { width: 96, height: 96, text: 'text-lg' },
  };

  const config = sizeConfig[size];

  if (!src || hasError) {
    const initials = fallback || alt.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    return (
      <div
        className={`bg-agricultural-primary text-white rounded-full flex items-center justify-center font-medium ${config.text} ${className}`}
        style={{ width: config.width, height: config.height }}
      >
        {initials}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={config.width}
      height={config.height}
      className={`rounded-full object-cover ${className}`}
      quality={60} // Lower quality for avatars
      onError={() => setHasError(true)}
    />
  );
}