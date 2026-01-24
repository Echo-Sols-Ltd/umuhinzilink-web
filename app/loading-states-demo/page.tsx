'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ShimmerLoadingImage,
  BeautifulProgressBar,
  FileUploadProgress,
  AnimatedPlaceholderCard,
  NetworkStatus,
  PageTransition
} from '@/components/ui/modern-loading-states';
import {
  CompleteDashboardSkeleton,
  ProductListingSkeleton,
  MessageSkeleton
} from '@/components/ui/content-skeleton-screens';
import {
  EnhancedSkeleton,
  SkeletonImage,
  SkeletonProductCard,
  SkeletonDashboardMetric,
  SkeletonSearchResults,
  SkeletonListItem,
  SkeletonProgressBar,
  SkeletonChart,
  SkeletonPageTransition
} from '@/components/ui/enhanced-skeleton';

export default function LoadingStatesDemoPage() {
  const [progress, setProgress] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'slow'>('online');
  const [uploadFiles, setUploadFiles] = useState([
    {
      id: '1',
      name: 'product-image-1.jpg',
      size: 2048576,
      progress: 45,
      status: 'uploading' as const,
      type: 'image/jpeg'
    },
    {
      id: '2',
      name: 'inventory-report.pdf',
      size: 1024000,
      progress: 100,
      status: 'completed' as const,
      type: 'application/pdf'
    },
    {
      id: '3',
      name: 'product-video.mp4',
      size: 15728640,
      progress: 23,
      status: 'error' as const,
      type: 'video/mp4'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handlePageTransition = () => {
    setIsPageLoading(true);
    setTimeout(() => setIsPageLoading(false), 3000);
  };

  const handleNetworkToggle = () => {
    const statuses: Array<'online' | 'offline' | 'slow'> = ['online', 'offline', 'slow'];
    const currentIndex = statuses.indexOf(networkStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setNetworkStatus(statuses[nextIndex]);
  };

  const handleFileCancel = (fileId: string) => {
    setUploadFiles(files => files.filter(f => f.id !== fileId));
  };

  const handleFileRetry = (fileId: string) => {
    setUploadFiles(files => 
      files.map(f => 
        f.id === fileId 
          ? { ...f, status: 'uploading' as const, progress: 0 }
          : f
      )
    );
  };

  return (
    <PageTransition isLoading={isPageLoading}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Loading States & Skeleton Screens</h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive showcase of modern loading states and skeleton components
                </p>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handlePageTransition} variant="outline">
                  Test Page Transition
                </Button>
                <Button onClick={handleNetworkToggle} variant="outline">
                  Toggle Network: {networkStatus}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Network Status */}
          <div className="mb-6">
            <NetworkStatus 
              isOnline={networkStatus !== 'offline'} 
              isSlowConnection={networkStatus === 'slow'} 
            />
          </div>

          <Tabs defaultValue="shimmer" className="space-y-8">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="shimmer">Shimmer Effects</TabsTrigger>
              <TabsTrigger value="progress">Progress Bars</TabsTrigger>
              <TabsTrigger value="upload">File Upload</TabsTrigger>
              <TabsTrigger value="placeholders">Placeholders</TabsTrigger>
              <TabsTrigger value="skeletons">Enhanced Skeletons</TabsTrigger>
              <TabsTrigger value="screens">Skeleton Screens</TabsTrigger>
            </TabsList>

            {/* Shimmer Effects */}
            <TabsContent value="shimmer" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shimmer Image Effects</CardTitle>
                  <CardDescription>
                    Beautiful shimmer effects for image loading with proper aspect ratios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Badge variant="secondary">16:9 Aspect Ratio</Badge>
                      <ShimmerLoadingImage aspectRatio="16:9" />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary">4:3 Aspect Ratio</Badge>
                      <ShimmerLoadingImage aspectRatio="4:3" />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary">1:1 Square</Badge>
                      <ShimmerLoadingImage aspectRatio="1:1" />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary">3:2 Portrait</Badge>
                      <ShimmerLoadingImage aspectRatio="3:2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Badge variant="secondary">Rounded Small</Badge>
                      <ShimmerLoadingImage aspectRatio="4:3" rounded="sm" />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary">Rounded Large</Badge>
                      <ShimmerLoadingImage aspectRatio="4:3" rounded="xl" />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary">Circular</Badge>
                      <ShimmerLoadingImage aspectRatio="1:1" rounded="full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progress Bars */}
            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Beautiful Progress Bars</CardTitle>
                  <CardDescription>
                    Animated progress bars with different variants and sizes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <BeautifulProgressBar 
                      progress={progress} 
                      label="Default Progress" 
                      variant="default"
                    />
                    <BeautifulProgressBar 
                      progress={progress * 0.8} 
                      label="Success Progress" 
                      variant="success"
                    />
                    <BeautifulProgressBar 
                      progress={progress * 0.6} 
                      label="Warning Progress" 
                      variant="warning"
                    />
                    <BeautifulProgressBar 
                      progress={progress * 0.4} 
                      label="Error Progress" 
                      variant="error"
                    />
                    <BeautifulProgressBar 
                      progress={progress * 0.9} 
                      label="Info Progress" 
                      variant="info"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Badge variant="secondary">Small Size</Badge>
                      <BeautifulProgressBar 
                        progress={progress} 
                        size="sm"
                        showPercentage={false}
                      />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary">Medium Size</Badge>
                      <BeautifulProgressBar 
                        progress={progress} 
                        size="md"
                        showPercentage={false}
                      />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary">Large Size</Badge>
                      <BeautifulProgressBar 
                        progress={progress} 
                        size="lg"
                        showPercentage={false}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* File Upload Progress */}
            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>File Upload Progress</CardTitle>
                  <CardDescription>
                    Beautiful file upload progress with different file types and statuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploadProgress 
                    files={uploadFiles}
                    onCancel={handleFileCancel}
                    onRetry={handleFileRetry}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Animated Placeholders */}
            <TabsContent value="placeholders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Animated Placeholder Cards</CardTitle>
                  <CardDescription>
                    Dynamic placeholder cards for different content types
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatedPlaceholderCard 
                      title="Dashboard Metrics"
                      description="Loading dashboard statistics..."
                      variant="metric"
                    />
                    <AnimatedPlaceholderCard 
                      title="Analytics Chart"
                      description="Loading chart data..."
                      variant="chart"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatedPlaceholderCard 
                      title="Recent Activity"
                      description="Loading activity list..."
                      variant="list"
                    />
                    <AnimatedPlaceholderCard 
                      title="Content Area"
                      description="Loading content..."
                      variant="content"
                      showActions
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Skeletons */}
            <TabsContent value="skeletons" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Cards</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SkeletonProductCard />
                    <SkeletonProductCard showRating={false} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SkeletonDashboardMetric />
                    <SkeletonDashboardMetric showTrend={false} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>List Items</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SkeletonListItem />
                    <SkeletonListItem showStatus />
                    <SkeletonListItem showAvatar={false} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Charts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SkeletonChart type="line" />
                    <SkeletonChart type="pie" showLegend={false} />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <SkeletonSearchResults items={6} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skeleton Screens */}
            <TabsContent value="screens" className="space-y-6">
              <Tabs defaultValue="farmer-dashboard" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="farmer-dashboard">Farmer</TabsTrigger>
                  <TabsTrigger value="buyer-dashboard">Buyer</TabsTrigger>
                  <TabsTrigger value="supplier-dashboard">Supplier</TabsTrigger>
                  <TabsTrigger value="admin-dashboard">Admin</TabsTrigger>
                  <TabsTrigger value="government-dashboard">Government</TabsTrigger>
                </TabsList>

                <TabsContent value="farmer-dashboard">
                  <Card>
                    <CardHeader>
                      <CardTitle>Farmer Dashboard Skeleton</CardTitle>
                      <CardDescription>Complete skeleton screen for farmer dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CompleteDashboardSkeleton variant="farmer" />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="buyer-dashboard">
                  <Card>
                    <CardHeader>
                      <CardTitle>Buyer Dashboard Skeleton</CardTitle>
                      <CardDescription>Complete skeleton screen for buyer dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CompleteDashboardSkeleton variant="buyer" />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="supplier-dashboard">
                  <Card>
                    <CardHeader>
                      <CardTitle>Supplier Dashboard Skeleton</CardTitle>
                      <CardDescription>Complete skeleton screen for supplier dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CompleteDashboardSkeleton variant="supplier" />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="admin-dashboard">
                  <Card>
                    <CardHeader>
                      <CardTitle>Admin Dashboard Skeleton</CardTitle>
                      <CardDescription>Complete skeleton screen for admin dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CompleteDashboardSkeleton variant="admin" />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="government-dashboard">
                  <Card>
                    <CardHeader>
                      <CardTitle>Government Dashboard Skeleton</CardTitle>
                      <CardDescription>Complete skeleton screen for government dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CompleteDashboardSkeleton variant="government" />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Listing</CardTitle>
                    <CardDescription>Grid and list layout skeletons</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProductListingSkeleton layout="grid" itemCount={6} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Message/Chat</CardTitle>
                    <CardDescription>Chat interface skeleton</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MessageSkeleton messageCount={6} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}