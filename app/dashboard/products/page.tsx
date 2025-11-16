'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import useProductAction from '@/hooks/useProductAction';
import { FarmerProduct, SupplierProduct } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Package, Check } from 'lucide-react';
import { useState } from 'react';

export default function ProductsPage() {
  const { user } = useAuth();
  const { 
    farmerProducts, 
    supplierProducts, 
    loading, 
    error,
    setEditFarmerProduct,
    setEditSupplierProduct 
  } = useProduct();
  const { deleteFarmerProduct, deleteSupplierProduct } = useProductAction();
  const [searchTerm, setSearchTerm] = useState('');

  // Determine which products to show based on user role
  const products = user?.role === 'FARMER' ? farmerProducts : supplierProducts;
  
  // Filter products based on search term
  const filteredProducts = products?.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Error loading products</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            My {user?.role === 'FARMER' ? 'Produce' : 'Products'}
          </h1>
          <p className="text-muted-foreground">
            Manage your {user?.role === 'FARMER' ? 'farm produce' : 'supplier products'} and connect with buyers
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          + Add New {user?.role === 'FARMER' ? 'Produce' : 'Product'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input 
          placeholder="Search your produce..." 
          className="max-w-sm" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Crops" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Crops</SelectItem>
            <SelectItem value="vegetables">Vegetables</SelectItem>
            <SelectItem value="fruits">Fruits</SelectItem>
            <SelectItem value="grains">Grains</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredProducts.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={product.image || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-green-600 text-white">Available</Badge>
            </div>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-medium text-foreground">{product.quantity || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-medium text-foreground">{product.unitPrice ? `${product.unitPrice} RWF` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-foreground">{product.productStatus || 'Available'}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    if (user?.role === 'FARMER') {
                      setEditFarmerProduct(product as FarmerProduct);
                    } else {
                      setEditSupplierProduct(product as SupplierProduct);
                    }
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Sold
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent"
                  onClick={() => {
                    if (user?.role === 'FARMER') {
                      deleteFarmerProduct(product.id);
                    } else {
                      deleteSupplierProduct(product.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 pt-4">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
}
