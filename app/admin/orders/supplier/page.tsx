'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Menu,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import AdminGuard from '@/contexts/guard/AdminGuard';

function SupplierOrderManagement() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { supplierOrders: orders } = useAdmin();


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Processing':
                return 'bg-purple-100 text-purple-800';
            case 'Failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.buyer.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.supplier.user.names.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            {/* Sidebar */}

            <Sidebar
                userType={UserType.ADMIN}
                activeItem='Supplier Orders'
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Header - White with Search */}
                <header className="bg-white border-b h-16 flex items-center px-6">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 mr-4">Supplier Orders</h1>
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search here..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 bg-white p-6">
                    {/* Transactions Table */}
                    <div className="bg-white rounded-xl border shadow-sm">
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">Supplier Transactions</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sender (Buyer)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Receiver (Supplier)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            STATUS
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ACTION
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredOrders.length == 0 ?
                                        <tr><td colSpan={7} className="text-center py-4">No orders found</td></tr>
                                        : filteredOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.buyer.role}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {order.buyer.names}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.product.supplier.user.role}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.product.supplier.user.names}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(order.createdAt).toDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-4">
                                                        <button className="text-green-600 hover:text-green-800">View</button>
                                                        <button className="text-red-600 hover:text-red-800">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
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
