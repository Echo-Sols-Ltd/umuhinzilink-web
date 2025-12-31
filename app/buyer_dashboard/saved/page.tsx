'use client';

import { useState } from 'react';
import {
  FilePlus,
  MessageSquare,
  Mail,
  User as UserIcon,
  Phone,
  Settings,
  LogOut,
  Heart,
  Trash2,
  CheckCircle,
  LayoutGrid as GridIcon,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { getAuthToken, logout } from '@/lib/auth';

const menuItems = [
  { label: 'Dashboard', href: '/buyer_dashboard', icon: CheckCircle },
  { label: 'My Purchase', href: '/buyer_dashboard/purchases', icon: GridIcon },
  { label: 'Browse product', href: '/buyer_dashboard/product', icon: FilePlus },
  { label: 'Saved items', href: '/buyer_dashboard/saved', icon: MessageSquare },
  { label: 'Message', href: '/buyer_dashboard/message', icon: Mail },
  { label: 'Profile', href: '/buyer_dashboard/profile', icon: UserIcon },
  { label: 'Contact', href: '/buyer_dashboard/contact', icon: Phone },
  { label: 'Settings', href: '/buyer_dashboard/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

const products = [
  {
    name: 'Fresh Tomatoes',
    price: '$3.50/kg',
    available: '250 kg',
    farmer: 'John Mutesi',
    location: 'Kigali',
    image: '/tomatoes.png',
  },
  {
    name: 'Organic Carrots',
    price: '$2.80/kg',
    available: '180 kg',
    farmer: 'Marie Uwimana',
    location: 'Musanze',
    image: '/carrots.png',
  },
  {
    name: 'Fresh Spinach',
    price: '$4.20/kg',
    available: '95 kg',
    farmer: 'David Nkurunziza',
    location: 'Huye',
    image: '/spinach.png',
  },
  {
    name: 'Sweet Bananas',
    price: '$1.90/kg',
    available: '320 kg',
    farmer: 'Grace Mukamana',
    location: 'Rubavu',
    image: '/banana.png',
  },
  {
    name: 'Irish Potatoes',
    price: '$1.50/kg',
    available: '500 kg',
    farmer: 'Paul Habimana',
    location: 'Nyabihu',
    image: '/potatoes.png',
  },
  {
    name: 'Premium Avocados',
    price: '$5.80/kg',
    available: '75 kg',
    farmer: 'Alice Nyiramana',
    location: 'Karongi',
    image: '/avocados.png',
  },
];

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

export default function SavedItems() {
  const [activeTab, setActiveTab] = useState<'all' | 'expected' | 'available'>('all');
  const [sortBy, setSortBy] = useState('Newest');
  const [logoutPending, setLogoutPending] = useState(false);
  const router = useRouter();

  const filteredProducts = products
    .map(p => ({
      ...p,
      isAvailable: true, // Adding missing property
    }))
    .filter(product => {
      if (activeTab === 'available') return product.isAvailable;
      if (activeTab === 'expected') return !product.isAvailable;
      return true;
    });

  const handleLogout = async () => {
  
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Global Header */}
      <header className="sticky top-0 z-30 bg-white border-b h-16 flex items-center px-8 shadow-sm">
        <Logo />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r h-full flex flex-col">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item, index) => {
              const isActive = item.label === 'Saved items';
              const Icon = item.icon;
              const showDivider = index === 3 || index === 8;
              return (
                <div key={item.label}>
                  {item.isLogout ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={logoutPending}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                        logoutPending
                          ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {logoutPending ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      ) : (
                        <Icon className="w-5 h-5 text-gray-500" />
                      )}
                      <span>{logoutPending ? 'Logging out...' : item.label}</span>
                    </button>
                  ) : (
                    <Link href={item.href} className="block">
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium
                        ${
                          isActive
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )}
                  {showDivider && <div className="border-t border-gray-200 my-2 mx-4"></div>}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Sort Bar */}
          <div className="bg-white border-b px-6 py-4 flex justify-end items-center">
            <label className="text-sm text-gray-500 mr-2">Sort by:</label>
            <select
              className="border border-gray-300 rounded-lg py-2 px-3 text-sm"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {/* Products Grid */}
          <main className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(p => (
                <div key={p.name} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="relative">
                    <img src={p.image} alt={p.name} className="h-48 w-full object-cover" />
                    <button className="absolute top-3 right-3 bg-white p-1 rounded-full shadow">
                      <Heart className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg text-gray-900">{p.name}</h3>
                      <p className="text-green-600 font-bold text-sm">{p.price}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Available: {p.available}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <UserIcon className="w-4 h-4 mr-1" /> {p.farmer}
                      <span className="mx-1">•</span>
                      {p.location}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 flex items-center gap-2">
                      <button className="bg-green-600 text-white px-4 py-2 rounded text-sm flex-1">
                        Buy Now
                      </button>
                      <button className="border border-gray-300 p-2 rounded">
                        <MessageSquare className="w-4 h-4 text-black" />
                      </button>
                      <button className="border border-red-300 p-2 rounded">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
