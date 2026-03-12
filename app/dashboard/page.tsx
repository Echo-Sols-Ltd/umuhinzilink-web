'use client'

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useProduct } from '@/contexts/ProductContext';
import { ProductDisplay } from '@/components/products/ProductDisplay';
import { useI18n } from '@/contexts/I18nContext';

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useI18n()
  const { 
    buyerProducts, 
    fetchBuyerProducts, 
    loading, 
    buyerProductsTotalPages 
  } = useProduct()
  
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchBuyerProducts(currentPage - 1, 10)
  }, [currentPage])

  return (
    <div className='bg-background overflow-hidden h-screen'>
      <main className="bg-background overflow-auto h-full">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <header className="mb-10 text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              {t('landing.hero.title') || 'Fresh from the Farm to Your Table'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.hero.subtitle') || 'Connecting Rwanda\'s farmers directly with buyers for a sustainable future.'}
            </p>
          </header>

          <ProductDisplay 
            products={buyerProducts || []}
            loading={loading}
            currentPage={currentPage}
            totalPages={buyerProductsTotalPages}
            onPageChange={setCurrentPage}
            search={search}
            onSearchChange={setSearch}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
        <Footer />
      </main>
    </div>
  );
}