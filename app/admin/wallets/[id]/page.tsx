'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { walletService } from '@/services/wallet';
import {Wallet as IWallet, Transaction } from '@/types';
import {
    Wallet,
    Loader2,
    X,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    User,
    ArrowLeft
} from '@/lib/icons';
import { notify } from '@/lib/notify';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import PageLoading from '@/components/layout/PageLoading';
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

    const walletId = params.id as string;

    const [wallet, setWallet] = useState<IWallet | null>(null);
    const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
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
                    await fetchUserTransactions(foundWallet.user.id);
                } else {
                    notify.error('Wallet not found', 'Error');
                    router.push('/admin/wallets');
                }
            } else {
                notify.error(response.message || 'Failed to fetch wallet details', 'Error');
            }
        } catch (error) {
            notify.error('Failed to fetch wallet details', 'Error');
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
            <main className="flex-1 overflow-auto bg-background">
                <div className="p-8 max-w-7xl mx-auto">
                    <PageLoading
                        variant="section"
                        label="Loading wallet"
                        description="Fetching wallet details and transactions…"
                        className="bg-transparent dark:bg-transparent"
                    />
                </div>
            </main>
        );
    }

    if (!wallet) {
        return (
            <main className="flex-1 overflow-auto bg-background">
                <div className="p-8 max-w-7xl mx-auto">
                    <div className="text-center">
                        <p className="text-muted-foreground font-semibold uppercase text-xs">Wallet not found</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <>
            <AdminPageHeader
                    title="Ledger Summary"
                    description={`Wallet ID: ${wallet.id}`}
                    backHref="/admin/wallets"
                    backLabel="Back to Wallets"
                />

                <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-1">
                            <p className="text-[10px] uppercase font-semibold text-muted-foreground">Account Holder</p>
                            <p className="font-semibold text-foreground text-lg">{wallet.user.firstName} {wallet.user.lastName}</p>
                            <p className="text-sm text-muted-foreground font-medium">{wallet.user.email}</p>
                        </div>
                        <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-1">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Available Balance</p>
                            <p className="font-semibold text-success text-2xl">
                                RWF {wallet.balance.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Currency: {wallet.currency}</p>
                        </div>
                        <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-1">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Account Status</p>
                            <Badge variant={wallet.isActive ? 'success' : 'destructive'} className="font-semibold text-[10px] px-3 py-1 rounded-full uppercase ">
                                {wallet.isActive ? 'Active' : 'Restricted'}
                            </Badge>
                        </div>
                        <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-1">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Member Since</p>
                            <p className="font-semibold text-foreground">{new Date(wallet.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Transaction History Section */}
                    <div className="bg-card rounded-lg border border-border shadow-sm">
                        <div className="p-8 border-b border-border">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                                    <History className="w-5 h-5 text-muted-foreground" />
                                    Transaction Audit
                                </h3>
                                <span className="text-xs font-semibold text-muted-foreground uppercase ">Recent {userTransactions.length} Activities</span>
                            </div>
                        </div>

                        <div className="p-8">
                            {loadingTransactions ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-success" />
                                    <p className="font-semibold text-muted-foreground text-xs uppercase">Decrypting Ledger...</p>
                                </div>
                            ) : userTransactions.length > 0 ? (
                                <div className="bg-card/50 rounded-lg border border-border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-none">
                                                <TableHead className="text-sm font-semibold uppercase text-muted-foreground py-4 pl-6">Type</TableHead>
                                                <TableHead className="text-sm font-semibold uppercase text-muted-foreground py-4">Status</TableHead>
                                                <TableHead className="text-sm font-semibold uppercase text-muted-foreground py-4 text-right">Amount</TableHead>
                                                <TableHead className="text-sm font-semibold uppercase text-muted-foreground py-4 pr-6">Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {userTransactions.map((tx) => (
                                                <TableRow key={tx.id} className="hover:bg-card transition-colors border-border">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN' ? (
                                                                <div className="p-2 bg-success/10 rounded-lg text-success"><ArrowDownLeft className="w-4 h-4" /></div>
                                                            ) : (
                                                                <div className="p-2 bg-warning/10 rounded-lg text-warning"><ArrowUpRight className="w-4 h-4" /></div>
                                                            )}
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-xs text-foreground uppercase">{tx.type}</span>
                                                                <span className="text-xs text-muted-foreground font-medium line-clamp-1 max-w-[200px]">{tx.description}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getTransactionStatusVariant(tx.status)} className="font-semibold text-xs uppercase px-2 py-0.5 rounded-md">
                                                            {tx.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold text-foreground text-sm ">
                                                        {(tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN' || tx.type === 'INCOME' ? '+' : '-')} RWF {tx.amount.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="pr-6 text-right">
                                                        <span className="text-xs font-semibold text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="py-20 text-center bg-card rounded-3xl border border-dashed border-border">
                                    <p className="text-muted-foreground font-semibold uppercase text-xs">No transaction history found for this account</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
        </>
    );
}

