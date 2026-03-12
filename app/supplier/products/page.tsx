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
import { ProductCategory, ProductType, MeasurementUnit, CertificationType } from '@/types';
import { useProduct } from '@/contexts/ProductContext';
import ProductCard from '@/components/products/ProductCard';
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
    router.push(`/supplier/products/edit/${product.id}`);
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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        userType={UserType.SUPPLIER}
        activeItem='My Products'
      />

      <main className="flex-1 overflow-auto bg-background/30 relative">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Input Inventory</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage and update your agricultural supplies for farmers</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/supplier/products/add-input"
                className="flex items-center gap-2 px-5 py-2.5 bg-success text-white rounded-lg font-semibold text-xs uppercase  hover:bg-success/90 transition-all shadow-lg shadow-success/20"
              >
                <Plus className="w-4 h-4" />
                Add New Input
              </Link>
            </div>
          </div>


          {/* Search */}
          <div className="bg-card p-2 rounded-xl border border-border shadow-sm">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search your inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card/50 border border-transparent rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-success"
              />
            </div>
          </div>

          {/* Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-foreground border-l-4 border-success pl-3 uppercase ">Active Listings</h2>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase ">{filteredProducts.length} Results</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="bg-card rounded-xl border border-border p-4 space-y-4 shadow-sm">
                    <Skeleton className="aspect-square rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-8 pb-20">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-full bg-card rounded-2xl border border-border p-16 text-center shadow-sm">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-1">No inputs found</h3>
                    <p className="text-muted-foreground text-sm mb-6">Start by listing your first agricultural input product.</p>
                    <button
                      onClick={() => { resetForm(); setShowForm(true); }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-success text-white rounded-lg font-semibold text-xs uppercase  transition-all"
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
                        product={product}
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
            <div className="bg-card p-8 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {editingProduct ? 'Edit Input' : 'Add New Input'}
                </h2>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <Plus className="w-5 h-5 text-muted-foreground rotate-45" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase  ml-1">Product Details</label>
                  <select
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
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
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
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
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase  ml-1">Price (RWF)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.unitPrice}
                      onChange={e => setFormData({ ...formData, unitPrice: e.target.value })}
                      required
                      className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase  ml-1">Measurement</label>
                    <select
                      value={formData.measurementUnit}
                      onChange={e => setFormData({ ...formData, measurementUnit: e.target.value })}
                      required
                      className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
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
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase  ml-1">Stock Quantity</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                      required
                      className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase  ml-1">Certification</label>
                    <select
                      value={formData.certification}
                      onChange={e => setFormData({ ...formData, certification: e.target.value })}
                      required
                      className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
                    >
                      <option value="">None</option>
                      {Object.values(CertificationType).map(cert => (
                        <option key={cert} value={cert}>{cert}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase  ml-1">Product Media</label>
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
                    className="flex-1 px-6 py-3 rounded-lg border border-border font-semibold text-xs uppercase  text-muted-foreground hover:bg-card transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={supplierActions.loading}
                    className="flex-1 px-6 py-3 rounded-lg bg-success text-white font-semibold text-xs uppercase  hover:bg-success/90 disabled:opacity-50 transition-all shadow-lg shadow-success/20"
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
