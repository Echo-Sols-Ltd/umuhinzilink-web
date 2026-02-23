'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserType } from '@/types/enums';
import { walletService } from '@/services/wallet';
import { WalletDTO, WalletTransactionDTO } from '@/types/wallet';
import {
    Wallet,
    Loader2,
    X,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    User,
    ArrowLeft
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

export default function WalletDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const walletId = params.id as string;

    const [wallet, setWallet] = useState<WalletDTO | null>(null);
    const [userTransactions, setUserTransactions] = useState<WalletTransactionDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const fetchWalletDetails = async () => {
        try {
            setLoading(true);
            const response = await walletService.getAllWallets({
                page: 0,
                size: 1000,
                sortBy: 'createdAt',
                sortDir: 'desc',
            });

            if (response.success && response.data) {
                const foundWallet = response.data.find(w => w.id === walletId);
                if (foundWallet) {
                    setWallet(foundWallet);
                    await fetchUserTransactions(foundWallet.userId);
                } else {
                    toast({
                        title: 'Error',
                        description: 'Wallet not found',
                        variant: 'error',
                    });
                    router.push('/admin/wallets');
                }
            } else {
                toast({
                    title: 'Error',
                    description: response.message || 'Failed to fetch wallet details',
                    variant: 'error',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch wallet details',
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

    const getTransactionStatusVariant = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'INCOME': return 'success'
            case 'PENDING': return 'warning';
            case 'FAILED': return 'destructive';
            default: return 'secondary';
        }
    };

    useEffect(() => {
        if (walletId) {
            fetchWalletDetails();
        }
    }, [walletId]);

    if (loading) {
        return (
            <div className="flex h-screen bg-white overflow-hidden">
                <Sidebar userType={UserType.ADMIN} activeItem="Wallets" />
                <main className="flex-1 overflow-auto bg-gray-50/30">
                    <div className="p-8 max-w-7xl mx-auto">
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                            <p className="font-bold text-gray-400 text-xs uppercase tracking-widest">Loading wallet details...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!wallet) {
        return (
            <div className="flex h-screen bg-white overflow-hidden">
                <Sidebar userType={UserType.ADMIN} activeItem="Wallets" />
                <main className="flex-1 overflow-auto bg-gray-50/30">
                    <div className="p-8 max-w-7xl mx-auto">
                        <div className="text-center">
                            <p className="text-gray-400 font-black italic uppercase text-xs tracking-widest">Wallet not found</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <Sidebar userType={UserType.ADMIN} activeItem="Wallets" />

            <main className="flex-1 overflow-auto bg-gray-50/30">
                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/admin/wallets')}
                                className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center text-white shadow-xl shadow-green-100">
                                    <Wallet className="w-7 h-7" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900 uppercase">Ledger Summary</h1>
                                    <p className="text-xs text-gray-500 font-semibold uppercase mt-1">Wallet ID: {wallet.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Info Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-1">
                            <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest">Account Holder</p>
                            <p className="font-semibold text-gray-900 text-lg">{wallet.userName}</p>
                            <p className="text-sm text-gray-500 font-medium">{wallet.userEmail}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-1">
                            <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest">Available Balance</p>
                            <p className="font-semibold text-green-600 text-2xl">
                                RWF {wallet.balance.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-tighter">Currency: {wallet.currency}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-1">
                            <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest">Account Status</p>
                            <Badge variant={wallet.active ? 'success' : 'destructive'} className="font-semibold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                                {wallet.active ? 'Active' : 'Restricted'}
                            </Badge>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-1">
                            <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest">Member Since</p>
                            <p className="font-semibold text-gray-900">{new Date(wallet.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Transaction History Section */}
                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
                        <div className="p-8 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                                    <History className="w-5 h-5 text-gray-400" />
                                    Transaction Audit
                                </h3>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Recent {userTransactions.length} Activities</span>
                            </div>
                        </div>

                        <div className="p-8">
                            {loadingTransactions ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                                    <p className="font-bold text-gray-400 text-xs uppercase tracking-widest">Decrypting Ledger...</p>
                                </div>
                            ) : userTransactions.length > 0 ? (
                                <div className="bg-gray-50/50 rounded-lg border border-gray-100 overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-none">
                                                <TableHead className="text-sm font-semibold uppercase text-gray-400 py-4 pl-6">Type</TableHead>
                                                <TableHead className="text-sm font-semibold uppercase text-gray-400 py-4">Status</TableHead>
                                                <TableHead className="text-sm font-semibold uppercase text-gray-400 py-4 text-right">Amount</TableHead>
                                                <TableHead className="text-sm font-semibold uppercase text-gray-400 py-4 pr-6">Date</TableHead>
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
                                                                <span className="font-bold text-xs text-gray-900 uppercase ">{tx.type}</span>
                                                                <span className="text-xs text-gray-400 font-medium line-clamp-1 max-w-[200px]">{tx.description}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getTransactionStatusVariant(tx.status)} className="font-semibold text-xs uppercase px-2 py-0.5 rounded-md">
                                                            {tx.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold text-gray-900 text-sm ">
                                                        {(tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN'|| tx.type ==='INCOME' ? '+' : '-')} RWF {tx.amount.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="pr-6 text-right">
                                                        <span className="text-xs font-bold text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</span>
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
            </main>
        </div>
    );
}
