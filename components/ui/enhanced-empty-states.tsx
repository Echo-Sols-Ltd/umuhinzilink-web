'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  Search,
  MessageSquare,
  BarChart3,
  Heart,
  Bell,
  FileText,
  Users,
  Leaf,
  TrendingUp,
  Calendar,
  Star,
  Plus,
  ArrowRight,
  RefreshCw,
  Filter,
  Sparkles,
  Target,
  Zap,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Animation variants for different empty state types
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const iconVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};

const floatingVariants: Variants = {
  float: {
    y: [-4, 4, -4],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Base empty state interface
interface BaseEmptyStateProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

// Enhanced empty state with illustration
interface EnhancedEmptyStateProps extends BaseEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  illustration?: 'dashboard' | 'products' | 'search' | 'messages' | 'orders' | 'analytics' | 'notifications' | 'custom';
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: React.ReactNode;
  }>;
  suggestions?: string[];
  showBackground?: boolean;
}

// Illustration components
const DashboardIllustration = ({ className }: { className?: string }) => (
  <motion.div
    className={cn("relative w-32 h-32 mx-auto mb-6", className)}
    variants={iconVariants}
    whileHover="hover"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 rounded-full opacity-20"
      variants={floatingVariants}
      animate="float"
    />
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg"
        whileHover={{ rotate: 5 }}
        transition={{ duration: 0.2 }}
      >
        <BarChart3 className="w-8 h-8 text-white" />
      </motion.div>
      <motion.div
        className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <TrendingUp className="w-4 h-4 text-white" />
      </motion.div>
      <motion.div
        className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <Sparkles className="w-3 h-3 text-white" />
      </motion.div>
    </div>
  </motion.div>
);

