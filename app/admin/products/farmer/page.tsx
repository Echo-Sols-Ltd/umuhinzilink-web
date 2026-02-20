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
            product.owner?.names.toLowerCase().includes(searchTerm.toLowerCase());

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
            <Sidebar userType={UserType.ADMIN} activeItem="Farmer Products" />

            <main className="flex-1 overflow-auto bg-gray-50/30">
                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Farmer Inventory</h1>
                            <p className="text-sm text-gray-500 mt-1 font-medium italic">Moderate and oversee all farmer-listed produce in the marketplace</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={refreshProducts}
                                className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                                disabled={loading}
                            >
                                <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin text-green-600' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white p-4 rounded-4xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, description or farmer..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-3.5 bg-gray-50/50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full md:w-40 bg-gray-50/50 border-none rounded-2xl h-12 font-bold text-xs uppercase tracking-widest">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="CEREALS">Cereals</SelectItem>
                                    <SelectItem value="VEGETABLES">Vegetables</SelectItem>
                                    <SelectItem value="FRUITS">Fruits</SelectItem>
                                    <SelectItem value="LEGUMES_PULSES">Legumes</SelectItem>
                                    <SelectItem value="ROOTS_TUBERS">Roots & Tubers</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-36 bg-gray-50/50 border-none rounded-2xl h-12 font-bold text-xs uppercase tracking-widest">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="IN_STOCK">In Stock</SelectItem>
                                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                                    <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="font-bold py-6 pl-8">PRODUCT INFO</TableHead>
                                    <TableHead className="font-bold">PRODUCER</TableHead>
                                    <TableHead className="font-bold">INVENTORY</TableHead>
                                    <TableHead className="font-bold">STATUS</TableHead>
                                    <TableHead className="text-right font-bold pr-8">MODERATION</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="pl-8"><Skeleton className="h-14 w-64 rounded-xl" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                            <TableCell className="text-right pr-8"><Skeleton className="h-10 w-24 ml-auto rounded-lg" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredProducts.length > 0 ? (
                                    filteredProducts.map(product => (
                                        <TableRow
                                            key={product.id}
                                            onClick={() => handleViewProduct(product)}
                                            className="group hover:bg-gray-50/50 transition-all cursor-pointer font-medium"
                                        >
                                            <TableCell className="py-5 pl-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="w-6 h-6 text-gray-200" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-900 font-bold text-lg group-hover:text-green-600 transition-colors uppercase tracking-tight leading-tight">{product.name}</span>
                                                        <span className="text-[10px] text-green-600 font-black uppercase tracking-widest mt-1 bg-green-50 w-fit px-2 py-0.5 rounded-md">{product.category}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800">{product.owner?.names || 'Unknown Farmer'}</span>
                                                    <span className="text-[11px] text-gray-400">Verified Producer</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 italic">RWF {product.unitPrice?.toLocaleString()}</span>
                                                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Stock: {product.quantity?.toLocaleString()} {product.measurementUnit}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getStatusVariant(product.productStatus)}
                                                    className="font-black text-[9px] px-3 py-1 uppercase tracking-widest rounded-full"
                                                >
                                                    {product.productStatus?.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedProduct(product);
                                                            setShowModerationModal(true);
                                                        }}
                                                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                                                        title="Moderate"
                                                    >
                                                        <Filter className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteProduct(product.id);
                                                        }}
                                                        disabled={actionLoading === product.id}
                                                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                                        title="Delete"
                                                    >
                                                        {actionLoading === product.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-24 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-20">
                                                <Package className="w-20 h-20 mb-4" />
                                                <p className="text-xl font-black italic">No Produce Records Found</p>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-6">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-100">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tightitalic">Product Deep Scan</h2>
                            <button onClick={() => setShowProductModal(false)} className="p-3 text-gray-400 hover:text-gray-600 rounded-2xl">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-10 overflow-y-auto max-h-[calc(90vh-140px)] space-y-8">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="aspect-square bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 flex items-center justify-center">
                                    {selectedProduct.image ? (
                                        <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-20 h-20 text-gray-200" />
                                    )}
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2">{selectedProduct.category}</p>
                                        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight leading-none">{selectedProduct.name}</h3>
                                        <p className="text-sm text-gray-500 font-bold mt-2">by {selectedProduct.owner?.names}</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-gray-400">Unit Price</p>
                                            <p className="text-xl font-black text-gray-900 italic">RWF {selectedProduct.unitPrice?.toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-gray-400">Inventory</p>
                                            <p className="text-xl font-black text-gray-900 italic">{selectedProduct.quantity?.toLocaleString()} {selectedProduct.measurementUnit}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase text-gray-400">Details</p>
                                        <p className="text-gray-600 font-medium leading-relaxed italic">{selectedProduct.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Moderation Modal */}
            {showModerationModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-6">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 space-y-8 text-center">
                            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto text-amber-600 shadow-xl shadow-amber-50">
                                <Filter className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Moderate Product</h2>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">{selectedProduct.name}</p>
                            </div>
                            <textarea
                                value={moderationReason}
                                onChange={(e) => setModerationReason(e.target.value)}
                                placeholder="State reason for your decision..."
                                className="w-full p-6 bg-gray-50 border-none rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-medium italic min-h-[120px]"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleModerateProduct(selectedProduct.id, 'reject')}
                                    disabled={actionLoading === selectedProduct.id}
                                    className="flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-500 text-xs font-black rounded-[1.25rem] hover:bg-red-50 hover:text-red-500 transition-all uppercase tracking-widest disabled:opacity-50"
                                >
                                    <ThumbsDown className="w-4 h-4" /> REJECT
                                </button>
                                <button
                                    onClick={() => handleModerateProduct(selectedProduct.id, 'approve')}
                                    disabled={actionLoading === selectedProduct.id}
                                    className="flex items-center justify-center gap-2 py-4 bg-green-600 text-white text-xs font-black rounded-[1.25rem] hover:bg-green-700 shadow-lg shadow-green-100 transition-all uppercase tracking-widest disabled:opacity-50"
                                >
                                    <ThumbsUp className="w-4 h-4" /> APPROVE
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
