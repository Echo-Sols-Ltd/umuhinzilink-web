'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Filter,
    Eye,
    Trash2,
    RefreshCw,
    ThumbsUp,
    ThumbsDown,
    X,
    Package,
    ImageIcon,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { adminService } from '@/services/admin';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import AdminGuard from '@/contexts/guard/AdminGuard';
import { notify } from '@/lib/notify';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { imageUrl } from '@/lib/utils';

function FarmerProductManagement() {
    const { farmerProducts, refreshProducts } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [loading, setLoading] = useState(false);


    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'IN_STOCK': return 'success';
            case 'OUT_OF_STOCK': return 'destructive';
            case 'LOW_STOCK': return 'warning';
            default: return 'secondary';
        }
    };

    const filteredProducts = farmerProducts.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.owner?.names.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || product.productStatus === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    }) || [];

    const handleModerateProduct = async (productId: string, action: 'approve' | 'reject') => {
        setActionLoading(productId);
        try {
            await adminService.moderateProduct(productId, action, '');
            await refreshProducts();
            notify.success(`Product ${action}d successfully`, 'Success');
        } catch (error) {
            notify.error('Failed to moderate product', 'Error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }

        setActionLoading(productId);
        try {
            await adminService.deleteProduct(productId);
            await refreshProducts();
        } catch (error) {
            // Error handling is done in the context
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <Sidebar userType={UserType.ADMIN} activeItem="Product Management" />

            <div className="flex-1 flex flex-col overflow-auto">
                <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Farmer Products</h1>
                        <p className="text-xs text-gray-500">Moderate and oversee all farmer-listed produce</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 bg-white p-6 space-y-6">
                    {/* Search and Filters */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search products or farmers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                                <option value="all">All Categories</option>
                                <option value="vegetables">Vegetables</option>
                                <option value="fruits">Fruits</option>
                                <option value="grains">Grains</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                                <option value="all">All Status</option>
                                <option value="IN_STOCK">In Stock</option>
                                <option value="OUT_OF_STOCK">Out of Stock</option>
                                <option value="LOW_STOCK">Low Stock</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Farmer</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="flex flex-col items-center text-gray-500">
                                                <Package className="w-8 h-8 mb-2" />
                                                <p>No products found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        {product.image ? (
                                                            <img src={imageUrl(product.image)} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                                                        ) : (
                                                            <Package className="w-5 h-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{product.name}</p>
                                                        <p className="text-sm text-gray-500">{product.description}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-gray-900">{product.owner?.names}</p>
                                                <p className="text-sm text-gray-500">{product.owner?.email}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{product.category}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-gray-900">{(product as any).price || 0} RWF</p>
                                                <p className="text-sm text-gray-500">per {product.measurementUnit}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-gray-900">{product.quantity}</p>
                                                <p className="text-sm text-gray-500">{product.measurementUnit}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(product.productStatus)} className='text-white'>
                                                    {product.productStatus.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setShowProductModal(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleModerateProduct(product.id, 'approve')}
                                                        disabled={actionLoading === product.id}
                                                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <ThumbsUp className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        disabled={actionLoading === product.id}
                                                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Product Details Modal */}
                    {showProductModal && selectedProduct && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
                                        <button
                                            onClick={() => {
                                                setShowProductModal(false);
                                                setSelectedProduct(null);
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Name</p>
                                                <p className="font-medium text-gray-900">{selectedProduct.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Category</p>
                                                <p className="font-medium text-gray-900">{selectedProduct.category}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Price</p>
                                                <p className="font-medium text-gray-900">{selectedProduct.price} RWF</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Stock</p>
                                                <p className="font-medium text-gray-900">{selectedProduct.quantity} {selectedProduct.measurementUnit}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Description</p>
                                            <p className="text-gray-900">{selectedProduct.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function FarmerProductsPage() {
    return (
        <AdminGuard>
            <FarmerProductManagement />
        </AdminGuard>
    );
}
