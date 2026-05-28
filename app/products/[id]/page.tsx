'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sprout, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProductDetail from '@/components/products/ProductDetail';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Product } from '@/types';
import { notify } from '@/lib/notify';
import { useProduct } from '@/contexts/ProductContext';

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ProductSkeleton() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image */}
                <div className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-800" />
                {/* Info */}
                <div className="space-y-4">
                    <div className="h-8 w-3/4 rounded-xl bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-800" />
                    <div className="h-6 w-1/2 rounded-lg bg-gray-200 dark:bg-gray-800" />
                    <div className="space-y-2 mt-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-4 rounded-lg bg-gray-200 dark:bg-gray-800" />
                        ))}
                    </div>
                    <div className="h-12 rounded-xl bg-gray-200 dark:bg-gray-800 mt-6" />
                </div>
            </div>
        </div>
    );
}

// ── Error state ───────────────────────────────────────────────────────────────

function ProductError({ message, onBack }: { message: string; onBack: () => void }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
                    <Sprout size={28} className="text-red-400" />
                </div>
                <h1 className="text-xl font-bold text-foreground mb-2">Product not found</h1>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{message}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center gap-2 h-10 px-5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <ArrowLeft size={15} /> Go back
                    </button>
                    <Link
                        href="/products"
                        className="flex items-center justify-center gap-2 h-10 px-5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors">
                        Browse products
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { t } = useI18n();
    const { fetchProductById } = useProduct();
    const productId = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

    // ── Load saved products from localStorage ─────────────────────────────

    useEffect(() => {
        try {
            const raw = localStorage.getItem('savedProducts');
            if (raw) setSavedIds(new Set(JSON.parse(raw)));
        } catch {
            // ignore parse errors
        }
    }, []);

    // ── Fetch product ─────────────────────────────────────────────────────

    useEffect(() => {
        if (!productId) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchProductById(productId);
                setProduct(res);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError('This product could not be found or may have been removed.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [productId]);

    // ── Handlers ──────────────────────────────────────────────────────────

    const handleSave = (id: string) => {
        setSavedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                notify.success('Removed from saved');
            } else {
                next.add(id);
                notify.success(`${product?.name} saved`);
            }
            try {
                localStorage.setItem('savedProducts', JSON.stringify([...next]));
            } catch {
                // ignore storage errors
            }
            return next;
        });
    };

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: product?.name,
                text: product?.description,
                url,
            }).catch(() => null);
        } else {
            navigator.clipboard.writeText(url).then(() => {
                notify.success('Link copied to clipboard');
            }).catch(() => {
                notify.error('Could not copy link');
            });
        }
    };

    // ── Render ────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

            {/* Sticky breadcrumb bar */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-11 flex items-center justify-between">
                    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
                        {product && (
                            <>
                                <span>/</span>
                                <span className="text-foreground font-medium truncate max-w-[160px]">
                                    {product.name}
                                </span>
                            </>
                        )}
                    </nav>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft size={13} /> Back
                        </button>
                        {product && (
                            <button
                                onClick={handleShare}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <Share2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="pt-4 pb-16">
                {loading ? (
                    <ProductSkeleton />
                ) : error || !product ? (
                    <ProductError
                        message={error ?? 'Product not found'}
                        onBack={() => router.back()}
                    />
                ) : (
                    <ProductDetail
                        product={product}
                        onSaveProduct={handleSave}
                        onShareProduct={handleShare}
                        isSaved={savedIds.has(product.id)}
                        showActions={true}
                    />
                )}
            </main>
        </div>
    );
}