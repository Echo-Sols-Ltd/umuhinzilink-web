'use client';

import React, { useState, useMemo } from 'react';
import {
    Bell,
    CheckCircle,
    AlertCircle,
    Info,
    X,
    Search,
    Filter,
    Trash2,
    MoreVertical,
    Clock,
    Check
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { UserType } from '@/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationsPage() {
    const { user } = useAuth();
    const {
        notifications,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll
    } = useNotification();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');

    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => {
            const matchesSearch =
                n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.message.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                filterType === 'ALL' ||
                (filterType === 'UNREAD' && !n.isRead) ||
                (filterType === 'READ' && n.isRead);

            return matchesSearch && matchesFilter;
        });
    }, [notifications, searchTerm, filterType]);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'WARNING':
                return <AlertCircle className="w-5 h-5 text-amber-500" />;
            case 'ERROR':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getTypeVariant = (type: string): "success" | "warning" | "destructive" | "info" | "secondary" => {
        switch (type) {
            case 'SUCCESS': return 'success';
            case 'WARNING': return 'warning';
            case 'ERROR': return 'destructive';
            case 'INFO': return 'info';
            default: return 'secondary';
        }
    };

    if (!user) return null;

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <Sidebar userType={user.role as UserType} activeItem="Notifications" />

            <main className="flex-1 overflow-auto bg-gray-50/30">
                <div className="p-8 max-w-5xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                            <p className="text-sm text-gray-500 mt-1">Stay updated with important system alerts and updates</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={markAllAsRead}
                                disabled={loading || notifications.length === 0}
                                className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm text-xs font-semibold text-gray-600 disabled:opacity-50"
                            >
                                Mark all as read
                            </button>
                            <button
                                onClick={clearAll}
                                disabled={loading || notifications.length === 0}
                                className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all shadow-sm disabled:opacity-50"
                                title="Clear All"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </div>
                        <div className="flex items-center gap-1 p-1 bg-gray-50/50 rounded-xl border border-gray-100">
                            {(['ALL', 'UNREAD', 'READ'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType === type
                                        ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-3">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                                    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-1/4" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                            ))
                        ) : filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`group relative p-5 rounded-2xl border transition-all duration-200 hover:shadow-md flex gap-4 ${notification.isRead
                                        ? 'bg-white border-gray-100'
                                        : 'bg-green-50/30 border-green-100 shadow-sm'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${notification.isRead ? 'bg-gray-50' : 'bg-white shadow-sm'
                                        }`}>
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`font-semibold text-base ${notification.isRead ? 'text-gray-700' : 'text-gray-900'
                                                    }`}>
                                                    {notification.title}
                                                </h3>
                                                <Badge variant={getTypeVariant(notification.type)} className="text-[10px] px-2 py-0 rounded-md font-medium uppercase tracking-wider">
                                                    {notification.type}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                {format(new Date(notification.timestamp), 'MMM d, h:mm a')}
                                            </div>
                                        </div>
                                        <p className={`text-sm leading-normal ${notification.isRead ? 'text-gray-500' : 'text-gray-600'
                                            }`}>
                                            {notification.message}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                title="Mark as read"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Bell className="w-10 h-10 text-gray-200" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">All caught up!</h3>
                                <p className="text-gray-500 text-sm">
                                    {searchTerm || filterType !== 'ALL'
                                        ? 'No notifications match your search.'
                                        : 'You have no new notifications at the moment.'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
