'use client';

import React, { useState } from 'react';
import {
    Package,
    Search,
    Loader2,
    RefreshCw,
    X,
    Eye,
    Trash2,
    Image as ImageIcon,
    ThumbsUp,
    ThumbsDown,
    Filter,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import AdminGuard from '@/contexts/guard/AdminGuard';
import { useToast } from '@/components/ui/use-toast';
import { adminService } from '@/services/admin';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

function SupplierProductManagement() {
    const { supplierProducts: products, loading, deleteProduct, refreshProducts } = useAdmin();
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
        const supplierName = product.owner?.names || 'Unknown';
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplierName.toLowerCase().includes(searchTerm.toLowerCase());

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

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'IN_STOCK': return 'success';
            case 'OUT_OF_STOCK': return 'destructive';
            case 'LOW_STOCK': return 'warning';
            default: return 'secondary';
        }
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <Sidebar userType={UserType.ADMIN} activeItem="Supplier Products" />

            <main className="flex-1 overflow-auto bg-gray-50/30">
                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Supply Chain</h1>
                            <p className="text-sm text-gray-500 mt-1">Moderate all verified inputs from regional suppliers</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={refreshProducts}
                                className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                                disabled={loading}
                            >
                                <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin text-green-600' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search inputs, descriptions or suppliers..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50/50"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full md:w-40 bg-white border-gray-200 rounded-xl h-10 font-medium text-xs uppercase tracking-wider">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="FERTILIZER">Fertilizer</SelectItem>
                                    <SelectItem value="SEEDS">Seeds</SelectItem>
                                    <SelectItem value="PESTICIDE">Pesticide</SelectItem>
                                    <SelectItem value="TOOLS">Tools</SelectItem>
                                    <SelectItem value="IRRIGATION">Irrigation</SelectItem>
                                    <SelectItem value="MACHINERY">Machinery</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-36 bg-white border-gray-200 rounded-xl h-10 font-medium text-xs uppercase tracking-wider">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="IN_STOCK">In Stock</SelectItem>
                                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                                    <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="font-semibold py-4 pl-6 uppercase text-[11px] tracking-wider text-gray-500">Agri-Input</TableHead>
                                    <TableHead className="font-semibold uppercase text-[11px] tracking-wider text-gray-500">Supplier</TableHead>
                                    <TableHead className="font-semibold uppercase text-[11px] tracking-wider text-gray-500">Inventory</TableHead>
                                    <TableHead className="font-semibold uppercase text-[11px] tracking-wider text-gray-500">Status</TableHead>
                                    <TableHead className="text-right font-semibold pr-6 uppercase text-[11px] tracking-wider text-gray-500">Moderation</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="pl-6"><Skeleton className="h-12 w-64 rounded-xl" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                            <TableCell className="text-right pr-6"><Skeleton className="h-9 w-24 ml-auto rounded-lg" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredProducts.length > 0 ? (
                                    filteredProducts.map(product => (
                                        <TableRow
                                            key={product.id}
                                            onClick={() => handleViewProduct(product)}
                                            className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="w-5 h-5 text-gray-200" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-900 font-semibold group-hover:text-green-600 transition-colors uppercase text-sm">{product.name}</span>
                                                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">{product.category}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-800 text-sm">{product.owner?.names || 'Verified Supplier'}</span>
                                                    <span className="text-[10px] text-gray-400 uppercase font-medium">Regional Partner</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 text-sm">RWF {product.unitPrice?.toLocaleString()}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium">Qty: {product.quantity?.toLocaleString()} {product.measurementUnit}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getStatusVariant(product.productStatus)}
                                                    className="font-bold text-[9px] px-2 py-0.5 uppercase tracking-wider"
                                                >
                                                    {product.productStatus?.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex items-center justify-end gap-1 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedProduct(product);
                                                            setShowModerationModal(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Moderate"
                                                    >
                                                        <Filter className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteProduct(product.id);
                                                        }}
                                                        disabled={actionLoading === product.id}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        {actionLoading === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400 opacity-60">
                                                <Package className="w-12 h-12 mb-3" />
                                                <p className="text-sm font-medium">No input records found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </main>

            {/* Product Details Modal */}
            {showProductModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-100">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Audit View</h2>
                            <button onClick={() => setShowProductModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                                    {selectedProduct.image ? (
                                        <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-12 h-12 text-gray-200" />
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">{selectedProduct.category}</p>
                                        <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">{selectedProduct.name}</h3>
                                        <p className="text-sm text-gray-500 font-medium">Supplied by {selectedProduct.owner?.names}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Unit Price</p>
                                            <p className="text-lg font-bold text-gray-900">RWF {selectedProduct.unitPrice?.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Inventory</p>
                                            <p className="text-lg font-bold text-gray-900">{selectedProduct.quantity?.toLocaleString()} {selectedProduct.measurementUnit}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Details</p>
                                        <p className="text-sm text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Moderation Modal */}
            {showModerationModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 space-y-6 text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                                <Filter className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-gray-900">Moderate Selection</h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{selectedProduct.name}</p>
                            </div>
                            <textarea
                                value={moderationReason}
                                onChange={(e) => setModerationReason(e.target.value)}
                                placeholder="Decision feedback..."
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500 min-h-[100px]"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleModerateProduct(selectedProduct.id, 'reject')}
                                    disabled={actionLoading === selectedProduct.id}
                                    className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors uppercase tracking-widest disabled:opacity-50"
                                >
                                    <ThumbsDown className="w-3.5 h-3.5" /> REJECT
                                </button>
                                <button
                                    onClick={() => handleModerateProduct(selectedProduct.id, 'approve')}
                                    disabled={actionLoading === selectedProduct.id}
                                    className="flex items-center justify-center gap-2 py-3 bg-green-600 text-white text-[10px] font-bold rounded-xl hover:bg-green-700 shadow-md shadow-green-100 transition-colors uppercase tracking-widest disabled:opacity-50"
                                >
                                    <ThumbsUp className="w-3.5 h-3.5" /> APPROVE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SupplierProductsPage() {
    return (
        <AdminGuard>
            <SupplierProductManagement />
        </AdminGuard>
    );
}
