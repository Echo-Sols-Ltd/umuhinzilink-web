'use client';

import React, { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, X, Search, Filter } from 'lucide-react';
import { GovernmentLayout } from '../components/GovernmentLayout';
import { GovernmentPages } from '@/types';
import GovernmentGuard from '@/contexts/guard/GovernmentGuard';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  read: boolean;
}

function GovernmentNotifications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'read' | 'unread'>('all');

  // Mock data - replace with actual API call
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Farm Registration',
      message: '5 new farmers have registered in the Northern Province.',
      type: 'info',
      date: '2024-01-15',
      read: false,
    },
    {
      id: '2',
      title: 'Produce Quality Alert',
      message: 'Quality inspection required for tomatoes in Kigali.',
      type: 'warning',
      date: '2024-01-14',
      read: true,
    },
    {
      id: '3',
      title: 'System Update Complete',
      message: 'The agricultural monitoring system has been successfully updated.',
      type: 'success',
      date: '2024-01-13',
      read: true,
    },
    {
      id: '4',
      title: 'Market Price Alert',
      message: 'Significant price drop detected for maize products.',
      type: 'error',
      date: '2024-01-12',
      read: false,
    },
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'read' && notification.read) ||
                         (filterType === 'unread' && !notification.read);
    return matchesSearch && matchesFilter;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <GovernmentLayout activePage={GovernmentPages.NOTIFICATIONS}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">
                Stay updated with important system alerts and updates
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    {unreadCount} unread
                  </span>
                )}
              </p>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium">
              Mark all as read
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'unread'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilterType('read')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'read'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Read
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  notification.read ? 'bg-white border-gray-200' : getNotificationBg(notification.type)
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {notification.date}
                        </span>
                      </div>
                      <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <button className="ml-4 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'You\'re all caught up! No new notifications.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
        </GovernmentLayout>
  );
}

export default function GovernmentNotificationsPage() {
  return (
    <GovernmentGuard>
      <GovernmentNotifications />
    </GovernmentGuard>
  );
}