const ProductsIllustration = ({ className }: { className?: string }) => (
  <motion.div
    className={cn("relative w-32 h-32 mx-auto mb-6", className)}
    variants={iconVariants}
    whileHover="hover"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full opacity-20"
      variants={floatingVariants}
      animate="float"
    />
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
        whileHover={{ rotate: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Package className="w-8 h-8 text-white" />
      </motion.div>
      <motion.div
        className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Plus className="w-3 h-3 text-white" />
      </motion.div>
      <motion.div
        className="absolute -bottom-1 -left-1 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <Leaf className="w-4 h-4 text-white" />
      </motion.div>
    </div>
  </motion.div>
);

const SearchIllustration = ({ className }: { className?: string }) => (
  <motion.div
    className={cn("relative w-32 h-32 mx-auto mb-6", className)}
    variants={iconVariants}
    whileHover="hover"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full opacity-20"
      variants={floatingVariants}
      animate="float"
    />
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <Search className="w-8 h-8 text-white" />
      </motion.div>
      <motion.div
        className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Filter className="w-4 h-4 text-white" />
      </motion.div>
      <motion.div
        className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <Target className="w-3 h-3 text-white" />
      </motion.div>
    </div>
  </motion.div>
);

const MessagesIllustration = ({ className }: { className?: string }) => (
  <motion.div
    className={cn("relative w-32 h-32 mx-auto mb-6", className)}
    variants={iconVariants}
    whileHover="hover"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full opacity-20"
      variants={floatingVariants}
      animate="float"
    />
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"
        whileHover={{ rotate: 3 }}
        transition={{ duration: 0.2 }}
      >
        <MessageSquare className="w-8 h-8 text-white" />
      </motion.div>
      <motion.div
        className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Heart className="w-3 h-3 text-white" />
      </motion.div>
      <motion.div
        className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <Users className="w-4 h-4 text-white" />
      </motion.div>
    </div>
  </motion.div>
);

const OrdersIllustration = ({ className }: { className?: string }) => (
  <motion.div
    className={cn("relative w-32 h-32 mx-auto mb-6", className)}
    variants={iconVariants}
    whileHover="hover"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-200 rounded-full opacity-20"
      variants={floatingVariants}
      animate="float"
    />
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg"
        whileHover={{ rotate: -3 }}
        transition={{ duration: 0.2 }}
      >
        <ShoppingCart className="w-8 h-8 text-white" />
      </motion.div>
      <motion.div
        className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Calendar className="w-4 h-4 text-white" />
      </motion.div>
      <motion.div
        className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <Star className="w-3 h-3 text-white" />
      </motion.div>
    </div>
  </motion.div>
);

const NotificationsIllustration = ({ className }: { className?: string }) => (
  <motion.div
    className={cn("relative w-32 h-32 mx-auto mb-6", className)}
    variants={iconVariants}
    whileHover="hover"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-teal-100 to-cyan-200 rounded-full opacity-20"
      variants={floatingVariants}
      animate="float"
    />
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <Bell className="w-8 h-8 text-white" />
      </motion.div>
      <motion.div
        className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Zap className="w-3 h-3 text-white" />
      </motion.div>
      <motion.div
        className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <Sparkles className="w-4 h-4 text-white" />
      </motion.div>
    </div>
  </motion.div>
);

// Illustration selector
const getIllustration = (type: string, className?: string) => {
  switch (type) {
    case 'dashboard':
      return <DashboardIllustration className={className} />;
    case 'products':
      return <ProductsIllustration className={className} />;
    case 'search':
      return <SearchIllustration className={className} />;
    case 'messages':
      return <MessagesIllustration className={className} />;
    case 'orders':
      return <OrdersIllustration className={className} />;
    case 'analytics':
      return <DashboardIllustration className={className} />;
    case 'notifications':
      return <NotificationsIllustration className={className} />;
    default:
      return <DashboardIllustration className={className} />;
  }
};

// Main enhanced empty state component
export function EnhancedEmptyState({
  icon,
  title,
  description,
  illustration = 'dashboard',
  actions = [],
  suggestions = [],
  showBackground = true,
  className,
  size = 'md',
  animated = true,
}: EnhancedEmptyStateProps) {
  const sizeClasses = {
    sm: 'py-8 px-4',
    md: 'py-12 px-6',
    lg: 'py-16 px-8',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const descriptionSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const MotionWrapper = animated ? motion.div : 'div';
  const motionProps = animated
    ? {
        variants: containerVariants,
        initial: 'hidden',
        animate: 'visible',
      }
    : {};

  return (
    <MotionWrapper
      className={cn(
        'text-center relative',
        sizeClasses[size],
        showBackground && 'bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100',
        className
      )}
      {...motionProps}
    >
      {/* Background decoration */}
      {showBackground && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-blue-50/30 rounded-xl opacity-50" />
      )}

      <div className="relative z-10">
        {/* Illustration */}
        <motion.div variants={animated ? itemVariants : undefined}>
          {icon || getIllustration(illustration)}
        </motion.div>

        {/* Title */}
        <motion.h3
          className={cn(
            'font-semibold text-gray-900 mb-2',
            titleSizes[size]
          )}
          variants={animated ? itemVariants : undefined}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className={cn(
            'text-gray-600 mb-6 max-w-md mx-auto leading-relaxed',
            descriptionSizes[size]
          )}
          variants={animated ? itemVariants : undefined}
        >
          {description}
        </motion.p>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <motion.div
            className="mb-6"
            variants={animated ? itemVariants : undefined}
          >
            <p className="text-sm text-gray-500 mb-3">Try searching for:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion, index) => (
                <motion.span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            variants={animated ? itemVariants : undefined}
          >
            {actions.map((action, index) => {
              // Map action variants to button variants
              const getButtonVariant = (actionVariant?: string) => {
                switch (actionVariant) {
                  case 'primary':
                    return 'default';
                  case 'secondary':
                    return 'secondary';
                  case 'outline':
                    return 'outline';
                  default:
                    return 'default';
                }
              };

              return (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={getButtonVariant(action.variant)}
                  className={cn(
                    'min-w-[120px]',
                    action.variant === 'primary' && 'bg-green-600 hover:bg-green-700 text-white',
                    action.variant === 'secondary' && 'bg-gray-100 hover:bg-gray-200 text-gray-700',
                  )}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              );
            })}
          </motion.div>
        )}
      </div>
    </MotionWrapper>
  );
}

