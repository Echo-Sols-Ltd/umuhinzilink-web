'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Menu,
    Filter,
    ArrowUpRight,
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

function FarmerOrderManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const { farmerOrders: orders } = useAdmin();

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
        <div className="h-screen bg-white flex overflow-hidden">
            <Sidebar userType={UserType.ADMIN} activeItem="Farmer Orders" />

            <div className="flex-1 flex flex-col overflow-auto bg-gray-50/30">
                {/* Header */}
                <header className="bg-white border-b px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Farmer Ecosystem</h1>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Audit all trade activities between buyers and farmers</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by names..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64 shadow-sm"
                            />
                        </div>
                    </div>
                </header>

                <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
                    {/* Table Container */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-50 rounded-2xl">
                                    <ArrowUpRight className="w-6 h-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Farmer Transactions</h2>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg shadow-gray-200">
                                <Filter className="w-4 h-4" />
                                Advanced Filters
                            </button>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/30">
                                    <TableHead className="py-6 pl-8 font-bold">SETTLEMENT INFO</TableHead>
                                    <TableHead className="font-bold">PARTICIPANTS</TableHead>
                                    <TableHead className="font-bold">EXECUTION DATE</TableHead>
                                    <TableHead className="font-bold">STATUS</TableHead>
                                    <TableHead className="text-right pr-8 font-bold">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-24 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-20">
                                                <Search className="w-16 h-16 mb-4" />
                                                <p className="text-xl font-black italic">No Transactions Captured</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map(order => (
                                        <TableRow key={order.id} className="group hover:bg-gray-50/50 transition-all">
                                            <TableCell className="py-5 pl-8">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">TX-REF: {order.id.slice(0, 8)}</span>
                                                    <span className="font-bold text-gray-900 text-base leading-tight italic">
                                                        RWF {order.totalPrice.toLocaleString()}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400 font-medium">Farmer Settlement Order</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Sender</span>
                                                        <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                                                            <User className="w-3.5 h-3.5 text-blue-500" />
                                                            {order.buyer.names}
                                                        </span>
                                                    </div>
                                                    <div className="w-4 h-px bg-gray-200" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Receiver</span>
                                                        <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                                                            <User className="w-3.5 h-3.5 text-green-500" />
                                                            {order.product.owner?.names}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 font-bold text-gray-600 text-sm">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getStatusVariant(order.status)}
                                                    className="font-black text-[9px] px-3 py-1 uppercase tracking-widest rounded-full"
                                                >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                    <button className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all" title="View Audit">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all" title="Archive">
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

export default function FarmerOrdersPage() {
    return (
        <AdminGuard>
            <FarmerOrderManagement />
        </AdminGuard>
    );
}
