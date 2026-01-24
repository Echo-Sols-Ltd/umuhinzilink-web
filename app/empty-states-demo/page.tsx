'use client';

import React, { useState } from 'react';
import { 
  EnhancedEmptyState,
  DashboardEmptyState,
  ProductListEmptyState,
  SearchEmptyState,
  MessagesEmptyState,
  OrdersEmptyState,
  NotificationsEmptyState,
  AnalyticsEmptyState,
} from '@/components/ui/enhanced-empty-states';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function EmptyStatesDemoPage() {
  const [searchTerm, setSearchTerm] = useState('exotic fruits');

  const handleAction = (action: string) => {
    console.log(`Action triggered: ${action}`);
    // In a real app, these would navigate or perform actual actions
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Empty States Demo</h1>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Sparkles className="w-3 h-3 mr-1" />
              Enhanced UI
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Beautiful Empty States & Illustrations
          </h2>
          <p className="text-gray-600 max-w-3xl">
            Explore our enhanced empty state components designed to guide users toward meaningful actions. 
            Each empty state features beautiful illustrations, encouraging messages, and clear call-to-action buttons 
            that maintain the UmuhinziLink green color scheme (#00A63E).
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          {/* Dashboard Empty State */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Empty State</CardTitle>
                <CardDescription>
                  Welcoming new users to their dashboard with encouraging messaging and clear next steps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardEmptyState
                  onCreateFirst={() => handleAction('create-first-product')}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Empty State */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Farmer Products</CardTitle>
                  <CardDescription>
                    Encouraging farmers to add their first product to the marketplace.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductListEmptyState
                    userRole="farmer"
                    onAddProduct={() => handleAction('add-farmer-product')}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Buyer Products</CardTitle>
                  <CardDescription>
                    Inviting buyers to explore available products from local farmers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductListEmptyState
                    userRole="buyer"
                    onAddProduct={() => handleAction('browse-products')}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supplier Inventory</CardTitle>
                  <CardDescription>
                    Helping suppliers get started with their agricultural supplies inventory.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductListEmptyState
                    userRole="supplier"
                    onAddProduct={() => handleAction('add-supplies')}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Search Empty State */}
          <TabsContent value="search" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Search with Term</CardTitle>
                  <CardDescription>
                    When users search for something specific but no results are found.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SearchEmptyState
                    searchTerm={searchTerm}
                    onClearSearch={() => handleAction('clear-search')}
                    onBrowseAll={() => handleAction('browse-all')}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>General Search</CardTitle>
                  <CardDescription>
                    General no results state with helpful suggestions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SearchEmptyState
                    onBrowseAll={() => handleAction('browse-all')}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Messages Empty State */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages Empty State</CardTitle>
                <CardDescription>
                  Encouraging users to start their first conversation and build connections.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MessagesEmptyState
                  onStartConversation={() => handleAction('start-conversation')}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Empty State */}
          <TabsContent value="orders" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Farmer Orders</CardTitle>
                  <CardDescription>
                    When farmers haven't received any orders yet.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrdersEmptyState
                    userRole="farmer"
                    onBrowseProducts={() => handleAction('manage-products')}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Buyer Orders</CardTitle>
                  <CardDescription>
                    Encouraging buyers to place their first order.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrdersEmptyState
                    userRole="buyer"
                    onBrowseProducts={() => handleAction('browse-products')}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supplier Orders</CardTitle>
                  <CardDescription>
                    When suppliers haven't received orders for their supplies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrdersEmptyState
                    userRole="supplier"
                    onBrowseProducts={() => handleAction('manage-inventory')}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Empty State */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications Empty State</CardTitle>
                <CardDescription>
                  A peaceful "all caught up" message when users have no notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationsEmptyState />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Empty State */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Empty State</CardTitle>
                <CardDescription>
                  Explaining why there's no data and guiding users toward generating insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsEmptyState
                  onViewProducts={() => handleAction('view-products')}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Empty State */}
          <TabsContent value="custom" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Empty State</CardTitle>
                  <CardDescription>
                    Example of a fully customized empty state with multiple actions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EnhancedEmptyState
                    illustration="products"
                    title="Welcome to UmuhinziLink"
                    description="Connect with Rwanda's agricultural community. Whether you're a farmer, buyer, or supplier, we're here to help you grow your business."
                    actions={[
                      {
                        label: 'Get Started',
                        onClick: () => handleAction('get-started'),
                        variant: 'primary',
                      },
                      {
                        label: 'Learn More',
                        onClick: () => handleAction('learn-more'),
                        variant: 'secondary',
                      },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compact Size</CardTitle>
                  <CardDescription>
                    Same empty state in a smaller size for constrained spaces.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EnhancedEmptyState
                    illustration="search"
                    title="No Results"
                    description="Try adjusting your search criteria."
                    size="sm"
                    actions={[
                      {
                        label: 'Reset Filters',
                        onClick: () => handleAction('reset-filters'),
                        variant: 'outline',
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Beautiful Illustrations</h4>
                <p className="text-sm text-gray-600">Custom animated SVG illustrations for each context</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Encouraging Messages</h4>
                <p className="text-sm text-gray-600">Positive, action-oriented copy that guides users</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Clear CTAs</h4>
                <p className="text-sm text-gray-600">Prominent call-to-action buttons with green branding</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Smooth Animations</h4>
                <p className="text-sm text-gray-600">Subtle animations that respect user preferences</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Responsive Design</h4>
                <p className="text-sm text-gray-600">Optimized for all screen sizes and devices</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Accessibility First</h4>
                <p className="text-sm text-gray-600">WCAG compliant with proper contrast and focus states</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}