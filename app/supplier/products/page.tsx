'use client';
import React, { useState, useEffect } from 'react';
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
  Edit,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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

function ProductsPageComponent() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { logout } = useAuth();
  const { products, refreshProducts, loading } = useSupplier();
  const supplierActions = useSupplierAction();

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
      refreshProducts();
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
        refreshProducts();
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
    <div className="flex h-screen bg-gray-50 overflow-hidden ">
        <Sidebar
          userType={UserType.SUPPLIER}
          activeItem='My Inputs'
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto  relative">
          {/* Header */}
          <header className="fixed top-0 left-64 z-30 right-0 bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
            {/* Search Section */}
            <div className="w-1/2 relative">
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-4 pr-10 h-10 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-3xl"
              />
              <Search
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
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
                  <p className="text-sm opacity-90 mb-1">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <h1 className="text-2xl font-bold mb-2">Manage your agricultural inputs</h1>
                  <h2 className="text-xl font-semibold mb-1">Connect with farmers across Rwanda</h2>
                  <p className="text-sm opacity-90">Total Products: {products.length}</p>
                </div>
                <div className="relative">
                  <Image
                    src="/npk-fertilizer.png"
                    alt="Agricultural Inputs"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No products found</p>
                    <p className="text-gray-400 text-sm mt-2">Add your first product to get started</p>
                  </div>
                ) : (
                  products.map(product => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                          <Image
                            src={product.image || '/placeholder.png'}
                            alt={product.name}
                            width={300}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                          {product.productStatus || 'Available'}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-gray-900">
                            ${product.unitPrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            per {product.measurementUnit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-500">Stock: {product.quantity}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>

      {/* Modal for Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <select
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                className="border rounded-lg px-3 py-2"
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
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Select Category</option>
                {Object.values(ProductCategory).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <textarea
                placeholder="Product Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
                className="border rounded-lg px-3 py-2 min-h-[80px]"
              />

              <input
                type="number"
                placeholder="Unit Price"
                step="0.01"
                value={formData.unitPrice}
                onChange={e => setFormData({ ...formData, unitPrice: e.target.value })}
                required
                className="border rounded-lg px-3 py-2"
              />

              <select
                value={formData.measurementUnit}
                onChange={e => setFormData({ ...formData, measurementUnit: e.target.value })}
                required
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Select Unit</option>
                {Object.values(MeasurementUnit).map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                required
                className="border rounded-lg px-3 py-2"
              />

              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                required
                className="border rounded-lg px-3 py-2"
              />

              <select
                value={formData.certification}
                onChange={e => setFormData({ ...formData, certification: e.target.value })}
                required
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Select Certification</option>
                {Object.values(CertificationType).map(cert => (
                  <option key={cert} value={cert}>{cert}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={formData.isNegotiable}
                  onChange={e => setFormData({ ...formData, isNegotiable: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="negotiable" className="text-sm">Price is negotiable</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <FileUpload
                  onUploadComplete={handleImageUpload}
                  uploadType="generic"
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                  allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
                  allowedExtensions={['.jpg', '.jpeg', '.png', '.gif', '.webp']}
                  showPreview={true}
                  resizeImage={true}
                  maxWidth={800}
                  maxHeight={600}
                  className="w-full"
                />
              </div>

              {formData.imageUrl && (
                <div className="relative w-48 h-36">
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    fill
                    className="rounded-md border object-cover"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={supplierActions.loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {supplierActions.loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Save Product')}
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
    <SupplierGuard>
      <ProductsPageComponent />
    </SupplierGuard>
  );
}
