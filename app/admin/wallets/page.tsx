'use client';

import React, { useState, useEffect } from 'react';
import { UserType } from '@/types/enums';
import { walletService } from '@/services/wallet';
import { WalletDTO, WalletTransactionDTO } from '@/types/wallet';
import {
    Wallet,
    Search,
    Loader2,
    Eye,
    X,
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
    User,
    History,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Sidebar from '@/components/shared/Sidebar';
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

function WalletManagement() {
    const [wallets, setWallets] = useState<WalletDTO[]>([]);
    const [transactions, setTransactions] = useState<WalletTransactionDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<WalletDTO | null>(null);
    const [walletTransactions, setWalletTransactions] = useState<WalletTransactionDTO[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        fetchWallets();
    }, [currentPage, searchTerm]);

    const fetchWallets = async () => {
        try {
            setLoading(true);
            const response = await walletService.getAllWallets();
            setWallets(response.data);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch wallets',
                variant: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchWalletTransactions = async (walletId: string) => {
        try {
            const response = await walletService.getAllTransactions();
            setWalletTransactions(response.data.filter((t: WalletTransactionDTO) => t.walletId === walletId));
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch wallet transactions',
                variant: 'error',
            });
        }
    };

    const handleViewDetails = (wallet: WalletDTO) => {
        setSelectedWallet(wallet);
        setShowDetailsModal(true);
        fetchWalletTransactions(wallet.id);
    };

    const getTransactionTypeVariant = (type: string) => {
        switch (type) {
            case 'DEPOSIT': return 'success';
            case 'PAYMENT': return 'info';
            case 'TRANSFER_IN': return 'success';
            case 'WITHDRAWAL': return 'warning';
            case 'REFUND': return 'info';
            default: return 'secondary';
        }
    };

    const getTransactionStatusVariant = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'INCOME': return 'success'
            case 'PENDING': return 'warning';
            case 'FAILED': return 'destructive';
            default: return 'secondary';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar userType={UserType.ADMIN} activeItem="Wallets" />

            <div className="flex-1 flex flex-col overflow-auto">
                <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Wallet Management</h1>
                        <p className="text-xs text-gray-500">Monitor and manage all user wallets and transactions</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 bg-gray-50 p-6 space-y-6">
                    {/* Search and Filter */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search wallets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    {/* Wallets Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Balance</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : wallets.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="flex flex-col items-center text-gray-500">
                                                <Wallet className="w-8 h-8 mb-2" />
                                                <p>No wallets found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    wallets.map((wallet) => (
                                        <TableRow key={wallet.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <User className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{wallet.userId}</p>
                                                        <p className="text-sm text-gray-500">Wallet ID: {wallet.id}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-gray-900">{wallet.balance} RWF</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={wallet.active ? 'success' : 'secondary'}>
                                                    {wallet.active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm text-gray-900">
                                                    {new Date(wallet.createdAt).toLocaleDateString()}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <button
                                                    onClick={() => handleViewDetails(wallet)}
                                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing {currentPage * 10 + 1} to {Math.min((currentPage + 1) * 10, totalElements)} of {totalElements} wallets
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <ArrowDownLeft className="w-4 h-4 rotate-90" />
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {currentPage + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                    disabled={currentPage === totalPages - 1}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <ArrowUpRight className="w-4 h-4 -rotate-90" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Wallet Details Modal */}
                    {showDetailsModal && selectedWallet && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">Wallet Details</h2>
                                        <button
                                            onClick={() => {
                                                setShowDetailsModal(false);
                                                setSelectedWallet(null);
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Wallet ID</p>
                                                <p className="font-medium text-gray-900">{selectedWallet.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Balance</p>
                                                <p className="font-medium text-gray-900">{selectedWallet.balance} RWF</p>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Type</TableHead>
                                                            <TableHead>Amount</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead>Date</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {walletTransactions.length === 0 ? (
                                                            <TableRow>
                                                                <TableCell colSpan={4} className="text-center py-4">
                                                                    <p className="text-gray-500">No transactions found</p>
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            walletTransactions.map((transaction) => (
                                                                <TableRow key={transaction.id}>
                                                                    <TableCell>
                                                                        <Badge variant={getTransactionTypeVariant(transaction.type)}>
                                                                            {transaction.type}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <p className="font-medium text-gray-900">{transaction.amount} RWF</p>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant={getTransactionStatusVariant(transaction.status)}>
                                                                            {transaction.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <p className="text-sm text-gray-900">
                                                                            {new Date(transaction.createdAt).toLocaleDateString()}
                                                                        </p>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
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

export default function AdminWalletsPage() {
    return (
        <AdminGuard>
            <WalletManagement />
        </AdminGuard>
    );
}
