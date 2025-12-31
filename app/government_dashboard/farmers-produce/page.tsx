'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutGrid,
  BarChart2,
  Bell,
  LogOut,
  User as UserIcon,
  Settings,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Tractor,
  DollarSign,
  Loader2,
  Star,
  Package,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GovernmentGuard } from '@/components/auth/AuthGuard';
import { toast } from '@/components/ui/use-toast';
import { getAuthToken, logout } from '@/lib/auth';

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isLogout?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/government_dashboard', icon: LayoutGrid },
  { label: 'Farmers Produce', href: '/government_dashboard/farmers-produce', icon: Tractor },
  { label: 'Suppliers Produce', href: '/government_dashboard/suppliers-produce', icon: Package },
  { label: 'Market analytics', href: '/government_dashboard/market-analytics', icon: BarChart2 },
  { label: 'Notifications', href: '/government_dashboard/notifications', icon: Bell },
  { label: 'Profile', href: '/government_dashboard/profile', icon: UserIcon },
  { label: 'Settings', href: '/government_dashboard/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

// Banner data
const bannerData = [
  {
    title: 'Enjoy new produce In this summer',
    subtitle: 'Tomatoes - 2.345/kg',
    image: '/api/placeholder/600/300',
  },
  {
    title: 'Fresh vegetables available',
    subtitle: 'Potatoes - 1.500/kg',
    image: '/api/placeholder/600/300',
  },
  {
    title: 'Organic produce collection',
    subtitle: 'Cabbage - 1.200/kg',
    image: '/api/placeholder/600/300',
  },
];

// Product data
const products = [
  {
    id: '1',
    name: 'Fresh lemon',
    price: 120.0,
    rating: 4,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '2',
    name: 'Fresh Tomotoes',
    price: 120.0,
    rating: 4,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '3',
    name: 'Fresh Tomotoes',
    price: 120.0,
    rating: 5,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '4',
    name: 'Fresh Tomotoes',
    price: 120.0,
    rating: 4,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '5',
    name: 'Fresh Tomotoes',
    price: 120.0,
    rating: 3,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '6',
    name: 'Fresh Bell Peppers',
    price: 150.0,
    rating: 5,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '7',
    name: 'Fresh Corn',
    price: 100.0,
    rating: 4,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '8',
    name: 'Fresh Potatoes',
    price: 80.0,
    rating: 4,
    image: '/api/placeholder/300/300',
    status: 'done',
  },
  {
    id: '9',
    name: 'Fresh Cabbage',
    price: 90.0,
    rating: 5,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '10',
    name: 'Fresh Carrots',
    price: 110.0,
    rating: 4,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '11',
    name: 'Fresh Onions',
    price: 95.0,
    rating: 4,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '12',
    name: 'Fresh Beans',
    price: 130.0,
    rating: 5,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '13',
    name: 'Fresh Peas',
    price: 105.0,
    rating: 4,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '14',
    name: 'Fresh Spinach',
    price: 85.0,
    rating: 4,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '15',
    name: 'Fresh Lettuce',
    price: 75.0,
    rating: 3,
    image: '/api/placeholder/300/300',
    status: 'done',
  },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

function formatDate() {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

function FarmersProducePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout: authLogout } = useAuth();
  const [logoutPending, setLogoutPending] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [productImageIndices, setProductImageIndices] = useState<Record<string, number>>({});

  const handleLogout = async () => {
    if (logoutPending) return;

 
  };

  const shortName = useMemo(() => {
    if (!user?.names) return 'Admin';
    const parts = user.names.trim().split(/\s+/);
    return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : parts[0];
  }, [user?.names]);

  const initials = useMemo(() => getInitials(user?.names || 'Admin'), [user?.names]);

  const handleBannerPrev = () => {
    setCurrentBannerIndex(prev => (prev === 0 ? bannerData.length - 1 : prev - 1));
  };

  const handleBannerNext = () => {
    setCurrentBannerIndex(prev => (prev === bannerData.length - 1 ? 0 : prev + 1));
  };

  const handleProductImagePrev = (productId: string) => {
    setProductImageIndices(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) === 0 ? 2 : (prev[productId] || 0) - 1,
    }));
  };

  const handleProductImageNext = (productId: string) => {
    setProductImageIndices(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) === 2 ? 0 : (prev[productId] || 0) + 1,
    }));
  };

  const handleGetPrice = (productId: string) => {
    toast({
      title: 'Price Request',
      description: 'Price information has been requested for this product.',
    });
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  const currentBanner = bannerData[currentBannerIndex];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside
          className="w-64 bg-[#00A63E] border-r flex flex-col fixed left-0 top-0 h-screen overflow-y-auto"
          aria-label="Sidebar"
        >
          <div className="flex items-center px-6 py-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-bold text-xl text-white">FarmLink</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {MENU_ITEMS.map((item, index) => {
              const isActive = item.href === '/government_dashboard/farmers-produce';
              const Icon = item.icon;
              const showDivider = index === 4;

              return (
                <div key={item.label}>
                  {item.isLogout ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={logoutPending}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium text-white ${
                        logoutPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                      }`}
                    >
                      {logoutPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-white" />
                          <span>Logging out...</span>
                        </>
                      ) : (
                        <>
                          <Icon className="w-5 h-5 text-white" />
                          <span>{item.label}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link href={item.href} className="block">
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium ${
                          isActive
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-white hover:bg-green-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-white'}`} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )}
                  {showDivider && <div className="border-t border-gray-200 my-2 mx-4" />}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto ml-64 relative bg-white">
          <header className="fixed top-0 left-64 right-0 z-30 bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  className="pl-10 pr-4 py-2 w-80 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Search here ..."
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">{formatDate()}</div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span role="img" aria-label="UK flag">
                  🇬🇧
                </span>
                <span>English</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{initials || 'A'}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{shortName}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </header>

          <div className="p-6 mt-16 space-y-6">
            {/* Banner Section */}
            <div className="relative bg-gradient-to-r from-green-700 to-green-500 rounded-xl p-8 text-white overflow-hidden">
              <button
                onClick={handleBannerPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleBannerNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="Next banner"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{currentBanner.title}</h2>
                  <p className="text-lg opacity-90">{currentBanner.subtitle}</p>
                </div>
                <div className="w-64 h-48 bg-white/10 rounded-lg flex items-center justify-center">
                  <img
                    src={currentBanner.image}
                    alt="Banner"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map(product => {
                const imageIndex = productImageIndices[product.id] || 0;
                const isDone = product.status === 'done';

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Product Image with Navigation */}
                    <div className="relative w-full h-48 bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleProductImagePrev(product.id)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleProductImageNext(product.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < product.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => (isDone ? undefined : handleGetPrice(product.id))}
                        className={`w-full ${
                          isDone
                            ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                        disabled={isDone}
                      >
                        {isDone ? 'Done' : 'Get Price'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function GovernmentFarmersProducePage() {
  return (
    <GovernmentGuard>
      <FarmersProducePage />
    </GovernmentGuard>
  );
}