// Specialized empty state components for different contexts

// Dashboard Empty State
export function DashboardEmptyState({
  className,
  onCreateFirst,
  ...props
}: Omit<EnhancedEmptyStateProps, 'illustration' | 'title' | 'description'> & {
  onCreateFirst?: () => void;
}) {
  return (
    <EnhancedEmptyState
      illustration="dashboard"
      title="Welcome to Your Dashboard"
      description="Your dashboard will come alive with data once you start adding products and receiving orders. Let's get you started!"
      actions={onCreateFirst ? [
        {
          label: 'Add Your First Product',
          onClick: onCreateFirst,
          variant: 'primary',
          icon: <Plus className="w-4 h-4" />,
        },
      ] : []}
      className={className}
      {...props}
    />
  );
}

// Product List Empty State
export function ProductListEmptyState({
  className,
  onAddProduct,
  userRole = 'farmer',
  ...props
}: Omit<EnhancedEmptyStateProps, 'illustration' | 'title' | 'description'> & {
  onAddProduct?: () => void;
  userRole?: 'farmer' | 'buyer' | 'supplier';
}) {
  const content = {
    farmer: {
      title: "Ready to Share Your Harvest?",
      description: "Start showcasing your fresh produce to buyers across Rwanda. Add your first product and begin connecting with customers who value quality agricultural products.",
      actionLabel: "Add Your First Product",
    },
    buyer: {
      title: "Discover Fresh Produce",
      description: "Explore a wide variety of fresh, locally-grown products from farmers across Rwanda. Start browsing to find the perfect ingredients for your needs.",
      actionLabel: "Browse Products",
    },
    supplier: {
      title: "Stock Your Inventory",
      description: "Add agricultural supplies, tools, and equipment to help farmers succeed. Your products will be visible to farmers looking for quality supplies.",
      actionLabel: "Add Supplies",
    },
  };

  const { title, description, actionLabel } = content[userRole];

  return (
    <EnhancedEmptyState
      illustration="products"
      title={title}
      description={description}
      actions={onAddProduct ? [
        {
          label: actionLabel,
          onClick: onAddProduct,
          variant: 'primary',
          icon: <Plus className="w-4 h-4" />,
        },
      ] : []}
      className={className}
      {...props}
    />
  );
}

// Search Results Empty State
export function SearchEmptyState({
  className,
  searchTerm,
  onClearSearch,
  onBrowseAll,
  ...props
}: Omit<EnhancedEmptyStateProps, 'illustration' | 'title' | 'description'> & {
  searchTerm?: string;
  onClearSearch?: () => void;
  onBrowseAll?: () => void;
}) {
  return (
    <EnhancedEmptyState
      illustration="search"
      title={searchTerm ? `No results for "${searchTerm}"` : "No Results Found"}
      description="We couldn't find any products matching your search. Try adjusting your search terms or browse our full catalog of fresh produce."
      suggestions={['Tomatoes', 'Potatoes', 'Carrots', 'Cabbage', 'Beans']}
      actions={[
        ...(onClearSearch ? [{
          label: 'Clear Search',
          onClick: onClearSearch,
          variant: 'secondary' as const,
          icon: <RefreshCw className="w-4 h-4" />,
        }] : []),
        ...(onBrowseAll ? [{
          label: 'Browse All Products',
          onClick: onBrowseAll,
          variant: 'primary' as const,
          icon: <ArrowRight className="w-4 h-4" />,
        }] : []),
      ]}
      className={className}
      {...props}
    />
  );
}

// Messages/Conversations Empty State
export function MessagesEmptyState({
  className,
  onStartConversation,
  ...props
}: Omit<EnhancedEmptyStateProps, 'illustration' | 'title' | 'description'> & {
  onStartConversation?: () => void;
}) {
  return (
    <EnhancedEmptyState
      illustration="messages"
      title="Start Your First Conversation"
      description="Connect with farmers, buyers, and suppliers in your network. Build relationships and grow your agricultural business through meaningful conversations."
      actions={onStartConversation ? [
        {
          label: 'Start Messaging',
          onClick: onStartConversation,
          variant: 'primary',
          icon: <MessageSquare className="w-4 h-4" />,
        },
      ] : []}
      className={className}
      {...props}
    />
  );
}

