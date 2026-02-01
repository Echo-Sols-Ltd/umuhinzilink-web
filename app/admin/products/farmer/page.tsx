'use client';

import React, { useState } from 'react';
import {
    Package,
    Search,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    ThumbsUp,
    ThumbsDown,
    Loader2,
    RefreshCw,
    X,
    Eye,
    Trash2,
    Image,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import AdminGuard from '@/contexts/guard/AdminGuard';
import { useToast } from '@/components/ui/use-toast-new';
import { adminService } from '@/services/admin';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

function FarmerProductManagement() {
    const { farmerProducts: products, loading, deleteProduct, refreshProducts } = useAdmin();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showModerationModal, setShowModerationModal] = useState(false);
    const [moderationReason, setModerationReason] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const filteredProducts = products?.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.farmer?.user?.names.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || product.productStatus === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    }) || [];

    const handleModerateProduct = async (productId: string, action: 'approve' | 'reject') => {
        setActionLoading(productId);
        try {
            await adminService.moderateProduct(productId, action, moderationReason);
            await refreshProducts();
            toast({
                title: 'Success',
                description: `Product ${action}d successfully`,
                variant: 'success',
            });
            setShowModerationModal(false);
            setModerationReason('');
        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to ${action} product`,
                variant: 'error',
            });
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
            await deleteProduct(productId);
        } catch (error) {
            // Error handling is done in the context
        } finally {
            setActionLoading(null);
        }
    };

    const handleViewProduct = (product: any) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'IN_STOCK':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'OUT_OF_STOCK':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'LOW_STOCK':
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'IN_STOCK':
                return 'bg-green-100 text-green-800';
            case 'OUT_OF_STOCK':
                return 'bg-red-100 text-red-800';
            case 'LOW_STOCK':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <Sidebar
                userType={UserType.ADMIN}
                activeItem='Farmer Products'
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b h-16 flex items-center px-6">
                    <div className="flex items-center space-x-4 flex-1">
                        <h1 className="text-xl font-semibold text-gray-900">Farmer Products</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                            />
                        </div>

                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="CEREALS">Cereals</SelectItem>
                                <SelectItem value="VEGETABLES">Vegetables</SelectItem>
                                <SelectItem value="FRUITS">Fruits</SelectItem>
                                <SelectItem value="LEGUMES_PULSES">Legumes</SelectItem>
                                <SelectItem value="ROOTS_TUBERS">Roots & Tubers</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="IN_STOCK">In Stock</SelectItem>
                                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                                <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                            </SelectContent>
                        </Select>

                        <button
                            onClick={refreshProducts}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                            disabled={loading}
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {/* Products Grid */}
                <main className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {/* Product Image */}
                                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Image className="w-12 h-12 text-gray-400" />
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                                            <div className="flex items-center space-x-1">
                                                {getStatusIcon(product.productStatus)}
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(product.productStatus)}`}
                                                >
                                                    {product.productStatus?.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{product.description}</p>

                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Price:</span>
                                                <span className="font-medium">
                                                    RWF {product.unitPrice}/{product.measurementUnit}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Category:</span>
                                                <span className="font-medium">{product.category}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Farmer:</span>
                                                <span className="font-medium">{product.farmer?.user?.names || 'Unknown'}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Unknown'}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleViewProduct(product)}
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setShowModerationModal(true);
                                                    }}
                                                    className="text-green-600 hover:text-green-800 p-1 rounded"
                                                    title="Moderate Product"
                                                >
                                                    <ThumbsUp className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    disabled={actionLoading === product.id}
                                                    className="text-red-600 hover:text-red-800 p-1 rounded"
                                                    title="Delete Product"
                                                >
                                                    {actionLoading === product.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">No products found</p>
                            <p className="text-gray-400 text-sm">
                                {searchTerm || categoryFilter || statusFilter
                                    ? 'Try adjusting your search criteria'
                                    : 'No products are currently available'
                                }
                            </p>
                        </div>
                    )}
                </main>
            </div>

            {/* Product Details Modal */}
            {showProductModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
                    <div className="bg-gray-100 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
                                <button
                                    onClick={() => setShowProductModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                    {selectedProduct.image ? (
                                        <img
                                            src={selectedProduct.image}
                                            alt={selectedProduct.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <Image className="w-16 h-16 text-gray-400" />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.category}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Farmer</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.farmer?.user?.names || 'Unknown'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.description}</p>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t">
                                    <button
                                        onClick={() => setShowProductModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Moderation Modal */}
            {showModerationModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Moderate Product</h2>
                                <button
                                    onClick={() => setShowModerationModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                Product: <strong>{selectedProduct.name}</strong>
                            </p>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason (optional)
                                </label>
                                <textarea
                                    value={moderationReason}
                                    onChange={(e) => setModerationReason(e.target.value)}
                                    placeholder="Enter reason for moderation action..."
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowModerationModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleModerateProduct(selectedProduct.id, 'reject')}
                                    disabled={actionLoading === selectedProduct.id}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center gap-2"
                                >
                                    {actionLoading === selectedProduct.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <ThumbsDown className="w-4 h-4" />
                                    )}
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleModerateProduct(selectedProduct.id, 'approve')}
                                    disabled={actionLoading === selectedProduct.id}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center gap-2"
                                >
                                    {actionLoading === selectedProduct.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <ThumbsUp className="w-4 h-4" />
                                    )}
                                    Approve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
