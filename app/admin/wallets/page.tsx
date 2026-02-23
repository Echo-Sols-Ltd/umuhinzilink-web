'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserType } from '@/types/enums';
import { walletService } from '@/services/wallet';
import { WalletDTO, WalletTransactionDTO } from '@/types/wallet';
import {
    Wallet,
    Search,
    Loader2,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    ArrowUpRight,
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
import { useAdmin } from '@/contexts/AdminContext';

export default function AdminWalletsPage() {
    const router = useRouter();
    const [wallets, setWallets] = useState<WalletDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const { toast } = useToast()
    const { systemWallet} = useAdmin()

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


    const handleWalletClick = (wallet: WalletDTO) => {
        router.push(`/admin/wallets/${wallet.id}`);
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
                            <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-100 flex">
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
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-5">
                            <div className="p-4 bg-green-600 rounded-lg text-white shadow-lg shadow-green-100">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase  mb-1.5">System Liquidity</p>
                                <p className="text-2xl font-semibold text-gray-900 ">RWF {wallets.reduce((acc, w) => acc + w.balance, 0).toLocaleString()}+</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-5">
                            <div className="p-4 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-100">
                                <History className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase  mb-1.5">Active Wallets</p>
                                <p className="text-2xl font-semibold text-gray-900">{totalElements}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-5">
                            <div className="p-4 bg-purple-600 rounded-lg text-white shadow-lg shadow-purple-100">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1.5">Avg Balance</p>
                                <p className="text-2xl font-semibold text-gray-900">RWF {(wallets.length ? wallets.reduce((acc, w) => acc + w.balance, 0) / wallets.length : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
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
                                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-medium"
                            />
                        </div>
                        <button onClick={fetchWallets} className="p-4 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin text-green-600' : ''}`} />
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="font-semibold py-6 pl-8">WALLET OWNER</TableHead>
                                    <TableHead className="font-semibold">BALANCE</TableHead>
                                    <TableHead className="font-semibold">STATUS</TableHead>
                                    <TableHead className="font-semibold">CREATED ON</TableHead>
                                    <TableHead className="text-right font-semibold pr-8">ACTIONS</TableHead>
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
                                                        <span className="text-gray-900 font-semibold group-hover:text-green-600 transition-colors uppercase tracking-tight">{wallet.userName || 'Unknown User'}</span>
                                                        <span className="text-[11px] text-gray-400 font-medium">{wallet.userEmail}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        {wallet.balance.toLocaleString()} {wallet.currency}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={wallet.active ? 'success' : 'destructive'}
                                                    className="font-semibold text-xs px-3 py-1  rounded-full"
                                                >
                                                    {wallet.active ? 'Active' : 'Locked'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-500 font-medium text-sm">
                                                {new Date(wallet.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleWalletClick(wallet);
                                                    }}
                                                    className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 group-hover:block"
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

        </div>
    );
}