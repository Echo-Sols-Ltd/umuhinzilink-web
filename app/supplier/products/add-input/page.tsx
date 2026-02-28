'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notify } from '@/lib/notify';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { CertificationType, MeasurementUnit, ProductCategory, UserType } from '@/types';
import { useSupplierAction } from '@/hooks/useSupplierAction';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Sidebar from '@/components/shared/Sidebar';

function AddInput() {
  const router = useRouter();
  const { user } = useAuth();
  const supplierActions = useSupplierAction();
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    unitPrice: 0,
    measurementUnit: MeasurementUnit.KG,
    location: '',
    category: ProductCategory.SEEDS,
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

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
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
      notify.error('Please sign in again to add input.', 'Authentication Required');
      router.push('/auth/signin');
      return;
    }

    if (!formData.name.trim()) {
      notify.error('Provide an input name.', 'Missing name');
      return;
    }

    if (!imageFile) {
      notify.error('Provide an input photo.', 'Missing input photo');
      return;
    }

    setSubmitting(true);

    try {
      // Create product object for supplier
      const productData = {
        name: formData.name.trim(),
        description: formData.description || '',
        unitPrice: Number(formData.unitPrice) || 0,
        image: previewUrl || '',
        quantity: Number(formData.quantity) || 0,
        measurementUnit: formData.measurementUnit as MeasurementUnit,
        category: formData.category as ProductCategory,
        location: formData.location,
        isNegotiable: formData.isNegotiable,
        certification: formData.certification as CertificationType,
        harvestDate: new Date().toISOString(),
      };

      await supplierActions.createProduct(productData);

      notify.success('Input added successfully!', 'Success');

      router.push('/supplier/products');
    } catch (error) {
      console.error('Error adding input:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      notify.error(message, 'Unable to add input');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='flex h-screen bg-background overflow-hidden'>
      <Sidebar
        userType={UserType.SUPPLIER}
        activeItem='My Inputs'
      />
      <div className="h-screen bg-background">

        <div className="mx-auto max-w-5xl py-10 px-4 h-full overflow-auto">
          <div className="mb-6 flex items-center justify-between ">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">Add New Input</h1>
              <p className="text-sm text-muted-foreground mt-1">
                List agricultural inputs to make them available for farmers.
              </p>
            </div>
            <Link
              href="/supplier/products"
              className="text-sm text-success hover:text-success/80"
            >
              Back to Inputs
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <form
              onSubmit={handleSubmit}
              className="xl:col-span-2 bg-card rounded-lg shadow-sm border p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Input Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Organic Fertilizer"
                    required
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:ring-success focus:border-success"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Category</label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ProductCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                    required
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:ring-success focus:border-success"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Measurement Unit</label>
                  <Select value={formData.measurementUnit} onValueChange={(value) => handleSelectChange('measurementUnit', value)}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(MeasurementUnit).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Unit Price (RWF)</label>
                  <input
                    type="number"
                    min="0"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    placeholder="e.g. 1200"
                    required
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:ring-success focus:border-success"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Kigali, Gasabo"
                    required
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:ring-success focus:border-success"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Certification</label>
                  <Select value={formData.certification} onValueChange={(value) => handleSelectChange('certification', value)}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select certification" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CertificationType).map((cert) => (
                        <SelectItem key={cert} value={cert}>
                          {cert.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={formData.isNegotiable}
                    onChange={handleToggle}
                    className="rounded border-border text-success focus:ring-success"
                  />
                  Negotiable price
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Add details farmers should know about this input."
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:ring-success focus:border-success"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 w-full text-sm text-muted-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Link
                  href="/supplier/products"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-success hover:bg-success/90 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Input
                </button>
              </div>
            </form>

            <aside className="bg-card rounded-lg shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Preview</h2>
              <p className="text-sm text-muted-foreground">
                This is how your input will appear to farmers once published.
              </p>
              <div className="border border-dashed border-border rounded-lg p-4 text-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">Upload an image to preview it here.</div>
                )}
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Input</span>
                  <span className="font-medium text-foreground">{formData.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unit price</span>
                  <span className="font-medium text-foreground">
                    {formData.unitPrice ? `RWF ${formData.unitPrice}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span className="font-medium text-foreground">
                    {formData.quantity
                      ? `${formData.quantity} ${formData.measurementUnit || ''}`
                      : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Negotiable</span>
                  <span className="font-medium text-foreground">
                    {formData.isNegotiable ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="font-medium text-foreground">{formData.location || '—'}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddInputPage() {
  return (
    <SupplierGuard>
      <AddInput />
    </SupplierGuard>
  );
}
