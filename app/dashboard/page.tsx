'use client';

import Link from 'next/link';
import { Sprout, ArrowRight } from 'lucide-react';
import { useProduct } from '@/contexts/ProductContext';
import { useI18n } from '@/contexts/I18nContext';
import ProductCard from '@/components/products/ProductCard';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import Footer from '@/components/Footer';
import { ProductGridSkeleton } from '@/components/layout/PageLoading';

export default function Home() {
  const { t } = useI18n();
  const { products, loading } = useProduct();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <AppLayout maxWidth="max-w-6xl" mainClassName="flex-1">
        <PageHeader
          title={`${t('landing.hero.title.line1')} ${t('landing.hero.title.highlight')}`}
          description={t('landing.hero.subtitle')}
          actions={
            <Link
              href="/products"
              className="inline-flex items-center gap-2 h-9 px-4 text-sm font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Browse all
              <ArrowRight size={14} />
            </Link>
          }
        />

        <div className="bg-green-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sprout size={20} />
              <span className="text-sm font-semibold text-green-100">UmuhinziLink marketplace</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
              Fresh produce &amp; farm supplies from Rwandan sellers
            </h2>
            <p className="text-sm text-green-100 mt-2 leading-relaxed">
              Buy directly from farmers and agri-suppliers. Negotiate prices or order instantly.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Link
                href="/products"
                className="h-10 px-5 flex items-center justify-center text-sm font-semibold rounded-xl bg-white text-green-700 hover:bg-green-50 transition-colors"
              >
                {t('landing.hero.cta.getStarted')}
              </Link>
              <Link
                href="/become-seller"
                className="h-10 px-5 flex items-center justify-center text-sm font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                Sell on UmuhinziLink
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-foreground mb-4">Latest listings</h2>
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : products.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-2xl border border-border">
              <p className="text-sm font-semibold text-foreground">No products yet</p>
              <p className="text-xs text-muted-foreground mt-1">Check back soon for new listings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 9).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </AppLayout>
      <Footer />
    </div>
  );
}
