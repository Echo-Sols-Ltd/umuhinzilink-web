'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { useProduct } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { CertificationType, FarmerProductRequest, MeasurementUnit, RwandaCrop, RwandaCropCategory } from '@/types';
import useProductAction from '@/hooks/useProductAction';

export default function AddProduce() {
  const router = useRouter();
  const { user } = useAuth();
  const { createFarmerProduct, loading } = useProductAction();
  const [formData, setFormData] = useState<FarmerProductRequest>({
    name: RwandaCrop.AVOCADO,
    quantity: 0,
    unitPrice: 0,
    measurementUnit: MeasurementUnit.KG,
    location: '',
    harvestDate: new Date(),
    category: RwandaCropCategory.FRUITS,
    description: '',
    isNegotiable: false,
    image: '',
    certification: CertificationType.NONE,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Handle text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isNegotiable: e.target.checked }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in again to add produce.',
        variant: 'destructive',
      });
      router.push('/auth/signin');
      return;
    }

    if (!formData.name.trim()) {
      toast({ title: 'Missing name', description: 'Provide a product name.' });
      return;
    }

    setSubmitting(true);

    try {
      // Create product object for context
      const productData: FarmerProductRequest = {
        name: formData.name.trim() as RwandaCrop,
        description: formData.description || '',
        unitPrice: Number(formData.unitPrice) || 0,
        image: previewUrl || '',
        quantity: Number(formData.quantity) || 0,
        measurementUnit: formData.measurementUnit || 'UNIT',
        category: formData.category || 'OTHER',
        harvestDate: new Date(formData.harvestDate || Date.now()),
        location: formData.location,
        isNegotiable: formData.isNegotiable,
        certification: 'NONE' as any,
      };

      await createFarmerProduct(productData);

      toast({
        title: 'Produce Added',
        description: 'Your product has been added to your inventory.',
      });

      router.push('/farmer/products');
    } catch (error) {
      console.error('Error adding produce:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Unable to add produce',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl py-10 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Produce</h1>
            <p className="text-sm text-gray-500 mt-1">
              List freshly harvested produce to make it available for buyers.
            </p>
          </div>
          <Link
            href="/farmer/products"
            className="text-sm text-green-600 hover:text-green-700"
          >
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <form
            onSubmit={handleSubmit}
            className="xl:col-span-2 bg-white rounded-lg shadow-sm border p-6 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Premium Maize"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. CEREALS"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  min="0"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Measurement Unit</label>
                <input
                  type="text"
                  name="measurementUnit"
                  value={formData.measurementUnit}
                  onChange={handleChange}
                  placeholder="e.g. KG"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Price (RWF)</label>
                <input
                  type="number"
                  min="0"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  placeholder="e.g. 1200"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kigali, Gasabo"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Harvest Date</label>
                <input
                  type="date"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isNegotiable}
                  onChange={handleToggle}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                Negotiable price
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Add details buyers should know about this produce."
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 w-full text-sm text-gray-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Link
                href="/farmer/products"
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Produce
              </button>
            </div>
          </form>

          <aside className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
            <p className="text-sm text-gray-500">
              This is how your product will appear to buyers once published.
            </p>
            <div className="border border-dashed border-gray-200 rounded-lg p-4 text-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              ) : (
                <div className="text-sm text-gray-400">Upload an image to preview it here.</div>
              )}
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Product</span>
                <span className="font-medium text-gray-900">{formData.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span>Unit price</span>
                <span className="font-medium text-gray-900">
                  {formData.unitPrice ? `RWF ${formData.unitPrice}` : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Quantity</span>
                <span className="font-medium text-gray-900">
                  {formData.quantity
                    ? `${formData.quantity} ${formData.measurementUnit || ''}`
                    : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Negotiable</span>
                <span className="font-medium text-gray-900">
                  {formData.isNegotiable ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Location</span>
                <span className="font-medium text-gray-900">{formData.location || '—'}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