// Orders Empty State
export function OrdersEmptyState({
  className,
  onBrowseProducts,
  userRole = 'buyer',
  ...props
}: Omit<EnhancedEmptyStateProps, 'illustration' | 'title' | 'description'> & {
  onBrowseProducts?: () => void;
  userRole?: 'farmer' | 'buyer' | 'supplier';
}) {
  const content = {
    farmer: {
      title: "Awaiting Your First Order",
      description: "Once customers discover your products, orders will appear here. Make sure your products are well-described and competitively priced to attract buyers.",
      actionLabel: "Manage Products",
    },
    buyer: {
      title: "Your Order History is Empty",
      description: "Start exploring fresh produce from local farmers. Place your first order and support Rwanda's agricultural community while getting quality products.",
      actionLabel: "Browse Products",
    },
    supplier: {
      title: "No Orders Yet",
      description: "Farmers will place orders for your supplies here. Ensure your inventory is well-stocked and your products meet farmers' needs.",
      actionLabel: "Manage Inventory",
    },
  };

  const { title, description, actionLabel } = content[userRole];

  return (
    <EnhancedEmptyState
      illustration="orders"
      title={title}
      description={description}
      actions={onBrowseProducts ? [
        {
          label: actionLabel,
          onClick: onBrowseProducts,
          variant: 'primary',
          icon: <ShoppingCart className="w-4 h-4" />,
        },
      ] : []}
      className={className}
      {...props}
    />
  );
}

// Notifications Empty State
export function NotificationsEmptyState({
  className,
  ...props
}: Omit<EnhancedEmptyStateProps, 'illustration' | 'title' | 'description'>) {
  return (
    <EnhancedEmptyState
      illustration="notifications"
      title="All Caught Up!"
      description="You're up to date with all your notifications. We'll let you know when there's something new that needs your attention."
      className={className}
      {...props}
    />
  );
}

// Analytics Empty State
export function AnalyticsEmptyState({
  className,
  onViewProducts,
  ...props
}: Omit<EnhancedEmptyStateProps, 'illustration' | 'title' | 'description'> & {
  onViewProducts?: () => void;
}) {
  return (
    <EnhancedEmptyState
      illustration="analytics"
      title="No Data to Display Yet"
      description="Your analytics will show meaningful insights once you have products and orders. Start by adding products and engaging with customers to generate data."
      actions={onViewProducts ? [
        {
          label: 'View Products',
          onClick: onViewProducts,
          variant: 'primary',
          icon: <BarChart3 className="w-4 h-4" />,
        },
      ] : []}
      className={className}
      {...props}
    />
  );
}

// Export all components
export {
  DashboardIllustration,
  ProductsIllustration,
  SearchIllustration,
  MessagesIllustration,
  OrdersIllustration,
  NotificationsIllustration,
};

// Saved Items Empty State
export function SavedItemsEmptyState({
  className,
  onBrowseProducts,
  ...props
}: Omit<EnhancedEmptyStateProps, 'illustration' | 'title' | 'description'> & {
  onBrowseProducts?: () => void;
}) {
  return (
    <EnhancedEmptyState
      illustration="products"
      title="No Saved Items Yet"
      description="Save products you're interested in to easily find them later. Start exploring and bookmark your favorites!"
      actions={onBrowseProducts ? [
        {
          label: 'Explore Products',
          onClick: onBrowseProducts,
          variant: 'primary',
          icon: <Heart className="w-4 h-4" />,
        },
      ] : []}
      className={className}
      {...props}
    />
  );
}

