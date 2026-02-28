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
    const router = useRouter();
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
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar userType={UserType.ADMIN} activeItem="Product Management" />

            <div className="flex-1 flex flex-col overflow-auto">
                <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">Farmer Products</h1>
                        <p className="text-xs text-muted-foreground">Moderate and oversee all farmer-listed produce</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 bg-background p-6 space-y-6">
                    {/* Search and Filters */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search products or farmers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-success"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-success"
                            >
                                <option value="all">All Categories</option>
                                <option value="vegetables">Vegetables</option>
                                <option value="fruits">Fruits</option>
                                <option value="grains">Grains</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-success"
                            >
                                <option value="all">All Status</option>
                                <option value="IN_STOCK">In Stock</option>
                                <option value="OUT_OF_STOCK">Out of Stock</option>
                                <option value="LOW_STOCK">Low Stock</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
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
                                            <div className="flex flex-col items-center text-muted-foreground">
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
                                                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                                        {product.image ? (
                                                            <img src={imageUrl(product.image)} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                                                        ) : (
                                                            <Package className="w-5 h-5 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{product.name}</p>
                                                        <p className="text-sm text-muted-foreground">{product.description}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-foreground">{product.owner?.names}</p>
                                                <p className="text-sm text-muted-foreground">{product.owner?.email}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{product.category}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-foreground">{(product as any).price || 0} RWF</p>
                                                <p className="text-sm text-muted-foreground">per {product.measurementUnit}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-foreground">{product.quantity}</p>
                                                <p className="text-sm text-muted-foreground">{product.measurementUnit}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(product.productStatus)} className='text-white'>
                                                    {product.productStatus.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => router.push(`/admin/products/${product.id}`)}
                                                        className="p-2 text-info hover:text-info/90 hover:bg-info/10 rounded-lg transition-colors"
                                                        title="View product details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleModerateProduct(product.id, 'approve')}
                                                        disabled={actionLoading === product.id}
                                                        className="p-2 text-success hover:text-success/90 hover:bg-success/10 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <ThumbsUp className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        disabled={actionLoading === product.id}
                                                        className="p-2 text-destructive hover:text-destructive/90 hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
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
                            <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-foreground">Product Details</h2>
                                        <button
                                            onClick={() => {
                                                setShowProductModal(false);
                                                setSelectedProduct(null);
                                            }}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Name</p>
                                                <p className="font-medium text-foreground">{selectedProduct.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Category</p>
                                                <p className="font-medium text-foreground">{selectedProduct.category}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Price</p>
                                                <p className="font-medium text-foreground">{selectedProduct.price} RWF</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Stock</p>
                                                <p className="font-medium text-foreground">{selectedProduct.quantity} {selectedProduct.measurementUnit}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Description</p>
                                            <p className="text-foreground">{selectedProduct.description}</p>
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
