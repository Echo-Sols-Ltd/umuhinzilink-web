'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Menu,
    Filter,
    ArrowDownLeft,
    User,
    Calendar,
    Eye,
    Trash2,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import AdminGuard from '@/contexts/guard/AdminGuard';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

function SupplierOrderManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const { supplierOrders: orders } = useAdmin();

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Completed': return 'success';
            case 'Processing': return 'info';
            case 'Failed': return 'destructive';
            default: return 'secondary';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.buyer.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.owner?.names.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <Sidebar userType={UserType.ADMIN} activeItem="Order Management" />

            <div className="flex-1 flex flex-col overflow-auto">
                {/* Header */}
                <header className="bg-white border-b h-16 flex items-center justify-between p-6 shadow-sm">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Supplier Orders</h1>
                        <p className="text-xs text-gray-500">Monitor and manage supplier-to-farmer transactions</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 bg-white space-y-6">
                    {/* Table Container */}
                    <div className="overflow-hidden">
                        <Table className='rounded-none border-0'>
                            <TableHeader>
                                <TableRow className="bg-white/30">
                                    <TableHead className="py-6 pl-8 font-semibold">SETTLEMENT INFO</TableHead>
                                    <TableHead className="font-semibold">PARTICIPANTS</TableHead>
                                    <TableHead className="font-semibold">EXECUTION DATE</TableHead>
                                    <TableHead className="font-semibold">STATUS</TableHead>
                                    <TableHead className="text-right pr-8 font-semibold">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-24 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-20">
                                                <Search className="w-16 h-16 mb-4" />
                                                <p className="text-xl font-semibold ">No Transactions Captured</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map(order => (
                                        <TableRow key={order.id} className="group hover:bg-white/50 transition-all">
                                            <TableCell className="py-5 pl-8">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-semibold text-blue-600 uppercase  mb-1">SUP-REF: {order.id.slice(0, 8)}</span>
                                                    <span className="font-semibold text-gray-900 text-base leading-tight ">
                                                        RWF {order.totalPrice.toLocaleString()}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400 font-semibold">Bulk Input Purchase</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-semibold text-gray-400 uppercase ">Sender (Buyer)</span>
                                                        <span className="text-sm text-gray-800 flex items-center gap-1.5">
                                                            <User className="w-3.5 h-3.5 text-green-500" />
                                                            {order.buyer.names}
                                                        </span>
                                                    </div>
                                                    <div className="w-4 h-px bg-gray-200" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-semibold text-gray-400 uppercase ">Receiver (Supplier)</span>
                                                        <span className="text-sm text-gray-800 flex items-center gap-1.5">
                                                            <User className="w-3.5 h-3.5 text-orange-500" />
                                                            {order.product.owner?.names}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2  text-gray-600 text-sm">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getStatusVariant(order.status)}
                                                    className="font-semibold text-[9px] px-3 py-1 uppercase  rounded-full"
                                                >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex items-center justify-end gap-2 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                    <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all" title="View Audit">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all" title="Flag Transaction">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function SupplierOrdersPage() {
    return (
        <AdminGuard>
            <SupplierOrderManagement />
        </AdminGuard>
    );
}
