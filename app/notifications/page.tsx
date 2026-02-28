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
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { UserType } from '@/types';
import { NotificationType } from '@/types/notification';
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 15;

// Type tabs: 'ALL' + the types that make sense to surface separately
type TabValue = 'ALL' | 'UNREAD' | NotificationType;

const TABS: { value: TabValue; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'UNREAD', label: 'Unread' },
    { value: NotificationType.SUCCESS, label: 'Success' },
    { value: NotificationType.MESSAGE, label: 'Messages' },
    { value: NotificationType.WARNING, label: 'Warnings' },
    { value: NotificationType.ERROR, label: 'Errors' },
    { value: NotificationType.SYSTEM_INFO, label: 'System' },
    { value: NotificationType.INFO, label: 'Info' },
];

// ─── Icon / colour helpers ────────────────────────────────────────────────────
const TYPE_META: Record<NotificationType, { icon: React.ReactNode; dot: string; badge: string }> = {
    [NotificationType.SUCCESS]: { icon: <CheckCircle className="w-5 h-5" />, dot: 'bg-emerald-500', badge: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    [NotificationType.ERROR]: { icon: <AlertCircle className="w-5 h-5" />, dot: 'bg-red-500', badge: 'text-red-700 bg-red-50 border-red-200' },
    [NotificationType.SYSTEM_ERROR]: { icon: <AlertCircle className="w-5 h-5" />, dot: 'bg-red-500', badge: 'text-red-700 bg-red-50 border-red-200' },
    [NotificationType.WARNING]: { icon: <AlertCircle className="w-5 h-5" />, dot: 'bg-amber-500', badge: 'text-amber-700 bg-amber-50 border-amber-200' },
    [NotificationType.SYSTEM_WARNING]: { icon: <ShieldAlert className="w-5 h-5" />, dot: 'bg-amber-500', badge: 'text-amber-700 bg-amber-50 border-amber-200' },
    [NotificationType.INFO]: { icon: <Info className="w-5 h-5" />, dot: 'bg-blue-500', badge: 'text-blue-700 bg-blue-50 border-blue-200' },
    [NotificationType.SYSTEM_INFO]: { icon: <Cpu className="w-5 h-5" />, dot: 'bg-blue-500', badge: 'text-blue-700 bg-blue-50 border-blue-200' },
    [NotificationType.MESSAGE]: { icon: <MessageSquare className="w-5 h-5" />, dot: 'bg-violet-500', badge: 'text-violet-700 bg-violet-50 border-violet-200' },
    [NotificationType.USER_UPDATE]: { icon: <User className="w-5 h-5" />, dot: 'bg-teal-500', badge: 'text-teal-700 bg-teal-50 border-teal-200' },
    [NotificationType.GROUP_UPDATE]: { icon: <Users className="w-5 h-5" />, dot: 'bg-sky-500', badge: 'text-sky-700 bg-sky-50 border-sky-200' },
};

const iconBgClass: Record<NotificationType | string, string> = {
    [NotificationType.SUCCESS]: 'bg-emerald-50 text-emerald-600',
    [NotificationType.ERROR]: 'bg-red-50 text-red-600',
    [NotificationType.SYSTEM_ERROR]: 'bg-red-50 text-red-600',
    [NotificationType.WARNING]: 'bg-amber-50 text-amber-600',
    [NotificationType.SYSTEM_WARNING]: 'bg-amber-50 text-amber-600',
    [NotificationType.INFO]: 'bg-blue-50 text-blue-600',
    [NotificationType.SYSTEM_INFO]: 'bg-blue-50 text-blue-600',
    [NotificationType.MESSAGE]: 'bg-violet-50 text-violet-600',
    [NotificationType.USER_UPDATE]: 'bg-teal-50 text-teal-600',
    [NotificationType.GROUP_UPDATE]: 'bg-sky-50 text-sky-600',
};

function NotificationIcon({ type }: { type: NotificationType }) {
    const meta = TYPE_META[type] ?? TYPE_META.INFO;
    const bg = iconBgClass[type] ?? 'bg-card text-muted-foreground';
    return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
            {meta.icon}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
    const { user } = useAuth();
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

    // ── Load data when tab or page changes ────────────────────────────────────
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, page]);

    // ── Client-side filter: UNREAD tab + search ───────────────────────────────
    const visible = useMemo(() => {
        return notifications.filter(n => {
            const matchesRead = activeTab !== 'UNREAD' || !n.isRead;
            const matchesSearch = !searchTerm ||
                n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.message.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesRead && matchesSearch;
        });
    }, [notifications, activeTab, searchTerm]);

    const handleTabChange = (tab: TabValue) => {
        setActiveTab(tab);
        setPage(0);
        setSearchTerm('');
    };

    if (!user) return null;

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar userType={user.role as UserType} activeItem="Notifications" />

            <main className="flex-1 overflow-auto">
                <div className="p-6 lg:p-8 max-w-full space-y-6">

                    {/* ── Header ──────────────────────────────────────────── */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-600/10 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-foreground leading-tight">Notifications</h1>
                                <p className="text-xs text-muted-foreground mt-0.5">
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
                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-card rounded-lg border border-border transition-all disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={markAllAsRead}
                                disabled={loading || unreadCount === 0}
                                className="px-4 py-2 bg-card border border-border rounded-xl hover:bg-card text-xs font-semibold text-muted-foreground transition-all disabled:opacity-40 shadow-sm"
                            >
                                <span className="flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5" />
                                    Mark all read
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* ── Tab strip ────────────────────────────────────────── */}
                    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                        {/* Tabs */}
                        <div className="flex items-center gap-0 overflow-x-auto border-b border-border px-4 scrollbar-hide">
                            {TABS.map(tab => (
                                <button
                                    key={tab.value}
                                    onClick={() => handleTabChange(tab.value)}
                                    className={`
                                        relative shrink-0 px-4 py-3.5 text-xs font-semibold transition-colors
                                        ${activeTab === tab.value
                                            ? 'text-success after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-success after:rounded-t'
                                            : 'text-muted-foreground hover:text-foreground'
                                        }
                                    `}
                                >
                                    {tab.label}
                                    {tab.value === 'UNREAD' && unreadCount > 0 && (
                                        <span className="ml-1.5 bg-success text-primary-foreground text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Search bar */}
                        <div className="px-4 py-3 border-b border-border/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search notifications…"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2 bg-card rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-transparent focus:border-success/50 focus:bg-card focus:ring-2 focus:ring-success/20 outline-none transition-all"
                                />
                                {searchTerm && (
                                    <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ── List ──────────────────────────────────────────── */}
                        <div className="divide-y divide-border/50">
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
                                    <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mb-4">
                                        <Bell className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {searchTerm ? 'No results found' : activeTab === 'UNREAD' ? 'No unread notifications' : 'No notifications yet'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {searchTerm ? 'Try a different search term' : 'Check back later'}
                                    </p>
                                </div>
                            ) : (
                                visible.map(n => {
                                    const meta = TYPE_META[n.type] ?? TYPE_META.INFO;
                                    const bg = iconBgClass[n.type] ?? 'bg-white text-gray-500';
                                    return (
                                        <div
                                            key={n.id}
                                            className={`group relative flex gap-3.5 px-4 py-4 transition-colors ${n.isRead ? 'hover:bg-card/60' : 'bg-success/10 hover:bg-success/20'
                                                }`}
                                        >
                                            {/* Unread dot */}
                                            {!n.isRead && (
                                                <span className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                            )}

                                            {/* Icon */}
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                                                {meta.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`text-sm ${n.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                                                            {n.title}
                                                        </span>
                                                        <span className={`inline-flex items-center border text-[10px] font-semibold uppercase  px-2 py-0.5 rounded-full ${meta.badge}`}>
                                                            {n.type.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                                                        <Clock className="w-3 h-3" />
                                                        <span title={format(new Date(n.timestamp), 'PPpp')}>
                                                            {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className={`text-sm mt-0.5 leading-relaxed ${n.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                                                    {n.message}
                                                </p>
                                            </div>

                                            {/* Actions — visible on hover */}
                                            <div className="flex items-center gap-1 self-center  transition-opacity shrink-0">
                                                {!n.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(n.id)}
                                                        title="Mark as read"
                                                        className="text-muted-foreground hover:text-foreground transition-colors bg-success/10 rounded-lg transition-colors"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(n.id)}
                                                    title="Delete"
                                                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* ── Pagination ────────────────────────────────────── */}
                        {!loading && totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white/40">
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
