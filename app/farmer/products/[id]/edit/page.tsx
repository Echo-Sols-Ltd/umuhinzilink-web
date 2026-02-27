'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notify } from '@/lib/notify';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import { CertificationType, FarmerProductRequest, MeasurementUnit, RwandaCrop, RwandaCropCategory, UserType } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import { productService } from '@/services/products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Sidebar from '@/components/shared/Sidebar';
import { imageUrl } from '@/lib/utils';

function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { farmerProducts, saveFarmerProduct: editFarmerProduct } = useProduct();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [formData, setFormData] = useState<FarmerProductRequest>({
    name: RwandaCrop.AVOCADO,
    quantity: 0,
    unitPrice: 0,
    measurementUnit: MeasurementUnit.KG,
    location: '',
    harvestDate: '',
    category: RwandaCropCategory.FRUITS,
    description: '',
    isNegotiable: false,
    image: '',
    certification: CertificationType.NONE,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const productId = params.id as string;
    const foundProduct = farmerProducts?.find(p => p.id === productId);

    if (foundProduct) {
      setProduct(foundProduct);
      console.log(foundProduct)
      setFormData({
        name: foundProduct.name,
        quantity: foundProduct.quantity,
        unitPrice: foundProduct.unitPrice,
        measurementUnit: foundProduct.measurementUnit,
        location: foundProduct.location,
        harvestDate: foundProduct.harvestDate,
        category: foundProduct.category,
        description: foundProduct.description,
        isNegotiable: foundProduct.isNegotiable,
        image: foundProduct.image,
        certification: foundProduct.certification,
      });

    }
    setLoading(false);
  }, [params.id, farmerProducts]);

  // Handle text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // Handle select inputs
  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productId = params.id as string;
      let payload = { ...formData };

      // If new image is selected, upload it first
      if (imageFile) {
        const imgRes = await productService.uploadProductPhoto(imageFile);
        if (imgRes?.data) {
          payload.image = imgRes.data;
        }
      }

      await editFarmerProduct(productId, payload);


    } catch (error) {
      console.error('Failed to update product:', error);
      notify.error("Failed to update product. Please try again.", "Update Failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-white overflow-hidden">
        <Sidebar userType={UserType.FARMER} activeItem='Products' />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen bg-white overflow-hidden">
        <Sidebar userType={UserType.FARMER} activeItem='Products' />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <Link
              href="/farmer/products"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Back to Products
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar userType={UserType.FARMER} activeItem='Products' />

      <main className="flex-1 overflow-y-auto">
        <div className="bg-white border-b h-16 flex items-center px-6">
          <Link
            href="/farmer/products"
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Edit Product</h1>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            {/* Product Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <img
                        src={imageUrl(product.image)}
                        alt="Product image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a new image (optional)
                  </p>
                </div>
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <Select
                value={formData.name}
                onValueChange={(value) => handleSelectChange('name', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a crop" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RwandaCrop).map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RwandaCropCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describe your product..."
              />
            </div>

            {/* Quantity and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price (RWF)
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Measurement Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Measurement Unit
              </label>
              <Select
                value={formData.measurementUnit}
                onValueChange={(value) => handleSelectChange('measurementUnit', value)}
              >
                <SelectTrigger>
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

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Kigali, Northern Province"
              />
            </div>

            {/* Harvest Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harvest Date
              </label>
              <input
                type="date"
                name="harvestDate"
                value={new Date(formData.harvestDate).toLocaleDateString()}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Certification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certification
              </label>
              <Select
                value={formData.certification}
                onValueChange={(value) => handleSelectChange('certification', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select certification" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CertificationType).map((cert) => (
                    <SelectItem key={cert} value={cert}>
                      {cert}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Is Negotiable */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isNegotiable"
                checked={formData.isNegotiable}
                onChange={(e) => handleSelectChange('isNegotiable', e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="isNegotiable" className="ml-2 block text-sm text-gray-700">
                Price is negotiable
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/farmer/products"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <FarmerGuard>
      <EditProduct />
    </FarmerGuard>
  );
}
