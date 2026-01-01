'use client';
import React, { useState } from 'react';
import {
  CheckCircle,
  LayoutGrid,
  FilePlus,
  ShoppingCart,
  User,
  Phone,
  Settings,
  LogOut,
  Mail,
  Heart,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const Logo = () => (
  <div className="flex items-center gap-2 py-2">
    <span className="font-extrabold text-xl tracking-tight">
      <span className="text-white">Umuhinzi</span>
      <span className="text-white">Link</span>
    </span>
  </div>
);

const menuItems = [
  { label: 'Dashboard', href: '/supplier_dashboard', icon: CheckCircle },
  { label: 'My Inputs', href: '/supplier_dashboard/products', icon: LayoutGrid },
  { label: 'Farmer Request', href: '/supplier_dashboard/requests', icon: FilePlus },
  { label: 'Orders', href: '/supplier_dashboard/orders', icon: ShoppingCart },
  { label: 'Message', href: '/supplier_dashboard/message', icon: Mail },
  { label: 'Profile', href: '/supplier_dashboard/profile', icon: User },
  { label: 'Contact', href: '/supplier_dashboard/contact', icon: Phone },
  { label: 'Settings', href: '/supplier_dashboard/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

function ProductsPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  const [inputs, setInputs] = useState([
    {
      id: 1,
      name: 'NPK Fertilizer',
      category: 'Fertilizer',
      price: 25.0,
      originalPrice: 30.0,
      stock: 150,
      status: 'In Stock',
      image: '/npk-fertilizer.png',
    },
    {
      id: 2,
      name: 'NPK Fertilizer',
      category: 'Fertilizer',
      price: 25.0,
      originalPrice: 30.0,
      stock: 120,
      status: 'In Stock',
      image: '/npk-fertilizer.png',
    },
    {
      id: 3,
      name: 'NPK Fertilizer',
      category: 'Fertilizer',
      price: 25.0,
      originalPrice: 30.0,
      stock: 95,
      status: 'In Stock',
      image: '/npk-fertilizer.png',
    },
    {
      id: 4,
      name: 'NPK Fertilizer',
      category: 'Fertilizer',
      price: 25.0,
      originalPrice: 30.0,
      stock: 80,
      status: 'In Stock',
      image: '/npk-fertilizer.png',
    },
    {
      id: 5,
      name: 'NPK Fertilizer',
      category: 'Fertilizer',
      price: 25.0,
      originalPrice: 30.0,
      stock: 75,
      status: 'In Stock',
      image: '/npk-fertilizer.png',
    },
    {
      id: 6,
      name: 'NPK Fertilizer',
      category: 'Fertilizer',
      price: 25.0,
      originalPrice: 30.0,
      stock: 60,
      status: 'In Stock',
      image: '/npk-fertilizer.png',
    },
    {
      id: 7,
      name: 'NPK Fertilizer',
      category: 'Fertilizer',
      price: 25.0,
      originalPrice: 30.0,
      stock: 45,
      status: 'In Stock',
      image: '/npk-fertilizer.png',
    },
    {
      id: 8,
      name: 'NPK Fertilizer',
      category: 'Fertilizer',
      price: 25.0,
      originalPrice: 30.0,
      stock: 30,
      status: 'In Stock',
      image: '/npk-fertilizer.png',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    status: 'In Stock',
    image: null as File | null,
    imagePreview: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      stock: parseInt(formData.stock),
      status: formData.status,
      image: formData.imagePreview || '/placeholder.png',
    };
    setInputs([newItem, ...inputs]);
    setFormData({
      name: '',
      category: '',
      price: '',
      originalPrice: '',
      stock: '',
      status: 'In Stock',
      image: null,
      imagePreview: '',
    });
    setShowForm(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 bg-green-600 flex flex-col fixed left-0 h-screen overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1">
            <Logo />
            {menuItems.map((item, index) => {
              const isActive = item.label === 'My Inputs';
              const Icon = item.icon;
              const showDivider = index === 3 || index === 7;
              return (
                <div key={item.label}>
                  {item.isLogout ? (
                    <div
                      onClick={handleLogout}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm font-medium text-white hover:bg-green-700`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                      <span>{item.label}</span>
                    </div>
                  ) : (
                    <Link href={item.href} className="block">
                      <div
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm font-medium
                          ${isActive
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-white hover:bg-green-700'
                          }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-white'}`} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )}
                  {showDivider && <div className="border-t border-green-500 my-2 mx-3"></div>}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto ml-64 relative">
          {/* Header */}
          <header className="fixed top-0 left-64 z-30 right-0 bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
            {/* Search Section */}
            <div className="w-1/2 relative">
              <Input
                type="text"
                placeholder="Search..."
                className="pl-4 pr-10 h-10 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-3xl"
              />
              <Search
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              {/* Add Product Button */}
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
              >
                + Add New Product
              </button>
            </div>
          </header>

          {/* Content with top margin for fixed header */}
          <div className="mt-16">
            {/* Promotional Banner */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-lg mb-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm opacity-90 mb-1">Tuesday, 16 may 2023</p>
                  <h1 className="text-2xl font-bold mb-2">Enjoy new farm inputs</h1>
                  <h2 className="text-xl font-semibold mb-1">in this season</h2>
                  <p className="text-sm opacity-90">NPK Fertilizer - 25kg (1)</p>
                </div>
                <div className="relative">
                  <Image
                    src="/npk-fertilizer.png"
                    alt="NPK Fertilizer"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="absolute top-4 right-20">
                <button className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="absolute top-4 right-10">
                <button className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors">
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inputs.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={300}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
                      <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                    </div>
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Available
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span className="text-xs text-gray-500">Stock: {item.stock}</span>
                      </div>
                      <button className="w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors cursor-pointer">
                        ♥
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Add New Input</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                required
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Price"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                required
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Original Price"
                step="0.01"
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                required
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                required
                className="border rounded-lg px-3 py-2"
              />
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    setFormData({
                      ...formData,
                      image: file,
                      imagePreview: URL.createObjectURL(file),
                    });
                  }
                }}
                className="border rounded-lg px-3 py-2"
              />
              {formData.imagePreview && (
                <div className="relative w-48 h-36">
                  <Image
                    src={formData.imagePreview}
                    alt="Preview"
                    fill
                    className="rounded-md border object-cover"
                  />
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPageWrapper() {
  return (
      <ProductsPage />

  );
}
