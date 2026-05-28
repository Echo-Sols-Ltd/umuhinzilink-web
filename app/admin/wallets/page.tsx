'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { walletService } from '@/services/wallet';
import { Wallet as IWallet, Transaction} from '@/types';
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
import { notify } from '@/lib/notify';
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
    const [wallets, setWallets] = useState<IWallet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const { systemWallet } = useAdmin()

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
                notify.error(response.message || 'Failed to fetch wallets', 'Error');
            }
        } catch (error) {
            notify.error('Failed to fetch wallets', 'Error');
        } finally {
            setLoading(false);
        }
    };


    const handleWalletClick = (wallet: IWallet) => {
        router.push(`/admin/wallets/${wallet.id}`);
    };

    useEffect(() => {
        fetchWallets();
    }, [page]);

    const filteredWallets = wallets.filter(
        (wallet) =>
            wallet.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wallet.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wallet.user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wallet.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar userType={UserRole.ADMIN} activeItem="Wallets" />

            <main className="flex-1 overflow-auto bg-background/30">
                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-semibold text-foreground  flex items-center gap-3">
                                <ShieldCheck className="w-8 h-8 text-success" />
                                Treasury Management
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1 font-medium">Verify and monitor {totalElements} user wallets across ecosystem</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-card p-1 rounded-lg shadow-sm border border-border flex">
                                <button className="px-4 py-2 bg-success/10 text-success text-xs font-semibold rounded-xl flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Wallets
                                </button>
                                <button className="px-4 py-2 text-muted-foreground text-xs font-semibold rounded-xl hover:text-foreground transition-all">
                                    Transactions
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-card p-6 rounded-lg border border-border shadow-sm flex items-center gap-5">
                            <div className="p-4 bg-success rounded-lg text-white shadow-lg shadow-success/20">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase  mb-1.5">System Liquidity</p>
                                <p className="text-2xl font-semibold text-foreground ">RWF {wallets.reduce((acc, w) => acc + w.balance, 0).toLocaleString()}+</p>
                            </div>
                        </div>
                        <div className="bg-card p-6 rounded-lg border border-border shadow-sm flex items-center gap-5">
                            <div className="p-4 bg-info rounded-lg text-white shadow-lg shadow-info/20">
                                <History className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase  mb-1.5">Active Wallets</p>
                                <p className="text-2xl font-semibold text-foreground">{totalElements}</p>
                            </div>
                        </div>
                        <div className="bg-card p-6 rounded-lg border border-border shadow-sm flex items-center gap-5">
                            <div className="p-4 bg-purple-600 rounded-lg text-white shadow-lg shadow-purple-100">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Avg Balance</p>
                                <p className="text-2xl font-semibold text-foreground">RWF {(wallets.length ? wallets.reduce((acc, w) => acc + w.balance, 0) / wallets.length : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-xl w-full">
                            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or wallet ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-success shadow-sm font-medium"
                            />
                        </div>
                        <button onClick={fetchWallets} className="p-4 bg-card border border-border rounded-lg hover:bg-card transition-all shadow-sm">
                            <RefreshCw className={`w-5 h-5 text-muted-foreground ${loading ? 'animate-spin text-success' : ''}`} />
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-card/50">
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
                                            className="group cursor-pointer hover:bg-card/50 transition-all font-medium"
                                        >
                                            <TableCell className="py-5 pl-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20 group-hover:scale-110 transition-transform">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-foreground font-semibold group-hover:text-success transition-colors uppercase ">{wallet.user.firstName + ' ' + wallet.user.lastName || 'Unknown User'}</span>
                                                        <span className="text-[11px] text-muted-foreground font-medium">{wallet.user.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-semibold text-foreground">
                                                        {wallet.balance.toLocaleString()} {wallet.currency}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={wallet.isActive ? 'success' : 'destructive'}
                                                    className="font-semibold text-xs px-3 py-1  rounded-full"
                                                >
                                                    {wallet.isActive ? 'Active' : 'Locked'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground font-medium text-sm">
                                                {new Date(wallet.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleWalletClick(wallet);
                                                    }}
                                                    className="p-3 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 group-hover:block"
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
                                                <p className="text-xl font-semibold ">No Wallets Found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between px-8 py-6 bg-card rounded-4xl border border-border shadow-sm">
                            <p className="text-sm text-muted-foreground font-semibold">
                                Showing PAGE <span className="text-foreground">{page + 1}</span> OF <span className="text-foreground">{totalPages}</span>
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}
                                    className="p-2 text-muted-foreground hover:text-success disabled:opacity-30 disabled:hover:text-muted-foreground transition-all border border-border rounded-lg"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="p-2 text-muted-foreground hover:text-success disabled:opacity-30 disabled:hover:text-muted-foreground transition-all border border-border rounded-lg"
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