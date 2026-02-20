'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Bell,
    CheckCircle,
    AlertCircle,
    Info,
    MessageSquare,
    User,
    Users,
    ShieldAlert,
    Cpu,
    Trash2,
    Check,
    Search,
    Clock,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    X,
    ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { UserType } from '@/types';
import { Notification, NotificationType } from '@/types/notification';
import { format, formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const PAGE_SIZE = 15;

type TabValue = 'ALL' | 'UNREAD' | NotificationType;

const TABS: { value: TabValue; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'UNREAD', label: 'Unread' },
    { value: 'SUCCESS', label: 'Success' },
    { value: 'MESSAGE', label: 'Messages' },
    { value: 'WARNING', label: 'Warnings' },
    { value: 'ERROR', label: 'Errors' },
    { value: 'SYSTEM_INFO', label: 'System' },
    { value: 'INFO', label: 'Info' },
];

const TYPE_META: Record<NotificationType, {
    icon: React.ReactNode;
    iconBg: string;
    dot: string;
    badge: string;
}> = {
    SUCCESS: { icon: <CheckCircle className="w-5 h-5" />, iconBg: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500', badge: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    ERROR: { icon: <AlertCircle className="w-5 h-5" />, iconBg: 'bg-red-50 text-red-600', dot: 'bg-red-500', badge: 'text-red-700 bg-red-50 border-red-200' },
    SYSTEM_ERROR: { icon: <AlertCircle className="w-5 h-5" />, iconBg: 'bg-red-50 text-red-600', dot: 'bg-red-500', badge: 'text-red-700 bg-red-50 border-red-200' },
    WARNING: { icon: <AlertCircle className="w-5 h-5" />, iconBg: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500', badge: 'text-amber-700 bg-amber-50 border-amber-200' },
    SYSTEM_WARNING: { icon: <ShieldAlert className="w-5 h-5" />, iconBg: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500', badge: 'text-amber-700 bg-amber-50 border-amber-200' },
    INFO: { icon: <Info className="w-5 h-5" />, iconBg: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500', badge: 'text-blue-700 bg-blue-50 border-blue-200' },
    SYSTEM_INFO: { icon: <Cpu className="w-5 h-5" />, iconBg: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500', badge: 'text-blue-700 bg-blue-50 border-blue-200' },
    MESSAGE: { icon: <MessageSquare className="w-5 h-5" />, iconBg: 'bg-violet-50 text-violet-600', dot: 'bg-violet-500', badge: 'text-violet-700 bg-violet-50 border-violet-200' },
    USER_UPDATE: { icon: <User className="w-5 h-5" />, iconBg: 'bg-teal-50 text-teal-600', dot: 'bg-teal-500', badge: 'text-teal-700 bg-teal-50 border-teal-200' },
    GROUP_UPDATE: { icon: <Users className="w-5 h-5" />, iconBg: 'bg-sky-50 text-sky-600', dot: 'bg-sky-500', badge: 'text-sky-700 bg-sky-50 border-sky-200' },
};

function resolveAction(n: Notification, role: string): { label: string; href: string } | null {
    const r = role.toLowerCase();
    const text = (n.title + ' ' + n.message).toLowerCase();

    if (n.type === 'MESSAGE') {
        return { label: 'Open chat', href: '/chat' };
    }
    if (n.type === 'USER_UPDATE') {
        const profileHref =
            r === 'farmer' ? '/farmer/profile' :
                r === 'buyer' ? '/buyer/profile' :
                    r === 'supplier' ? '/supplier/profile' :
                        r === 'government' ? '/government/profile' : null;
        return profileHref ? { label: 'View profile', href: profileHref } : null;
    }
    if (text.includes('order')) {
        const ordersHref =
            r === 'farmer' ? '/farmer/orders' :
                r === 'buyer' ? '/buyer/purchases' :
                    r === 'supplier' ? '/supplier/orders' :
                        r === 'admin' ? '/admin/orders' : null;
        return ordersHref ? { label: 'View orders', href: ordersHref } : null;
    }
    if (text.includes('product') || text.includes('input')) {
        const productsHref =
            r === 'farmer' ? '/farmer/products' :
                r === 'buyer' ? '/buyer/product' :
                    r === 'supplier' ? '/supplier/products' :
                        r === 'admin' ? '/admin/products' : null;
        return productsHref ? { label: 'View products', href: productsHref } : null;
    }
    if (text.includes('delivery') || text.includes('shipped')) {
        const deliveryHref =
            r === 'farmer' ? '/farmer/delivery' :
                r === 'buyer' ? '/buyer/delivery' : null;
        return deliveryHref ? { label: 'Track delivery', href: deliveryHref } : null;
    }
    if (text.includes('wallet') || text.includes('payment')) {
        const walletHref =
            r === 'farmer' ? '/farmer/wallet' :
                r === 'buyer' ? '/buyer/wallet' : null;
        return walletHref ? { label: 'View wallet', href: walletHref } : null;
    }
    if (text.includes('request')) {
        const requestHref =
            r === 'farmer' ? '/farmer/requests' :
                r === 'supplier' ? '/supplier/requests' : null;
        return requestHref ? { label: 'View requests', href: requestHref } : null;
    }
    if ((n.type === 'SYSTEM_INFO' || n.type === 'SYSTEM_WARNING' || n.type === 'SYSTEM_ERROR') && r === 'admin') {
        return { label: 'Go to admin', href: '/admin/dashboard' };
    }
    return null;
}

export default function NotificationsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const {
        notifications,
        unreadCount,
        totalElements,
        totalPages,
        currentPage,
        loading,
        fetchAll,
        fetchByType,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotification();

    const [activeTab, setActiveTab] = useState<TabValue>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);

    const load = useCallback(async (tab: TabValue, p: number) => {
        const params = { page: p, size: PAGE_SIZE };
        if (tab === 'ALL' || tab === 'UNREAD') {
            await fetchAll(params);
        } else {
            await fetchByType(tab as NotificationType, params);
        }
    }, [fetchAll, fetchByType]);

    useEffect(() => {
        load(activeTab, page);
    }, [activeTab, page]); // eslint-disable-line react-hooks/exhaustive-deps

    const visible = useMemo(() =>
        notifications.filter(n => {
            const matchesRead = activeTab !== 'UNREAD' || !n.isRead;
            const matchesSearch = !searchTerm ||
                n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.message.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesRead && matchesSearch;
        }),
        [notifications, activeTab, searchTerm]
    );

    const handleTabChange = (tab: TabValue) => {
        setActiveTab(tab);
        setPage(0);
        setSearchTerm('');
    };

    const handleAction = (n: Notification) => {
        if (!n.isRead) markAsRead(n.id);
        const action = resolveAction(n, user?.role ?? '');
        if (action) router.push(action.href);
    };

    if (!user) return null;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar userType={user.role as UserType} activeItem="Notifications" />

            <main className="flex-1 overflow-auto">
                <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-600/10 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 leading-tight">Notifications</h1>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {unreadCount > 0
                                        ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                                        : "You're all caught up!"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => load(activeTab, page)}
                                disabled={loading}
                                title="Refresh"
                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-lg border border-gray-200 transition-all disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={markAllAsRead}
                                disabled={loading || unreadCount === 0}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-all disabled:opacity-40 shadow-sm flex items-center gap-1.5"
                            >
                                <Check className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

                        <div className="flex items-center overflow-x-auto border-b border-gray-100 px-4 scrollbar-hide">
                            {TABS.map(tab => (
                                <button
                                    key={tab.value}
                                    onClick={() => handleTabChange(tab.value)}
                                    className={`relative shrink-0 px-4 py-3.5 text-xs font-semibold transition-colors
                                        ${activeTab === tab.value
                                            ? 'text-green-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600 after:rounded-t'
                                            : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    {tab.label}
                                    {tab.value === 'UNREAD' && unreadCount > 0 && (
                                        <span className="ml-1.5 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="px-4 py-3 border-b border-gray-50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search notifications…"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2 bg-gray-50 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 border border-transparent focus:border-green-300 focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4">
                                        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                                        <div className="flex-1 space-y-2 py-1">
                                            <Skeleton className="h-3.5 w-1/3" />
                                            <Skeleton className="h-3 w-2/3" />
                                        </div>
                                        <Skeleton className="h-3 w-16 mt-1" />
                                    </div>
                                ))
                            ) : visible.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                                        <Bell className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700">
                                        {searchTerm
                                            ? 'No results found'
                                            : activeTab === 'UNREAD'
                                                ? 'No unread notifications'
                                                : 'No notifications yet'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {searchTerm ? 'Try a different search term' : 'Check back later'}
                                    </p>
                                </div>
                            ) : (
                                visible.map(n => {
                                    const meta = TYPE_META[n.type] ?? TYPE_META.INFO;
                                    const action = resolveAction(n, user.role);
                                    return (
                                        <div
                                            key={n.id}
                                            className={`group relative flex gap-3.5 px-4 py-4 transition-colors
                                                ${n.isRead ? 'hover:bg-gray-50/60' : 'bg-green-50/40 hover:bg-green-50/70'}`}
                                        >
                                            {!n.isRead && (
                                                <span className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                            )}

                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.iconBg}`}>
                                                {meta.icon}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`text-sm font-semibold ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                                            {n.title}
                                                        </span>
                                                        <span className={`inline-flex items-center border text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.badge}`}>
                                                            {n.type.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="flex items-center gap-1 text-[11px] text-gray-400 shrink-0"
                                                        title={format(new Date(n.timestamp), 'PPpp')}
                                                    >
                                                        <Clock className="w-3 h-3" />
                                                        {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                                                    </div>
                                                </div>
                                                <p className={`text-sm mt-0.5 leading-relaxed ${n.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                                                    {n.message}
                                                </p>

                                                {action && (
                                                    <button
                                                        onClick={() => handleAction(n)}
                                                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
                                                    >
                                                        {action.label}
                                                        <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1 self-start pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                {!n.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(n.id)}
                                                        title="Mark as read"
                                                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(n.id)}
                                                    title="Delete"
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {!loading && totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/40">
                                <span className="text-xs text-gray-500">
                                    Page {currentPage + 1} of {totalPages}
                                    <span className="text-gray-400 ml-1">({totalElements} total)</span>
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        disabled={page === 0}
                                        onClick={() => setPage(p => p - 1)}
                                        className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-white transition-all disabled:opacity-40"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        disabled={page >= totalPages - 1}
                                        onClick={() => setPage(p => p + 1)}
                                        className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-white transition-all disabled:opacity-40"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