// Wallet/Transactions Empty State
export function WalletEmptyState({
  className,
  onAddFunds,
  ...props
}: Omit<EnhancedEmptyStateProps, 'illustration' | 'title' | 'description'> & {
  onAddFunds?: () => void;
}) {
  return (
    <EnhancedEmptyState
      illustration="analytics"
      title="No Transactions Yet"
      description="Your transaction history will appear here once you start buying or selling products. Get started with your first transaction!"
      actions={onAddFunds ? [
        {
          label: 'Add Funds',
          onClick: onAddFunds,
          variant: 'primary',
          icon: <DollarSign className="w-4 h-4" />,
        },
      ] : []}
      className={className}
      {...props}
    />
  );
}

// Reviews Empty State
export function ReviewsEmptyState({
  className,
  onWriteReview,
  userRole = 'buyer',
  ...props
}: Omit<EnhancedEmptyStateProps, 'illustration' | 'title' | 'description'> & {
  onWriteReview?: () => void;
  userRole?: 'farmer' | 'buyer' | 'supplier';
}) {
  const content = {
    farmer: {
      title: "No Reviews Yet",
      description: "Customer reviews will appear here once buyers start rating your products. Provide excellent service to earn great reviews!",
      actionLabel: "View Products",
    },
    buyer: {
      title: "Share Your Experience",
      description: "Help other buyers by reviewing products you've purchased. Your feedback helps farmers improve and guides other customers.",
      actionLabel: "Write Review",
    },
    supplier: {
      title: "No Reviews Yet",
      description: "Farmer reviews of your supplies will appear here. Provide quality products and excellent service to earn positive feedback!",
      actionLabel: "View Supplies",
    },
  };

  const { title, description, actionLabel } = content[userRole];

  return (
    <EnhancedEmptyState
      illustration="messages"
      title={title}
      description={description}
      actions={onWriteReview ? [
        {
          label: actionLabel,
          onClick: onWriteReview,
          variant: 'primary',
          icon: <Star className="w-4 h-4" />,
        },
      ] : []}
      className={className}
      {...props}
    />
  );
}

// Calendar/Events Empty State
export function CalendarEmptyState({
  className,
  onCreateEvent,
  ...props
}: Omit<EnhancedEmptyStateProps, 'illustration' | 'title' | 'description'> & {
  onCreateEvent?: () => void;
}) {
  return (
    <EnhancedEmptyState
      illustration="dashboard"
      title="No Events Scheduled"
      description="Keep track of important farming activities, market days, and meetings. Create your first event to get organized!"
      actions={onCreateEvent ? [
        {
          label: 'Create Event',
          onClick: onCreateEvent,
          variant: 'primary',
          icon: <Calendar className="w-4 h-4" />,
        },
      ] : []}
      className={className}
      {...props}
    />
  );
}

// Reports Empty State
export function ReportsEmptyState({
  className,
  onGenerateReport,
  ...props
}: Omit<EnhancedEmptyStateProps, 'illustration' | 'title' | 'description'> & {
  onGenerateReport?: () => void;
}) {
  return (
    <EnhancedEmptyState
      illustration="analytics"
      title="No Reports Generated"
      description="Generate detailed reports about your sales, inventory, and business performance. Get insights to help grow your agricultural business."
      actions={onGenerateReport ? [
        {
          label: 'Generate Report',
          onClick: onGenerateReport,
          variant: 'primary',
          icon: <FileText className="w-4 h-4" />,
        },
      ] : []}
      className={className}
      {...props}
    />
  );
}

// Team/Collaborators Empty State
export function TeamEmptyState({
  className,
  onInviteTeam,
  ...props
}: Omit<EnhancedEmptyStateProps, 'illustration' | 'title' | 'description'> & {
  onInviteTeam?: () => void;
}) {
  return (
    <EnhancedEmptyState
      illustration="messages"
      title="Build Your Team"
      description="Invite family members, workers, or business partners to collaborate on your agricultural operations. Teamwork makes the dream work!"
      actions={onInviteTeam ? [
        {
          label: 'Invite Team Members',
          onClick: onInviteTeam,
          variant: 'primary',
          icon: <Users className="w-4 h-4" />,
        },
      ] : []}
      className={className}
      {...props}
    />
  );
}