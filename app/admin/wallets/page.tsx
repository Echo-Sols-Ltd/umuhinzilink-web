'use client';

import React, { useState, useEffect } from 'react';

import { UserType } from '@/types/enums';
import { walletService } from '@/services/wallet';
import { WalletDTO, WalletTransactionDTO } from '@/types/wallet';
import { Wallet, Search, Loader2, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import {useToast} from '@/components/ui/use-toast';
import Sidebar from '@/components/shared/Sidebar';
import { useAdmin } from '@/contexts/AdminContext';

export default function AdminWalletsPage() {
    const [wallets, setWallets] = useState<WalletDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [selectedWallet, setSelectedWallet] = useState<WalletDTO | null>(null);
    const [userTransactions, setUserTransactions] = useState<WalletTransactionDTO[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const { toast} = useToast()

    // Fetch all wallets
    const fetchWallets = async () => {
        try {
            setLoading(true);
            const response = await walletService.getAllWallets({
                page,
                size: pageSize,
                sortBy: 'createdAt',
                sortDir: 'desc',
            });

            if (response.success && response.data) {

                setWallets(response.data || []);
                setTotalPages(1);
                setTotalElements(10);
            } else {
                toast({
                    title: 'Error',
                    description: response.message || 'Failed to fetch wallets',
                    variant: 'error',
                });
            }
        } catch (error) {
            console.error('Error fetching wallets:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch wallets',
                variant: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch user transactions
    const fetchUserTransactions = async (userId: string) => {
        try {
            setLoadingTransactions(true);
            const response = await walletService.getTransactionsByUserId(userId, {
                page: 0,
                size: 50,
                sortBy: 'createdAt',
                sortDir: 'desc',
            });
            if (response.success && response.data) {
                setUserTransactions(response.data);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoadingTransactions(false);
        }
    };

    // Handle wallet row click
    const handleWalletClick = async (wallet: WalletDTO) => {
        setSelectedWallet(wallet);
        setShowDetailsModal(true);
        await fetchUserTransactions(wallet.userId);
    };

    useEffect(() => {
        fetchWallets();
    }, [page]);

    // Filter wallets by search term
    const filteredWallets = wallets.filter(
        (wallet) =>
            wallet.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wallet.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wallet.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (active: boolean) => {
        return active ? (
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span>
        ) : (
            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Inactive</span>
        );
    };

    const getTransactionTypeBadge = (type: string) => {
        const colors: Record<string, string> = {
            DEPOSIT: 'bg-green-100 text-green-700',
            PAYMENT: 'bg-blue-100 text-blue-700',
            TRANSFER_IN: 'bg-purple-100 text-purple-700',
            WITHDRAWAL: 'bg-orange-100 text-orange-700',
            REFUND: 'bg-yellow-100 text-yellow-700',
        };
        return (
            <span className={`px-2 py-1 text-xs rounded-full ${colors[type] || 'bg-gray-100 text-gray-700'}`}>
                {type}
            </span>
        );
    };

    const getTransactionStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            COMPLETED: 'bg-green-100 text-green-700',
            PENDING: 'bg-yellow-100 text-yellow-700',
            FAILED: 'bg-red-100 text-red-700',
            CANCELLED: 'bg-gray-100 text-gray-700',
        };
        return (
            <span className={`px-2 py-1 text-xs rounded-full ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userType={UserType.ADMIN} activeItem="Wallets" />

            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white border-b px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Wallet Management</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                View and manage all user wallets ({totalElements} total)
                            </p>
                        </div>
                    </div>
                </header>

                {/* Search Bar */}
                <div className="px-8 py-4 bg-white border-b">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or wallet ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                {/* Wallets Table */}
                <div className="p-8">
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">WALLET ID</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">USER</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">EMAIL</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">BALANCE</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">CURRENCY</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">STATUS</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">CREATED</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center">
                                                <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
                                            </td>
                                        </tr>
                                    ) : filteredWallets.length > 0 ? (
                                        filteredWallets.map((wallet) => (
                                            <tr
                                                key={wallet.id}
                                                onClick={() => handleWalletClick(wallet)}
                                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <td className="py-4 px-4 text-sm text-gray-600 font-mono">
                                                    {wallet.id.substring(0, 8)}...
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                                                    {wallet.userName || 'N/A'}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600">{wallet.userEmail}</td>
                                                <td className="py-4 px-4 text-sm text-gray-900 font-semibold">
                                                    {wallet.balance.toLocaleString()} {wallet.currency}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600">{wallet.currency}</td>
                                                <td className="py-4 px-4">{getStatusBadge(wallet.active)}</td>
                                                <td className="py-4 px-4 text-sm text-gray-600">
                                                    {new Date(wallet.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleWalletClick(wallet);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center">
                                                <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500 text-lg mb-2">No wallets found</p>
                                                <p className="text-gray-400 text-sm">
                                                    {searchTerm ? 'Try adjusting your search criteria' : 'No wallets are available'}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t">
                                <p className="text-sm text-gray-600">
                                    Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalElements)} of{' '}
                                    {totalElements} wallets
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage(Math.max(0, page - 1))}
                                        disabled={page === 0}
                                        className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Page {page + 1} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                        disabled={page >= totalPages - 1}
                                        className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Wallet Details Modal */}
            {showDetailsModal && selectedWallet && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h2 className="text-xl font-bold text-gray-900">Wallet Details</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                            {/* Wallet Info */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Wallet ID</p>
                                    <p className="font-mono text-sm">{selectedWallet.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">User</p>
                                    <p className="font-medium">{selectedWallet.userName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-sm">{selectedWallet.userEmail}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Balance</p>
                                    <p className="font-bold text-lg">
                                        {selectedWallet.balance.toLocaleString()} {selectedWallet.currency}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    {getStatusBadge(selectedWallet.active)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Created</p>
                                    <p className="text-sm">{new Date(selectedWallet.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Transactions */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
                                {loadingTransactions ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                                    </div>
                                ) : userTransactions.length > 0 ? (
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b">
                                                <tr>
                                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">TYPE</th>
                                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">AMOUNT</th>
                                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">STATUS</th>
                                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">DESCRIPTION</th>
                                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">DATE</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {userTransactions.map((tx) => (
                                                    <tr key={tx.id} className="hover:bg-gray-50">
                                                        <td className="py-2 px-3">{getTransactionTypeBadge(tx.type)}</td>
                                                        <td className="py-2 px-3 font-medium">
                                                            {tx.amount.toLocaleString()} RWF
                                                        </td>
                                                        <td className="py-2 px-3">{getTransactionStatusBadge(tx.status)}</td>
                                                        <td className="py-2 px-3 text-sm text-gray-600">{tx.description}</td>
                                                        <td className="py-2 px-3 text-sm text-gray-600">
                                                            {new Date(tx.createdAt).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">No transactions found</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
