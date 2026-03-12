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
    <div className='bg-background min-h-screen pb-12'>
      <Navbar />
      <main className="w-full">
        <div className="container mx-auto px-4 pt-32 pb-12">
          <header className="mb-14 text-center space-y-5 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tight max-w-4xl mx-auto leading-tight">
              {t('landing.hero.title') || 'Fresh from the Farm to Your Table'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              {t('landing.hero.subtitle') || 'Connecting Rwanda\'s farmers directly with buyers for a sustainable future.'}
            </p>
          </header>
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
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
        </div>
        <Footer />
      </main>
    </div>
  );
}