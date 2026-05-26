'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutGrid,
    List,
    X,
    Filter,
} from 'lucide-react';
import { notify } from '@/lib/notify';
import Sidebar from '@/components/shared/Sidebar';
import { Product, UserRole } from '@/types';
import { useProduct } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import { MessageType } from '@/types';
import { ProductDisplay } from '@/components/products/ProductDisplay';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { ResponsiveLayout } from '@/components/ui/responsive-layout';
import { useUser } from '@/contexts/UserContext';

const Logo = () => (
    <span className="font-extrabold text-2xl ">
        <span className="text-green-700">Umuhinzi</span>
        <span className="text-foreground">Link</span>
    </span>
);

export default function ProductsPage() {
    const router = useRouter();
    const { user: buyer } = useAuth();
    const { t } = useI18n();
    const { marketplaceProducts: products, loading: productsLoading } = useProduct();
    const [isPurchasing, setIsPurchasing] = useState(false);

    // State for filters and search
    const [search, setSearch] = useState('');
    const [cropFilter, setCropFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [locationFilter, setLocationFilter] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [savedSearches, setSavedSearches] = useState<string[]>([]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = products || [];

        // Search filter
        if (search) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Category filter
        if (categoryFilter) {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }

        // Location filter
        if (locationFilter) {
            filtered = filtered.filter(product =>
                product.district?.toLowerCase().includes(locationFilter.toLowerCase())
            );
        }

        // Price range filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            filtered = filtered.filter(product => {
                const price = Number(product.unitPrice);
                const minOk = minPrice === undefined || price >= minPrice;
                const maxOk = maxPrice === undefined || price <= maxPrice;
                return minOk && maxOk;
            });
        }

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return Number(a.unitPrice) - Number(b.unitPrice);
                case 'price-high':
                    return Number(b.unitPrice) - Number(a.unitPrice);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'newest':
                default:
                    return 0;
            }
        });

        return filtered;
    }, [products, search, categoryFilter, locationFilter, minPrice, maxPrice, sortBy]);

    // Pagination
    const itemsPerPage = 12;
    const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts?.slice(startIndex, endIndex) || [];

    const handleContactFarmer = async (product: Product) => {
        if (!buyer) {
            notify.error(t('marketplace.toasts.authRequired.body'), t('marketplace.toasts.authRequired.title'));
            return;
        }

        if (!product.owner) {
            notify.error(t('marketplace.toasts.farmerNotAvailable.body'), t('marketplace.toasts.farmerNotAvailable.title'));
            return;
        }


    };

    const clearFilters = () => {
        setSearch('');
        setCropFilter('all');
        setCategoryFilter('');
        setLocationFilter('');
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setCurrentPage(1);
    };

    const handleSearch = () => {
        setCurrentPage(1);
    };

    const header = (
        <div className="bg-card shadow-sm border-b border-border px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-semibold text-foreground">{t('marketplace.title')}</h1>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{t('marketplace.tagline')}</span>
                        <div className="w-2 h-2 bg-success rounded-full mr-2" />
                        <span className="font-medium">{t('marketplace.verifiedFarmers')}</span>
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        {t('marketplace.filters')}
                    </Button>
                </div>
            </div>
        </div>
    );


    return (
        <ResponsiveLayout  header={header}>
            <div className="space-y-6">
                {/* Search and Filters */}
                <ProductDisplay
                    products={paginatedProducts}
                    loading={productsLoading}
                    viewMode={viewMode}
                    showFilters={showFilters}
                    showSearch={true}
                    showPagination={true}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onViewModeChange={setViewMode}
                    onSearchChange={setSearch}
                    onFilterChange={(filters) => {
                        if ('category' in filters) setCategoryFilter(filters.category);
                        if ('location' in filters) setLocationFilter(filters.location);
                    }}
                    onProductSelect={(product) => {
                        router.push(`/buyer/products/${product.id}`);
                    }}
                    onProductPurchase={(product) => {
                        router.push(`/buyer/products/${product.id}`);
                    }}
                    onProductContact={handleContactFarmer}
                    selectedCategory={categoryFilter}
                    selectedLocation={locationFilter}
                    search={search}
                />
            </div>
        </ResponsiveLayout>
    );
}