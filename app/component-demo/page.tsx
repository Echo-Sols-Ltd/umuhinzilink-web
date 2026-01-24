'use client';

import React, { useState } from 'react';
import { 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  ProductCard,
  DashboardCard,
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  SkeletonDashboard,
  SkeletonForm,
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  Badge,
  StatusBadge,
  PriorityBadge,
  CountBadge,
  showToast,
  useToast
} from '@/components/ui';
import { 
  Heart, 
  Share2, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package,
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Zap
} from 'lucide-react';

export default function ComponentDemo() {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const { toast } = useToast();

  const handleLoadingDemo = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    showToast.success('Action completed successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length > 0 && value.length < 3) {
      setInputError('Must be at least 3 characters');
    } else {
      setInputError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-text">Enhanced UI Component Library</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Showcasing beautiful, modern components with animations, hover effects, and enhanced user experience
          </p>
        </div>

        {/* Button Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Enhanced Buttons</h2>
          <Card>
            <CardHeader>
              <CardTitle>Button Variants & States</CardTitle>
              <CardDescription>
                Multiple variants with loading states, icons, and smooth animations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Variants */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Primary Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              {/* Semantic Variants */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Semantic Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="info">Info</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              {/* With Icons */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">With Icons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button icon={<Heart className="h-4 w-4" />} iconPosition="left">
                    Like
                  </Button>
                  <Button icon={<Share2 className="h-4 w-4" />} iconPosition="right" variant="outline">
                    Share
                  </Button>
                  <Button size="icon">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Loading States */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Loading States</h3>
                <div className="flex flex-wrap gap-3">
                  <Button loading={loading} onClick={handleLoadingDemo}>
                    {loading ? 'Processing...' : 'Start Process'}
                  </Button>
                  <Button loading variant="outline">
                    Loading...
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Enhanced Inputs */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Enhanced Input Fields</h2>
          <Card>
            <CardHeader>
              <CardTitle>Input Variants & States</CardTitle>
              <CardDescription>
                Floating labels, validation states, icons, and beautiful animations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  icon={<Mail className="h-4 w-4" />}
                  helpText="We'll never share your email"
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone"
                  icon={<Phone className="h-4 w-4" />}
                  success={true}
                />
                
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  showPasswordToggle
                  error={inputError}
                  value={inputValue}
                  onChange={handleInputChange}
                />
                
                <Input
                  label="Loading State"
                  placeholder="Processing..."
                  loading={true}
                  disabled
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Input Variants</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Default"
                    variant="default"
                    placeholder="Default input"
                  />
                  <Input
                    label="Filled"
                    variant="filled"
                    placeholder="Filled input"
                  />
                  <Input
                    label="Outlined"
                    variant="outlined"
                    placeholder="Outlined input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Enhanced Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Enhanced Cards</h2>
          
          {/* Product Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductCard
                image="/tomatoes.png"
                title="Fresh Organic Tomatoes"
                price="$4.99/kg"
                originalPrice="$6.99/kg"
                rating={4}
                badge="30% OFF"
                onSave={() => showToast.success('Added to favorites!')}
                onShare={() => showToast.info('Share link copied!')}
              >
                <p className="text-sm text-muted-foreground mt-2">
                  Fresh from local farms, perfect for salads and cooking.
                </p>
              </ProductCard>

              <ProductCard
                image="/carrots.png"
                title="Premium Carrots"
                price="$2.99/kg"
                rating={5}
                badge="ORGANIC"
                saved={true}
                onSave={() => showToast.error('Removed from favorites!')}
              >
                <p className="text-sm text-muted-foreground mt-2">
                  Sweet and crunchy carrots, rich in vitamins.
                </p>
              </ProductCard>

              <ProductCard
                image="/potatoes.png"
                title="Irish Potatoes"
                price="$1.99/kg"
                rating={4}
                onSave={() => showToast.success('Added to favorites!')}
              >
                <p className="text-sm text-muted-foreground mt-2">
                  Perfect for mashing, frying, or roasting.
                </p>
              </ProductCard>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dashboard Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Total Revenue"
                value="$12,345"
                change={12.5}
                trend="up"
                icon={<DollarSign className="h-6 w-6" />}
              />
              
              <DashboardCard
                title="Active Users"
                value="1,234"
                change={-2.3}
                trend="down"
                icon={<Users className="h-6 w-6" />}
              />
              
              <DashboardCard
                title="Products Sold"
                value="456"
                change={8.1}
                trend="up"
                icon={<Package className="h-6 w-6" />}
              />
              
              <DashboardCard
                title="Growth Rate"
                value="23.4%"
                trend="neutral"
                icon={<TrendingUp className="h-6 w-6" />}
                loading={loading}
              />
            </div>
          </div>

          {/* Card Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Card Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card variant="default" hover="lift" interactive>
                <CardContent className="p-6">
                  <h4 className="font-semibold">Default Card</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Standard card with lift hover effect
                  </p>
                </CardContent>
              </Card>

              <Card variant="elevated" hover="scale" interactive>
                <CardContent className="p-6">
                  <h4 className="font-semibold">Elevated Card</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Elevated card with scale hover effect
                  </p>
                </CardContent>
              </Card>

              <Card variant="outlined" hover="glow" interactive>
                <CardContent className="p-6">
                  <h4 className="font-semibold">Outlined Card</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Outlined card with glow hover effect
                  </p>
                </CardContent>
              </Card>

              <Card variant="gradient" hover="lift" interactive>
                <CardContent className="p-6">
                  <h4 className="font-semibold">Gradient Card</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Gradient card with subtle background
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Avatars */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Enhanced Avatars</h2>
          <Card>
            <CardHeader>
              <CardTitle>Avatar Variants & Features</CardTitle>
              <CardDescription>
                Status indicators, badges, sizes, and avatar groups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sizes */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Sizes</h3>
                <div className="flex items-center gap-4">
                  <Avatar size="sm">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <Avatar size="default">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>MD</AvatarFallback>
                  </Avatar>
                  <Avatar size="lg">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>LG</AvatarFallback>
                  </Avatar>
                  <Avatar size="xl">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>XL</AvatarFallback>
                  </Avatar>
                  <Avatar size="2xl">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>2XL</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Status Indicators</h3>
                <div className="flex items-center gap-4">
                  <Avatar showStatus status="online">
                    <AvatarFallback>ON</AvatarFallback>
                  </Avatar>
                  <Avatar showStatus status="away">
                    <AvatarFallback>AW</AvatarFallback>
                  </Avatar>
                  <Avatar showStatus status="busy">
                    <AvatarFallback>BS</AvatarFallback>
                  </Avatar>
                  <Avatar showStatus status="offline">
                    <AvatarFallback>OF</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* With Badges */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">With Badges</h3>
                <div className="flex items-center gap-4">
                  <Avatar badge="3">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar badge="99+" size="lg">
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <Avatar badge="!" size="xl">
                    <AvatarFallback>CD</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Avatar Group */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Avatar Groups</h3>
                <AvatarGroup max={4}>
                  <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
                  <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
                  <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
                  <Avatar><AvatarFallback>EF</AvatarFallback></Avatar>
                  <Avatar><AvatarFallback>GH</AvatarFallback></Avatar>
                  <Avatar><AvatarFallback>IJ</AvatarFallback></Avatar>
                </AvatarGroup>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Enhanced Badges</h2>
          <Card>
            <CardHeader>
              <CardTitle>Badge Variants & Types</CardTitle>
              <CardDescription>
                Status badges, priority indicators, and dismissible badges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Variants */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Basic Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="ghost">Ghost</Badge>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Sizes</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm">Small</Badge>
                  <Badge size="default">Default</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>

              {/* With Icons */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">With Icons</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge icon={<CheckCircle className="h-3 w-3" />} variant="success">
                    Verified
                  </Badge>
                  <Badge icon={<AlertCircle className="h-3 w-3" />} variant="warning">
                    Warning
                  </Badge>
                  <Badge icon={<Info className="h-3 w-3" />} variant="info">
                    Information
                  </Badge>
                  <Badge icon={<Zap className="h-3 w-3" />} variant="default">
                    Premium
                  </Badge>
                </div>
              </div>

              {/* Status Badges */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Status Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status="active" />
                  <StatusBadge status="inactive" />
                  <StatusBadge status="pending" />
                  <StatusBadge status="completed" />
                  <StatusBadge status="cancelled" />
                  <StatusBadge status="draft" />
                </div>
              </div>

              {/* Priority Badges */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Priority Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <PriorityBadge priority="low" />
                  <PriorityBadge priority="medium" />
                  <PriorityBadge priority="high" />
                  <PriorityBadge priority="urgent" />
                </div>
              </div>

              {/* Count Badges */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Count Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <CountBadge count={5} />
                  <CountBadge count={23} />
                  <CountBadge count={150} max={99} />
                </div>
              </div>

              {/* Dismissible Badges */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Dismissible Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    dismissible 
                    onDismiss={() => showToast.info('Badge dismissed')}
                  >
                    Dismissible
                  </Badge>
                  <Badge 
                    variant="success" 
                    dismissible 
                    onDismiss={() => showToast.info('Success badge dismissed')}
                  >
                    Success
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Skeleton Loading States */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Skeleton Loading States</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Skeletons */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Skeletons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <SkeletonText lines={3} />
                <div className="flex items-center gap-3">
                  <SkeletonAvatar />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complex Skeletons */}
            <Card>
              <CardHeader>
                <CardTitle>Complex Skeletons</CardTitle>
              </CardHeader>
              <CardContent>
                <SkeletonCard showAvatar showImage lines={2} />
              </CardContent>
            </Card>

            {/* Table Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle>Table Skeleton</CardTitle>
              </CardHeader>
              <CardContent>
                <SkeletonTable rows={4} columns={3} />
              </CardContent>
            </Card>

            {/* List Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle>List Skeleton</CardTitle>
              </CardHeader>
              <CardContent>
                <SkeletonList items={4} />
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <SkeletonDashboard />
            </CardContent>
          </Card>

          {/* Form Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>Form Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <SkeletonForm fields={3} />
            </CardContent>
          </Card>
        </section>

        {/* Toast Notifications */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Toast Notifications</h2>
          <Card>
            <CardHeader>
              <CardTitle>Toast Examples</CardTitle>
              <CardDescription>
                Beautiful notifications with animations and actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="success" 
                  onClick={() => showToast.success('Success! Operation completed.')}
                >
                  Success Toast
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => showToast.error('Error! Something went wrong.')}
                >
                  Error Toast
                </Button>
                <Button 
                  variant="warning" 
                  onClick={() => showToast.warning('Warning! Please check your input.')}
                >
                  Warning Toast
                </Button>
                <Button 
                  variant="info" 
                  onClick={() => showToast.info('Info: Here\'s some information.')}
                >
                  Info Toast
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const toastId = showToast.loading('Processing your request...');
                    setTimeout(() => {
                      showToast.success('Request completed!');
                    }, 2000);
                  }}
                >
                  Loading Toast
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    showToast.promise(
                      new Promise((resolve) => setTimeout(resolve, 2000)),
                      {
                        loading: 'Saving data...',
                        success: 'Data saved successfully!',
                        error: 'Failed to save data',
                      }
                    );
                  }}
                >
                  Promise Toast
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}