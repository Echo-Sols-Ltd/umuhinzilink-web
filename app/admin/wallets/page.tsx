'use client';

import React, { useState, useEffect } from 'react';
import { UserType } from '@/types/enums';
import { walletService } from '@/services/wallet';
import { WalletDTO, WalletTransactionDTO } from '@/types/wallet';
import {
    Wallet,
    Search,
    Loader2,
    ChevronLeft,
    ChevronRight,
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
    const { toast } = useToast()

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
                setWallets(response.data);
                setTotalPages(response.totalPages || 1);
                setTotalElements(response.totalElements || response.data.length);
            } else {
                toast({
                    title: 'Error',
                    description: response.message || 'Failed to fetch wallets',
                    variant: 'error',
                });
            }
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

    const handleWalletClick = async (wallet: WalletDTO) => {
        setSelectedWallet(wallet);
        setShowDetailsModal(true);
        await fetchUserTransactions(wallet.userId);
    };

    useEffect(() => {
        fetchWallets();
    }, [page]);

    const filteredWallets = wallets.filter(
        (wallet) =>
            wallet.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wallet.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wallet.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            case 'PENDING': return 'warning';
            case 'FAILED': return 'destructive';
            default: return 'secondary';
        }
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <Sidebar userType={UserType.ADMIN} activeItem="Wallets" />

            <main className="flex-1 overflow-auto bg-gray-50/30">
                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <ShieldCheck className="w-8 h-8 text-green-600" />
                                Treasury Management
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Verify and monitor {totalElements} user wallets across the ecosystem</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex">
                                <button className="px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-xl flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Wallets
                                </button>
                                <button className="px-4 py-2 text-gray-400 text-xs font-bold rounded-xl hover:text-gray-600 transition-all">
                                    Transactions
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                            <div className="p-4 bg-green-600 rounded-2xl text-white shadow-lg shadow-green-100">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">System Liquidity</p>
                                <p className="text-2xl font-black text-gray-900 leading-none">RWF {wallets.reduce((acc, w) => acc + w.balance, 0).toLocaleString()}+</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                            <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                                <History className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">Active Wallets</p>
                                <p className="text-2xl font-black text-gray-900 leading-none">{totalElements}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                            <div className="p-4 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-100">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">Avg Balance</p>
                                <p className="text-2xl font-black text-gray-900 leading-none">RWF {(wallets.length ? wallets.reduce((acc, w) => acc + w.balance, 0) / wallets.length : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-xl w-full">
                            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or wallet ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-medium"
                            />
                        </div>
                        <button onClick={fetchWallets} className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
                            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin text-green-600' : ''}`} />
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="font-bold py-6 pl-8">WALLET OWNER</TableHead>
                                    <TableHead className="font-bold">BALANCE</TableHead>
                                    <TableHead className="font-bold">STATUS</TableHead>
                                    <TableHead className="font-bold">CREATED ON</TableHead>
                                    <TableHead className="text-right font-bold pr-8">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="pl-8"><Skeleton className="h-12 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                            <TableCell className="text-right pr-8"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredWallets.length > 0 ? (
                                    filteredWallets.map((wallet) => (
                                        <TableRow
                                            key={wallet.id}
                                            onClick={() => handleWalletClick(wallet)}
                                            className="group cursor-pointer hover:bg-gray-50/50 transition-all font-medium"
                                        >
                                            <TableCell className="py-5 pl-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100 group-hover:scale-110 transition-transform">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-900 font-bold group-hover:text-green-600 transition-colors uppercase tracking-tight">{wallet.userName || 'Unknown User'}</span>
                                                        <span className="text-[11px] text-gray-400 font-medium">{wallet.userEmail}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black text-gray-900">
                                                        {wallet.balance.toLocaleString()} {wallet.currency}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{wallet.id.substring(0, 8)}...</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={wallet.active ? 'success' : 'destructive'}
                                                    className="font-black text-[9px] px-3 py-1 uppercase tracking-widest rounded-full"
                                                >
                                                    {wallet.active ? 'Active' : 'Locked'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-500 font-bold text-sm">
                                                {new Date(wallet.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleWalletClick(wallet);
                                                    }}
                                                    className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 group-hover:block"
                                                >
                                                    <ArrowUpRight className="w-5 h-5" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-24 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-20">
                                                <Wallet className="w-20 h-20 mb-4" />
                                                <p className="text-xl font-black italic">No Wallets Found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between px-8 py-6 bg-white rounded-4xl border border-gray-100 shadow-sm">
                            <p className="text-sm text-gray-500 font-bold">
                                Showing PAGE <span className="text-gray-900">{page + 1}</span> OF <span className="text-gray-900">{totalPages}</span>
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}
                                    className="p-2 text-gray-400 hover:text-green-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-all border border-gray-100 rounded-lg"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="p-2 text-gray-400 hover:text-green-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-all border border-gray-100 rounded-lg"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Wallet Details Modal */}
            {showDetailsModal && selectedWallet && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-4xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-100 transform transition-all animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-green-100">
                                    <Wallet className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Ledger Summary</h2>
                                    <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">Wallet ID: {selectedWallet.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-10 overflow-y-auto max-h-[calc(90vh-160px)] space-y-12">
                            {/* Detailed Info Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Account Holder</p>
                                    <p className="font-bold text-gray-900 text-lg">{selectedWallet.userName}</p>
                                    <p className="text-sm text-gray-500 font-medium">{selectedWallet.userEmail}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Available Balance</p>
                                    <p className="font-black text-green-600 text-2xl">
                                        RWF {selectedWallet.balance.toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Currency: {selectedWallet.currency}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Account Status</p>
                                    <Badge variant={selectedWallet.active ? 'success' : 'destructive'} className="font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                                        {selectedWallet.active ? 'Active' : 'Restricted'}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Member Since</p>
                                    <p className="font-bold text-gray-900">{new Date(selectedWallet.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>

                            {/* Transaction History Section */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                        <History className="w-5 h-5 text-gray-400" />
                                        Transaction Audit
                                    </h3>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent 50 Activities</span>
                                </div>

                                {loadingTransactions ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                                        <p className="font-bold text-gray-400 text-xs uppercase tracking-widest">Decrypting Ledger...</p>
                                    </div>
                                ) : userTransactions.length > 0 ? (
                                    <div className="bg-gray-50/50 rounded-3xl border border-gray-100 overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-none">
                                                    <TableHead className="text-[10px] font-black uppercase text-gray-400 py-4 pl-6">Type</TableHead>
                                                    <TableHead className="text-[10px] font-black uppercase text-gray-400 py-4">Status</TableHead>
                                                    <TableHead className="text-[10px] font-black uppercase text-gray-400 py-4 text-right">Amount</TableHead>
                                                    <TableHead className="text-[10px] font-black uppercase text-gray-400 py-4 pr-6">Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {userTransactions.map((tx) => (
                                                    <TableRow key={tx.id} className="hover:bg-white transition-colors border-gray-50">
                                                        <TableCell className="pl-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                {tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN' ? (
                                                                    <div className="p-2 bg-green-50 rounded-lg text-green-600"><ArrowDownLeft className="w-4 h-4" /></div>
                                                                ) : (
                                                                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><ArrowUpRight className="w-4 h-4" /></div>
                                                                )}
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-[11px] text-gray-900 uppercase tracking-tight">{tx.type}</span>
                                                                    <span className="text-[10px] text-gray-400 font-medium line-clamp-1 max-w-[200px]">{tx.description}</span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={getTransactionStatusVariant(tx.status)} className="font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-md">
                                                                {tx.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-black text-gray-900 text-sm italic">
                                                            {(tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN' ? '+' : '-')} RWF {tx.amount.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="pr-6 text-right">
                                                            <span className="text-[10px] font-bold text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                        <p className="text-gray-400 font-black italic uppercase text-xs tracking-widest">No transaction history found for this account</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
