'use client';

import React, { useState, useMemo } from 'react';
import { Negotiation, NegotiationStatus } from '@/types';
import { useNegotiation } from '@/contexts/NegotiationContext';
import NegotiationCard from './NegotiationCard';
import { 
  MessageCircle, 
  Filter, 
  Search, 
  RefreshCw,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface NegotiationDashboardProps {
  userType?: 'buyer' | 'seller';
  onChatOpen?: (negotiationId: string) => void;
}

export default function NegotiationDashboard({ 
  userType = 'buyer', 
  onChatOpen 
}: NegotiationDashboardProps) {
  const { 
    negotiations, 
    loading, 
    error, 
    refreshNegotiations,
    getNegotiationsByStatus,
    hasActiveNegotiations
  } = useNegotiation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<NegotiationStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'expiresAt'>('createdAt');

  // Filter and sort negotiations
  const filteredNegotiations = useMemo(() => {
    let filtered = negotiations;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = getNegotiationsByStatus(statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a[sortBy]);
      const dateB = new Date(b[sortBy]);
      return dateB.getTime() - dateA.getTime();
    });

    return filtered;
  }, [negotiations, searchTerm, statusFilter, sortBy, getNegotiationsByStatus]);

  // Status options for filter
  const statusOptions = [
    { value: 'all' as const, label: 'All Negotiations', icon: Filter },
    { value: NegotiationStatus.PENDING, label: 'Pending', icon: Clock },
    { value: NegotiationStatus.COUNTERED, label: 'Countered', icon: TrendingUp },
    { value: NegotiationStatus.ACCEPTED, label: 'Accepted', icon: CheckCircle },
    { value: NegotiationStatus.REJECTED, label: 'Rejected', icon: XCircle },
    { value: NegotiationStatus.EXPIRED, label: 'Expired', icon: AlertCircle },
  ];

  // Get status counts
  const getStatusCounts = () => {
    const counts = {
      all: negotiations.length,
      [NegotiationStatus.PENDING]: getNegotiationsByStatus(NegotiationStatus.PENDING).length,
      [NegotiationStatus.COUNTERED]: getNegotiationsByStatus(NegotiationStatus.COUNTERED).length,
      [NegotiationStatus.ACCEPTED]: getNegotiationsByStatus(NegotiationStatus.ACCEPTED).length,
      [NegotiationStatus.REJECTED]: getNegotiationsByStatus(NegotiationStatus.REJECTED).length,
      [NegotiationStatus.EXPIRED]: getNegotiationsByStatus(NegotiationStatus.EXPIRED).length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading && negotiations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Negotiations</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refreshNegotiations}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {userType === 'buyer' ? 'My Negotiations' : 'Seller Negotiations'}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track your price negotiations
          </p>
        </div>
        
        <button
          onClick={refreshNegotiations}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{statusCounts.all}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">{statusCounts[NegotiationStatus.PENDING]}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Countered</p>
              <p className="text-xl font-bold text-gray-900">{statusCounts[NegotiationStatus.COUNTERED]}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-xl font-bold text-gray-900">{statusCounts[NegotiationStatus.ACCEPTED]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search negotiations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              const count = statusCounts[option.value as keyof typeof statusCounts] || 0;
              
              return (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value as NegotiationStatus | 'all')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    statusFilter === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('createdAt')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                sortBy === 'createdAt'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-gray-100'
              }`}
            >
              Created Date
            </button>
            <button
              onClick={() => setSortBy('expiresAt')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                sortBy === 'expiresAt'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-gray-100'
              }`}
            >
              Expiry Date
            </button>
          </div>
        </div>
      </div>

      {/* Negotiations List */}
      {filteredNegotiations.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' 
              ? 'No matching negotiations found' 
              : 'No negotiations yet'
            }
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'Start negotiating prices on products to see them here'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNegotiations.map((negotiation) => (
            <NegotiationCard
              key={negotiation.id}
              negotiation={negotiation}
              userType={userType}
              onChatOpen={onChatOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
