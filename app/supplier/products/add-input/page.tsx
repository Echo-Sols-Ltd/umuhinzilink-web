'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notify } from '@/lib/notify';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Loader2, ArrowLeft, Package, DollarSign, MapPin, ImageIcon, Eye, Info, Upload, Check, Truck } from 'lucide-react';
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
    category: ProductCategory.SEEDS_SEEDLINGS,
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
      
      <main className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-6 w-px bg-border"></div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Add New Input</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  List agricultural inputs to make them available for farmers
                </p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2 h-screen overflow-auto pb-40">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
                        <p className="text-sm text-muted-foreground">Essential details about your agricultural input</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Input Name <span className="text-destructive">*</span>
                        </label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Organic Fertilizer"
                          required
                          className="w-full px-4 py-3 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Category <span className="text-destructive">*</span>
                        </label>
                        <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                          <SelectTrigger className="w-full px-4 py-3 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-colors">
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
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Description <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        placeholder="Add details farmers should know about this input. Include composition, usage instructions, benefits, etc."
                        className="w-full px-4 py-3 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Pricing & Quantity */}
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-info" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">Pricing & Quantity</h2>
                        <p className="text-sm text-muted-foreground">Set your price and available quantity</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Quantity <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="e.g., 1000"
                          required
                          className="w-full px-4 py-3 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Measurement Unit <span className="text-destructive">*</span>
                        </label>
                        <Select value={formData.measurementUnit} onValueChange={(value) => handleSelectChange('measurementUnit', value)}>
                          <SelectTrigger className="w-full px-4 py-3 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-colors">
                            <SelectValue placeholder="Select unit" />
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
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Unit Price (RWF) <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          name="unitPrice"
                          value={formData.unitPrice}
                          onChange={handleChange}
                          placeholder="e.g., 5000"
                          required
                          className="w-full px-4 py-3 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-colors"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isNegotiable}
                          onChange={handleToggle}
                          className="w-4 h-4 text-success focus:ring-success border-border rounded"
                        />
                        <div>
                          <span className="text-sm font-medium text-foreground">Price is negotiable</span>
                          <p className="text-xs text-muted-foreground">Allow farmers to negotiate the price</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Location & Availability */}
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">Location & Availability</h2>
                        <p className="text-sm text-muted-foreground">Where your input is available for delivery</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Location <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g., Kigali, Rwanda"
                          required
                          className="w-full px-4 py-3 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Certification
                        </label>
                        <Select value={formData.certification} onValueChange={(value) => handleSelectChange('certification', value)}>
                          <SelectTrigger className="w-full px-4 py-3 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-colors">
                            <SelectValue placeholder="Select certification (optional)" />
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
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">Product Image</h2>
                        <p className="text-sm text-muted-foreground">Add a photo to showcase your agricultural input</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg overflow-hidden">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Product preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <ImageIcon className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Choose Image
                        </label>
                        <p className="text-xs text-muted-foreground mt-2">
                          JPG, PNG or GIF. Max size 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <Link
                      href="/supplier/products"
                      className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </Link>
                    
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Save as Draft
                      </button>
                      
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-success hover:bg-success/90 text-primary-foreground font-semibold rounded-lg disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Publish Input
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Preview Section */}
              <div className="lg:col-span-1 h-screen overflow-auto pb-40">
                <div className="sticky top-6 space-y-6">
                  {/* Live Preview */}
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">Live Preview</h2>
                        <p className="text-sm text-muted-foreground">How farmers will see your input</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Product Image */}
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                              <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                              <p className="text-sm">Product image will appear here</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">
                            {formData.name || 'Input Name'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formData.description || 'Input description will appear here...'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <p className="font-semibold text-foreground">
                              {formData.unitPrice ? `RWF ${formData.unitPrice}` : '—'}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Available:</span>
                            <p className="font-semibold text-foreground">
                              {formData.quantity
                                ? `${formData.quantity} ${formData.measurementUnit || ''}`
                                : '—'}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium text-foreground">{formData.location || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Negotiable:</span>
                            <span className="font-medium text-foreground">
                              {formData.isNegotiable ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>

                        {formData.certification !== CertificationType.NONE && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-full text-xs">
                            <Check className="w-3 h-3" />
                            {formData.certification.replace(/_/g, ' ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-info mt-0.5" />
                      <div className="text-sm">
                        <h4 className="font-semibold text-foreground mb-2">Pro Tips</h4>
                        <ul className="text-info space-y-1">
                          <li>• Use high-quality photos for better visibility</li>
                          <li>• Include detailed usage instructions</li>
                          <li>• Set competitive prices based on market rates</li>
                          <li>• Specify exact quantities and measurements</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-accent mt-0.5" />
                      <div className="text-sm">
                        <h4 className="font-semibold text-foreground mb-2">Delivery Information</h4>
                        <p className="text-accent">
                          Farmers will contact you directly for delivery arrangements once they place orders.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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
