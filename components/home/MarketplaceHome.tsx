'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from '@/lib/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import ProductCard from '@/components/products/ProductCard';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhoWeServe from '@/components/WhoWeServe';
import PlatformFeatures from '@/components/PlatformFeatures';
import HowItWorks from '@/components/HowItWorks';
import ImpactStories from '@/components/ImpactStories';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import HomeScrollAnchor from '@/components/home/HomeScrollAnchor';
import PageLoading, { ProductGridSkeleton } from '@/components/layout/PageLoading';
import { getDashboardRoute, ROUTES } from '@/lib/routes';

export default function MarketplaceHome() {
  const { products, loading } = useProduct();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && user) {
      router.replace(getDashboardRoute(user.role));
    }
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading || (isAuthenticated && user)) {
    return (
      <PageLoading
        label="Taking you to your dashboard"
        description="Redirecting to your workspace…"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <HomeScrollAnchor />
      <Navbar />
      <Hero />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 lg:py-16 flex-1">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">Latest listings</h2>
            <p className="text-sm text-muted-foreground mt-1">Fresh produce and farm supplies from Rwandan sellers</p>
          </div>
          <Link
            href={ROUTES.products}
            className="hidden sm:inline-flex items-center gap-2 h-9 px-4 text-sm font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors shrink-0"
          >
            Browse all
            <ArrowRight size={14} />
          </Link>
        </div>

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

        <div className="sm:hidden mt-6">
          <Link
            href={ROUTES.products}
            className="inline-flex w-full items-center justify-center gap-2 h-11 text-sm font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Browse all products
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <section id="who" className="section-fade-up section-delay-2">
        <WhoWeServe />
      </section>
      <section id="features" className="section-fade-up section-delay-2">
        <PlatformFeatures />
      </section>
      <section id="agribusiness" className="section-fade-up section-delay-3">
        <HowItWorks />
      </section>
      <section id="lenders" className="section-fade-up section-delay-4">
        <ImpactStories />
      </section>
      <section id="contact" className="section-fade-up section-delay-5">
        <CallToAction />
        <Footer />
      </section>
    </div>
  );
}
