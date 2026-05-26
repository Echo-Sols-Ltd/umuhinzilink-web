'use client'

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { useProduct } from '@/contexts/ProductContext';
import { ProductDisplay } from '@/components/products/ProductDisplay';
import { useI18n } from '@/contexts/I18nContext';

export default function Home() {
  const { t } = useI18n()
  const {
    marketplaceProducts,
    fetchMarketplaceProducts,
    loading,
    marketplaceProductsTotalPages
  } = useProduct()

  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchMarketplaceProducts(currentPage - 1, 10)
  }, [currentPage, fetchMarketplaceProducts])

  return (
    <div className='bg-background h-screen pb-12 overflow-auto'>
      <Navbar />
      <main className="w-full">
        <div className="container mx-auto px-4 pt-32 pb-12">
          <header className="mb-14 text-center space-y-5 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tight max-w-4xl mx-auto leading-tight">
              {t('landing.hero.title.line1')} <span className="text-success">{t('landing.hero.title.highlight')}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              {t('landing.hero.subtitle')}
            </p>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <ProductDisplay
              products={marketplaceProducts || []}
              loading={loading}
              currentPage={currentPage}
              totalPages={marketplaceProductsTotalPages}
              onPageChange={setCurrentPage}
              search={search}
              onSearchChange={setSearch}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}