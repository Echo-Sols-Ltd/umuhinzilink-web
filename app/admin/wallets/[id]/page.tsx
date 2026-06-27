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
} from 'lucide-react';
import { notify } from '@/lib/notify';
import { useI18n } from '@/contexts/I18nContext';
import Sidebar from '@/components/shared/Sidebar';
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
    const { t } = useI18n();

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
                    notify.error(t('admin.walletsDetail.notFound'), t('common.error'));
                    router.push('/admin/wallets');
                }
            } else {
                notify.error(response.message || t('admin.walletsDetail.toasts.fetchFailed'), t('common.error'));
            }
        } catch (error) {
            notify.error(t('admin.walletsDetail.toasts.fetchFailed'), t('common.error'));
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
            <div className="flex h-screen bg-background overflow-hidden">
                <Sidebar userType={UserRole.ADMIN} activeItem="Wallets" />
                <main className="flex-1 overflow-auto bg-background">
                    <div className="p-8 max-w-7xl mx-auto">
                        <PageLoading
                            variant="section"
                            label={t('admin.walletsDetail.loadingLabel')}
                            description={t('admin.walletsDetail.loadingDescription')}
                            className="bg-transparent dark:bg-transparent"
                        />
                    </div>
                </main>
            </div>
        );
    }

    if (!wallet) {
        return (
            <div className="flex h-screen bg-background overflow-hidden">
                <Sidebar userType={UserRole.ADMIN} activeItem="Wallets" />
                <main className="flex-1 overflow-auto bg-background">
                    <div className="p-8 max-w-7xl mx-auto">
                        <div className="text-center">
                            <p className="text-muted-foreground font-semibold uppercase text-xs">{t('admin.walletsDetail.notFound')}</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar userType={UserRole.ADMIN} activeItem="Wallets" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminPageHeader
                    title={t('admin.walletsDetail.title')}
                    description={t('admin.walletsDetail.walletId', { id: wallet.id })}
                    backHref="/admin/wallets"
                    backLabel={t('admin.walletsDetail.backToWallets')}
                />

                <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-1">
                            <p className="text-[10px] uppercase font-semibold text-muted-foreground">{t('admin.walletsDetail.accountHolder')}</p>
                            <p className="font-semibold text-foreground text-lg">{wallet.user.firstName} {wallet.user.lastName}</p>
                            <p className="text-sm text-muted-foreground font-medium">{wallet.user.email}</p>
                        </div>
                        <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-1">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">{t('admin.walletsDetail.availableBalance')}</p>
                            <p className="font-semibold text-success text-2xl">
                                RWF {wallet.balance.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">{t('admin.walletsDetail.currency', { currency: wallet.currency })}</p>
                        </div>
                        <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-1">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">{t('admin.walletsDetail.accountStatus')}</p>
                            <Badge variant={wallet.isActive ? 'success' : 'destructive'} className="font-semibold text-[10px] px-3 py-1 rounded-full uppercase ">
                                {wallet.isActive ? t('admin.walletsDetail.status.active') : t('admin.walletsDetail.status.restricted')}
                            </Badge>
                        </div>
                        <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-1">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">{t('admin.walletsDetail.memberSince')}</p>
                            <p className="font-semibold text-foreground">{new Date(wallet.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Transaction History Section */}
                    <div className="bg-card rounded-lg border border-border shadow-sm">
                        <div className="p-8 border-b border-border">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                                    <History className="w-5 h-5 text-muted-foreground" />
                                    {t('admin.walletsDetail.transactionAudit')}
                                </h3>
                                <span className="text-xs font-semibold text-muted-foreground uppercase ">{t('admin.walletsDetail.recentActivities', { count: userTransactions.length })}</span>
                            </div>
                        </div>

                        <div className="p-8">
                            {loadingTransactions ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-success" />
                                    <p className="font-semibold text-muted-foreground text-xs uppercase">{t('admin.walletsDetail.loadingTransactions')}</p>
                                </div>
                            ) : userTransactions.length > 0 ? (
                                <div className="bg-card/50 rounded-lg border border-border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-none">
                                                <TableHead className="text-sm font-semibold uppercase text-muted-foreground py-4 pl-6">{t('admin.walletsDetail.table.type')}</TableHead>
                                                <TableHead className="text-sm font-semibold uppercase text-muted-foreground py-4">{t('admin.walletsDetail.table.status')}</TableHead>
                                                <TableHead className="text-sm font-semibold uppercase text-muted-foreground py-4 text-right">{t('admin.walletsDetail.table.amount')}</TableHead>
                                                <TableHead className="text-sm font-semibold uppercase text-muted-foreground py-4 pr-6">{t('admin.walletsDetail.table.date')}</TableHead>
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
                                    <p className="text-muted-foreground font-semibold uppercase text-xs">{t('admin.walletsDetail.emptyTransactions')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
