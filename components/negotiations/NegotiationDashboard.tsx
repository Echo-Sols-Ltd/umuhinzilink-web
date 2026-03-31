'use client';

import React, { useState, useMemo } from 'react';
import { Negotiation, NegotiationStatus } from '@/types';
import { useNegotiation } from '@/contexts/NegotiationContext';
import { useCart } from '@/contexts/CartContext';
import NegotiationCard from './NegotiationCard';
import { NegotiationLastUpdated } from './NegotiationLastUpdated';
import { 
  MessageCircle, 
  Filter, 
  Search, 
  RefreshCw,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShoppingCart,
  Grid3X3,
  List
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NegotiationDashboardProps {
  userType?: 'buyer' | 'seller';
  onChatOpen?: (negotiationId: string) => void;
  showCartConnections?: boolean;
}

export default function NegotiationDashboard({
  onChatOpen,
  showCartConnections = true
}: NegotiationDashboardProps) {
  const { 
    negotiations, 
    loading, 
    error, 
    refreshNegotiations,
    getNegotiationsByStatus,
    hasActiveNegotiations
  } = useNegotiation();
  
  const { cart } = useCart();
  const {user} = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<NegotiationStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'expiresAt'>('createdAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedNegotiations, setSelectedNegotiations] = useState<string[]>([]);

  // Check if negotiation is in cart
  const isNegotiationInCart = (negotiationId: string) => {
    return cart?.items.some(item => item.negotiationId === negotiationId);
  };

  // Get cart item for negotiation
  const getCartItemForNegotiation = (negotiationId: string) => {
    return cart?.items.find(item => item.negotiationId === negotiationId);
  };

  // Handle selection for bulk actions
  const handleSelectNegotiation = (negotiationId: string, selected: boolean) => {
    setSelectedNegotiations(prev => 
      selected 
        ? [...prev, negotiationId]
        : prev.filter(id => id !== negotiationId)
    );
  };

  const handleSelectAll = () => {
    if (selectedNegotiations.length === filteredNegotiations.length) {
      setSelectedNegotiations([]);
    } else {
      setSelectedNegotiations(filteredNegotiations.map(n => n.id));
    }
  };

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

  // Get cart connection stats
  const getCartStats = () => {
    const inCart = negotiations.filter(n => isNegotiationInCart(n.id)).length;
    const notInCart = negotiations.length - inCart;
    return { inCart, notInCart };
  };

  const statusCounts = getStatusCounts();
  const cartStats = getCartStats();

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">
            {user?.role === 'BUYER' ? 'My Negotiations' : 'Sales Negotiations'}
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {negotiations.length} Active Threads • Real-time Updates Enabled
          </p>
          <NegotiationLastUpdated compact={true} className="mt-1" />
        </div>
        
        <button
          onClick={refreshNegotiations}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all disabled:opacity-50 font-bold text-xs uppercase tracking-widest text-gray-600 active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Sync Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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

        {showCartConnections && (
          <>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">In Cart</p>
                  <p className="text-xl font-bold text-gray-900">{cartStats.inCart}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Grid3X3 className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Selected</p>
                  <p className="text-xl font-bold text-gray-900">{selectedNegotiations.length}</p>
                </div>
              </div>
            </div>
          </>
        )}
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

        {/* Sort Options and View Controls */}
        <div className="flex items-center justify-between">
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

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Grid View"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNegotiations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-800">
              {selectedNegotiations.length} negotiation{selectedNegotiations.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleSelectAll}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              {selectedNegotiations.length === filteredNegotiations.length ? 'Clear all' : 'Select all'}
            </button>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              Message All
            </button>
            <button 
              onClick={() => setSelectedNegotiations([])}
              className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

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
        <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
          {filteredNegotiations.map((negotiation) => {
            const isInCart = isNegotiationInCart(negotiation.id);
            const isSelected = selectedNegotiations.includes(negotiation.id);
            
            return (
              <div key={negotiation.id} className="relative">
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleSelectNegotiation(negotiation.id, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                </div>
                
                <NegotiationCard
                  negotiation={negotiation}
                  userType={user?.role==='BUYER'?'buyer':'seller'}
                  showProgress={true}
                  isInCart={isInCart}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
