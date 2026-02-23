'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';
import { ProductCategory, ProductType, MeasurementUnit, CertificationType, UserType } from '@/types/enums';
import { useSupplierAction } from '@/hooks/useSupplierAction';
import { useProduct } from '@/contexts/ProductContext';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import Sidebar from '@/components/shared/Sidebar';
import FileUpload from '@/components/ui/file-upload';

function EditInput() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const supplierActions = useSupplierAction();
  const { supplierProducts } = useProduct();
  const inputId = params.id as string;

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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load input data
  useEffect(() => {
    if (inputId && supplierProducts) {
      const input = supplierProducts.find(p => p.id === inputId);
      if (input) {
        setFormData({
          name: input.name || '',
          category: input.category || '',
          description: input.description || '',
          unitPrice: input.unitPrice?.toString() || '',
          measurementUnit: input.measurementUnit || '',
          quantity: input.quantity?.toString() || '',
          location: input.location || '',
          isNegotiable: input.isNegotiable || false,
          certification: input.certification || '',
          imageUrl: input.image || '',
        });
        setLoading(false);
      } else {
        toast({
          title: 'Error',
          description: 'Input not found',
          variant: 'error',
        });
        router.push('/supplier/products');
      }
    }
  }, [inputId, supplierProducts, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isNegotiable: e.target.checked }));
  };

  const handleImageUpload = (url: string) => {
    setFormData({
      ...formData,
      imageUrl: url,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in again to edit input.',
        variant: 'error',
      });
      router.push('/auth/signin');
      return;
    }

    setSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        unitPrice: parseFloat(formData.unitPrice) || 0,
        measurementUnit: formData.measurementUnit,
        quantity: parseInt(formData.quantity) || 0,
        location: formData.location,
        isNegotiable: formData.isNegotiable,
        certification: formData.certification,
        image: formData.imageUrl || '/placeholder.png',
        harvestDate: new Date().toISOString(),
      };

      await supplierActions.updateProduct(inputId, productData);
      
      toast({
        title: 'Success',
        description: 'Input updated successfully!',
        variant: 'success',
      });
      
      router.push('/supplier/products');
    } catch (error) {
      console.error('Error updating input:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Unable to update input',
        description: message,
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-white overflow-hidden">
        <Sidebar userType={UserType.SUPPLIER} activeItem="My Inputs" />
        <main className="flex-1 overflow-auto bg-gray-50/30">
          <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="font-bold text-gray-400 text-xs uppercase tracking-widest">Loading input details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar userType={UserType.SUPPLIER} activeItem="My Inputs" />

      <main className="flex-1 overflow-auto bg-gray-50/30">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/supplier/products"
                className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Input</h1>
                <p className="text-sm text-gray-500 mt-1">Update your agricultural input details</p>
              </div>
            </div>
          </div>

          {/* Modal-style Form Container */}
          <div className="flex items-center justify-center ">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full ">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Input</h2>
                <Link 
                  href="/supplier/products" 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Plus className="w-5 h-5 text-gray-400 rotate-45" />
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Product Details</label>
                  <select
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  >
                    <option value="">Select Product Type</option>
                    {Object.values(ProductType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {Object.values(ProductCategory).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <textarea
                    name="description"
                    placeholder="Describe your input product..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Price (RWF)</label>
                    <input
                      type="number"
                      name="unitPrice"
                      placeholder="0.00"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Measurement</label>
                    <select
                      name="measurementUnit"
                      value={formData.measurementUnit}
                      onChange={handleChange}
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
                      name="quantity"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Certification</label>
                    <select
                      name="certification"
                      value={formData.certification}
                      onChange={handleChange}
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
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Kigali, Gasabo"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="isNegotiable"
                      checked={formData.isNegotiable}
                      onChange={handleToggle}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    Negotiable price
                  </label>
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
                  <Link
                    href="/supplier/products"
                    className="flex-1 px-6 py-3 rounded-lg border border-gray-100 font-bold text-xs uppercase tracking-wider text-gray-500 hover:bg-gray-50 transition-all text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-green-700 disabled:opacity-50 transition-all shadow-lg shadow-green-100"
                  >
                    {submitting ? 'Processing...' : 'Update Listing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function EditInputPage() {
  return (
    <SupplierGuard>
      <EditInput />
    </SupplierGuard>
  );
}
