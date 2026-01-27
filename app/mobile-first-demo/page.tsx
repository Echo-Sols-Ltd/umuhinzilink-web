'use client';

import React, { useState } from 'react';
import { 
  MobileContainer,
  MobileHeader,
  MobileBottomNav,
  MobileSection,
  MobilePageLayout,
  MobileCardGrid,
  MobileList,
  MobileTabs
} from '@/components/ui/mobile-layout-system';
import { 
  TouchButton,
  ThumbReachLayout,
  ProgressiveContent,
  OfflineCapability,
  MobileNavigation,
  ExpandableContent,
  MobileCard,
  SwipeHandler,
  ResponsiveGrid
} from '@/components/ui/mobile-first-patterns';
import { 
  MobileInput,
  MobileTextarea,
  MobileSelect,
  MobileCheckbox,
  MobileRadioGroup,
  MobileForm
} from '@/components/ui/mobile-forms';
import { 
  MobileProductCard,
  MobileFarmerCard
} from '@/components/ui/mobile-agricultural-cards';
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  Bell,
  Menu,
  ArrowLeft,
  Leaf,
  Truck,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Package,
  Calendar,
  TrendingUp,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function MobileFirstDemo() {
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: '',
    notifications: false,
    preference: '',
  });

  // Sample data
  const sampleProduct = {
    id: '1',
    name: 'Fresh Organic Tomatoes',
    category: 'Vegetables',
    price: 2500,
    unit: 'kg',
    quantity: 150,
    harvestDate: '2024-01-15',
    location: 'Kigali, Rwanda',
    farmer: {
      name: 'Jean Baptiste',
      verified: true,
      rating: 4.8,
      responseTime: '< 2 hours',
    },
    image: '/tomatoes.png',
    images: ['/tomatoes.png', '/fresh-tomatoes.jpg'],
    freshness: 'fresh' as const,
    organic: true,
    description: 'Premium quality organic tomatoes grown using sustainable farming practices. Perfect for cooking and fresh consumption.',
    deliveryOptions: ['Pickup', 'Delivery'],
    minimumOrder: 5,
  };

  const sampleFarmer = {
    id: '1',
    name: 'Marie Uwimana',
    farmName: 'Green Valley Farm',
    location: 'Musanze, Rwanda',
    experience: 8,
    rating: 4.9,
    totalSales: 245,
    responseTime: '1 hour',
    verified: true,
    specialties: ['Organic Vegetables', 'Fruits', 'Herbs', 'Dairy Products'],
    description: 'Passionate organic farmer with 8 years of experience in sustainable agriculture. Specializing in premium quality vegetables and fruits.',
  };

  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { label: 'Products', href: '/products', icon: <Package className="w-5 h-5" /> },
    { label: 'Messages', href: '/messages', icon: <MessageCircle className="w-5 h-5" />, badge: 3 },
    { label: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const bottomNavItems = [
    { 
      icon: <Home className="w-6 h-6" />, 
      activeIcon: <Home className="w-6 h-6 fill-current" />,
      label: 'Home', 
      href: '/', 
      active: true 
    },
    { 
      icon: <Search className="w-6 h-6" />, 
      label: 'Search', 
      href: '/search' 
    },
    { 
      icon: <Heart className="w-6 h-6" />, 
      label: 'Saved', 
      href: '/saved',
      badge: 5
    },
    { 
      icon: <User className="w-6 h-6" />, 
      label: 'Profile', 
      href: '/profile' 
    },
  ];

  const listItems = [
    {
      id: '1',
      title: 'Order #12345',
      subtitle: 'Delivered • 2 days ago',
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: '2',
      title: 'New Message',
      subtitle: 'From Jean Baptiste',
      icon: <MessageCircle className="w-5 h-5" />,
      badge: 'New',
    },
    {
      id: '3',
      title: 'Payment Received',
      subtitle: '15,000 RWF',
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Products', badge: 12 },
    { id: 'farmers', label: 'Farmers' },
    { id: 'forms', label: 'Forms' },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <MobilePageLayout
      header={
        <MobileHeader
          title="Mobile-First Demo"
          showBack
          onBack={() => window.history.back()}
          showNotifications
          onNotifications={() => console.log('Notifications')}
          notificationCount={3}
          showProfile
          onProfile={() => console.log('Profile')}
        />
      }
      bottomNav={<MobileBottomNav items={bottomNavItems} />}
    >
      <MobileContainer>
        {/* Tabs */}
        <MobileTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-6"
        />

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Touch Button Examples */}
            <MobileSection title="Touch-Friendly Buttons">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <TouchButton variant="primary" size="md">
                    Primary Button
                  </TouchButton>
                  <TouchButton variant="secondary" size="md">
                    Secondary
                  </TouchButton>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TouchButton variant="outline" size="lg">
                    Outline Large
                  </TouchButton>
                  <TouchButton variant="ghost" size="lg">
                    Ghost Large
                  </TouchButton>
                </div>
                <TouchButton variant="primary" size="xl" fullWidth>
                  Full Width XL Button
                </TouchButton>
              </div>
            </MobileSection>

            {/* Progressive Content */}
            <MobileSection title="Progressive Loading">
              <div className="space-y-4">
                <ProgressiveContent priority="high">
                  <MobileCard className="p-4">
                    <h3 className="font-semibold mb-2">High Priority Content</h3>
                    <p className="text-gray-600">This content loads first for better user experience.</p>
                  </MobileCard>
                </ProgressiveContent>
                
                <ProgressiveContent priority="medium">
                  <MobileCard className="p-4">
                    <h3 className="font-semibold mb-2">Medium Priority Content</h3>
                    <p className="text-gray-600">This content loads after high priority items.</p>
                  </MobileCard>
                </ProgressiveContent>
                
                <ProgressiveContent priority="low">
                  <MobileCard className="p-4">
                    <h3 className="font-semibold mb-2">Low Priority Content</h3>
                    <p className="text-gray-600">This content loads last to optimize performance.</p>
                  </MobileCard>
                </ProgressiveContent>
              </div>
            </MobileSection>

            {/* Offline Capability */}
            <MobileSection title="Offline Capability">
              <OfflineCapability offlineMessage="This feature requires internet connection">
                <MobileCard className="p-4">
                  <h3 className="font-semibold mb-2">Online Feature</h3>
                  <p className="text-gray-600">This content shows offline indicators when needed.</p>
                  <TouchButton variant="primary" size="sm" className="mt-3">
                    Try Action
                  </TouchButton>
                </MobileCard>
              </OfflineCapability>
            </MobileSection>

            {/* Mobile Navigation */}
            <MobileSection title="Mobile Navigation">
              <MobileNavigation items={navigationItems} />
            </MobileSection>

            {/* Expandable Content */}
            <MobileSection title="Expandable Content">
              <div className="space-y-3">
                <ExpandableContent title="Farming Tips" defaultExpanded>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• Water your crops early in the morning</p>
                    <p>• Use organic compost for better soil health</p>
                    <p>• Rotate crops to prevent soil depletion</p>
                  </div>
                </ExpandableContent>
                
                <ExpandableContent title="Market Prices">
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>Tomatoes: 2,500 RWF/kg</p>
                    <p>Potatoes: 800 RWF/kg</p>
                    <p>Carrots: 1,200 RWF/kg</p>
                  </div>
                </ExpandableContent>
              </div>
            </MobileSection>

            {/* Swipe Handler */}
            <MobileSection title="Swipe Gestures">
              <SwipeHandler
                onSwipeLeft={() => console.log('Swiped left')}
                onSwipeRight={() => console.log('Swiped right')}
                className="bg-agricultural-50 rounded-organic p-6 text-center"
              >
                <p className="text-agricultural-800 font-medium">
                  Swipe left or right on this card
                </p>
                <p className="text-sm text-agricultural-600 mt-1">
                  Check console for swipe events
                </p>
              </SwipeHandler>
            </MobileSection>

            {/* Mobile List */}
            <MobileSection title="Mobile List">
              <MobileList items={listItems} />
            </MobileSection>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <MobileSection title="Product Cards">
              <div className="space-y-6">
                {/* Featured Product */}
                <MobileProductCard
                  product={sampleProduct}
                  variant="featured"
                  onContact={(farmerId) => console.log('Contact farmer:', farmerId)}
                  onSave={(productId) => console.log('Save product:', productId)}
                  onShare={(productId) => console.log('Share product:', productId)}
                />
                
                {/* Grid Products */}
                <MobileCardGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
                  <MobileProductCard
                    product={sampleProduct}
                    variant="grid"
                    onContact={(farmerId) => console.log('Contact farmer:', farmerId)}
                    onSave={(productId) => console.log('Save product:', productId)}
                  />
                  <MobileProductCard
                    product={{
                      ...sampleProduct,
                      id: '2',
                      name: 'Fresh Carrots',
                      price: 1200,
                      freshness: 'good',
                      organic: false,
                    }}
                    variant="grid"
                    onContact={(farmerId) => console.log('Contact farmer:', farmerId)}
                    onSave={(productId) => console.log('Save product:', productId)}
                  />
                </MobileCardGrid>
                
                {/* List Products */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">List View</h3>
                  <MobileProductCard
                    product={sampleProduct}
                    variant="list"
                    onContact={(farmerId) => console.log('Contact farmer:', farmerId)}
                  />
                  <MobileProductCard
                    product={{
                      ...sampleProduct,
                      id: '3',
                      name: 'Organic Potatoes',
                      price: 800,
                      freshness: 'fair',
                    }}
                    variant="list"
                    onContact={(farmerId) => console.log('Contact farmer:', farmerId)}
                  />
                </div>
              </div>
            </MobileSection>
          </div>
        )}

        {/* Farmers Tab */}
        {activeTab === 'farmers' && (
          <div className="space-y-6">
            <MobileSection title="Farmer Profiles">
              <MobileCardGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
                <MobileFarmerCard
                  farmer={sampleFarmer}
                  onContact={(farmerId) => console.log('Contact farmer:', farmerId)}
                  onViewProfile={(farmerId) => console.log('View profile:', farmerId)}
                />
                <MobileFarmerCard
                  farmer={{
                    ...sampleFarmer,
                    id: '2',
                    name: 'Paul Kagame',
                    farmName: 'Sunrise Farm',
                    experience: 12,
                    rating: 4.7,
                    totalSales: 189,
                    specialties: ['Fruits', 'Coffee', 'Tea'],
                  }}
                  onContact={(farmerId) => console.log('Contact farmer:', farmerId)}
                  onViewProfile={(farmerId) => console.log('View profile:', farmerId)}
                />
              </MobileCardGrid>
            </MobileSection>
          </div>
        )}

        {/* Forms Tab */}
        {activeTab === 'forms' && (
          <div className="space-y-6">
            <MobileSection title="Mobile-Optimized Forms">
              <MobileForm onSubmit={handleFormSubmit}>
                <MobileInput
                  label="Full Name"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  placeholder="Enter your full name"
                  required
                />
                
                <MobileInput
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  placeholder="Enter your email"
                  inputMode="email"
                  autoComplete="email"
                  required
                />
                
                <MobileSelect
                  label="Product Category"
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  options={[
                    { value: 'vegetables', label: 'Vegetables' },
                    { value: 'fruits', label: 'Fruits' },
                    { value: 'grains', label: 'Grains' },
                    { value: 'dairy', label: 'Dairy Products' },
                  ]}
                  placeholder="Select a category"
                  required
                />
                
                <MobileTextarea
                  label="Message"
                  value={formData.message}
                  onChange={(value) => setFormData({ ...formData, message: value })}
                  placeholder="Tell us about your farming needs..."
                  rows={4}
                  maxLength={500}
                />
                
                <MobileCheckbox
                  label="I want to receive notifications about new products and market updates"
                  checked={formData.notifications}
                  onChange={(checked) => setFormData({ ...formData, notifications: checked })}
                />
                
                <MobileRadioGroup
                  label="Preferred Contact Method"
                  value={formData.preference}
                  onChange={(value) => setFormData({ ...formData, preference: value })}
                  options={[
                    { value: 'phone', label: 'Phone Call' },
                    { value: 'sms', label: 'SMS' },
                    { value: 'email', label: 'Email' },
                    { value: 'whatsapp', label: 'WhatsApp' },
                  ]}
                  required
                />
                
                <div className="pt-4">
                  <TouchButton
                    variant="primary"
                    size="lg"
                    fullWidth
                    type="submit"
                  >
                    Submit Form
                  </TouchButton>
                </div>
              </MobileForm>
            </MobileSection>
          </div>
        )}
      </MobileContainer>
    </MobilePageLayout>
  );
}