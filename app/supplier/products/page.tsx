'use client';
import React, { useState, useMemo, useEffect } from 'react';
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
  Plus,
  RefreshCw,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import FileUpload from '@/components/ui/file-upload';
import { useAuth } from '@/contexts/AuthContext';
import { useSupplier } from '@/contexts/SupplierContext';
import { useSupplierAction } from '@/hooks/useSupplierAction';
import Sidebar from '@/components/shared/Sidebar';
import { SupplierPages, UserType } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import { ProductCategory, ProductType, MeasurementUnit, CertificationType } from '@/types/enums';
import { useProduct } from '@/contexts/ProductContext';
import ProductCard from '@/components/products/Product';
import { Pagination } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 12;

function ProductsPageComponent() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { logout } = useAuth();
  const { loading } = useSupplier();
  const supplierActions = useSupplierAction();
  const {
    supplierProducts,
    fetchSupplierProducts,
    supplierProductsTotalPages: totalPages,
    supplierProductsTotalElements: totalElements,
  } = useProduct();

  const filteredProducts = useMemo(() => {
    const list = supplierProducts || [];
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term)
    );
  }, [supplierProducts, searchTerm]);

  useEffect(() => {
    fetchSupplierProducts(currentPage - 1, ITEMS_PER_PAGE);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  const handleLogout = () => {
    logout();
  };

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    unitPrice: '',
    measurementUnit: '',
    quantity: '',
    location: '',
    isNegotiable: false,
    certification: '',
    imageUrl: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      unitPrice: '',
      measurementUnit: '',
      quantity: '',
      location: '',
      isNegotiable: false,
      certification: '',
      imageUrl: '',
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      unitPrice: parseFloat(formData.unitPrice),
      measurementUnit: formData.measurementUnit,
      quantity: parseInt(formData.quantity),
      location: formData.location,
      isNegotiable: formData.isNegotiable,
      certification: formData.certification,
      image: formData.imageUrl || '/placeholder.png',
      harvestDate: new Date().toISOString(),
    };

    try {
      if (editingProduct) {
        await supplierActions.updateProduct(editingProduct.id, productData);
      } else {
        await supplierActions.createProduct(productData);
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      unitPrice: product.unitPrice.toString(),
      measurementUnit: product.measurementUnit,
      quantity: product.quantity.toString(),
      location: product.location,
      isNegotiable: product.isNegotiable,
      certification: product.certification,
      imageUrl: product.image || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const success = await supplierActions.deleteProduct(productId);
      if (success) {
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData({
        ...formData,
        imageUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData({
      ...formData,
      imageUrl: url,
    });
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        userType={UserType.SUPPLIER}
        activeItem='My Inputs'
      />

      <main className="flex-1 overflow-auto bg-gray-50/30 relative">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Input Inventory</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and update your agricultural supplies for farmers</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-green-700 transition-all shadow-lg shadow-green-100"
              >
                <Plus className="w-4 h-4" />
                Add New Input
              </button>
            </div>
          </div>

          {/* Banner */}
          <div className="bg-green-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-green-100/50">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-widest">Supplier Portal</span>
                <span className="text-xs font-medium text-green-100">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Expand your reach to thousands of farmers.</h2>
              <p className="text-green-50 text-sm mb-6 max-w-lg leading-relaxed font-medium">
                Keep your inventory updated to help farmers find the best seeds, fertilizers, and tools for their season.
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-2xl font-bold">{supplierProducts?.length || 0}</p>
                  <p className="text-[10px] font-bold text-green-200 uppercase tracking-wider mt-1">Total Items</p>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div>
                  <p className="text-2xl font-bold text-white">Rwanda</p>
                  <p className="text-[10px] font-bold text-green-200 uppercase tracking-wider mt-1">Market Reach</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-400/20 rounded-full blur-2xl translate-y-1/2"></div>
          </div>

          {/* Search */}
          <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-transparent rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-900 border-l-4 border-green-500 pl-3 uppercase tracking-widest">Active Listings</h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{filteredProducts.length} Results</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 space-y-4 shadow-sm">
                    <Skeleton className="aspect-square rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-full bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No inputs found</h3>
                    <p className="text-gray-500 text-sm mb-6">Start by listing your first agricultural input product.</p>
                    <button
                      onClick={() => { resetForm(); setShowForm(true); }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Input
                    </button>
                  </div>
                ) : (
                  <>
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={{ ...product }}
                        onEdit={handleEdit}
                      />
                    ))}
                    {totalPages > 1 && (
                      <div className="col-span-full mt-6">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                          disabled={loading}
                          showSummary
                          totalItems={totalElements}
                          itemsPerPage={ITEMS_PER_PAGE}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Input' : 'Add New Input'}
                </h2>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Plus className="w-5 h-5 text-gray-400 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Product Details</label>
                  <select
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  >
                    <option value="">Select Product Type</option>
                    {Object.values(ProductType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {Object.values(ProductCategory).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <textarea
                    placeholder="Describe your input product..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Price (RWF)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.unitPrice}
                      onChange={e => setFormData({ ...formData, unitPrice: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Measurement</label>
                    <select
                      value={formData.measurementUnit}
                      onChange={e => setFormData({ ...formData, measurementUnit: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm"
                    >
                      <option value="">Unit</option>
                      {Object.values(MeasurementUnit).map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Stock Quantity</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Certification</label>
                    <select
                      value={formData.certification}
                      onChange={e => setFormData({ ...formData, certification: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm"
                    >
                      <option value="">None</option>
                      {Object.values(CertificationType).map(cert => (
                        <option key={cert} value={cert}>{cert}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Product Media</label>
                  <FileUpload
                    onUploadComplete={handleImageUpload}
                    uploadType="generic"
                    accept="image/*"
                    showPreview={true}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); resetForm(); }}
                    className="flex-1 px-6 py-3 rounded-lg border border-gray-100 font-bold text-xs uppercase tracking-wider text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={supplierActions.loading}
                    className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-green-700 disabled:opacity-50 transition-all shadow-lg shadow-green-100"
                  >
                    {supplierActions.loading ? 'Processing...' : (editingProduct ? 'Update Listing' : 'List Input')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsPageWrapper() {
  return (
    <SupplierGuard>
      <ProductsPageComponent />
    </SupplierGuard>
  );
}
