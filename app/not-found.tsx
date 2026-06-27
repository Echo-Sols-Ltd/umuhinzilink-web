"use client"

import Link from 'next/link';
import { useI18n } from '@/contexts/I18nContext';
import { Sprout, Home, ArrowLeft, Search, Wheat } from 'lucide-react';

export default function NotFound() {
    const { t } = useI18n();

    const helpfulLinks = [
        { label: t('pages.notFound.links.browseProducts'), href: '/products' },
        { label: t('pages.notFound.links.myNegotiations'), href: '/negotiations' },
        { label: t('pages.notFound.links.sellerDashboard'), href: '/seller/dashboard' },
        { label: t('pages.notFound.links.wallet'), href: '/wallet' },
        { label: t('pages.notFound.links.signIn'), href: '/auth/signin' },
    ];
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">

            {/* Background texture — subtle field rows */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 40px,
                        currentColor 40px,
                        currentColor 41px
                    )`,
                }}
            />

            {/* Decorative blobs */}
            <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-green-200 dark:bg-green-900 opacity-20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-24 w-80 h-80 rounded-full bg-green-100 dark:bg-green-950 opacity-20 blur-3xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 text-center max-w-md w-full">

                {/* Logo */}
                <Link href="/" className="inline-flex items-center gap-1.5 mb-12">
                    <Sprout size={20} className="text-green-600" />
                    <span className="text-lg font-extrabold">
                        <span className="text-green-600">Umuhinzi</span>
                        <span className="text-foreground">Link</span>
                    </span>
                </Link>

                {/* Illustration */}
                <div className="relative w-48 h-48 mx-auto mb-8">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-green-200 dark:border-green-800 animate-spin" style={{ animationDuration: '20s' }} />
                    {/* Inner circle */}
                    <div className="absolute inset-6 rounded-full bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900 flex items-center justify-center">
                        <div className="text-center">
                            {/* Wilting wheat icon area */}
                            <Wheat
                                size={48}
                                className="text-green-300 dark:text-green-700 mx-auto"
                                style={{ transform: 'rotate(-15deg)' }}
                            />
                        </div>
                    </div>
                    {/* 404 badge */}
                    <div className="absolute -top-2 -right-2 w-14 h-14 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-extrabold leading-none text-center">404</span>
                    </div>
                </div>

                {/* Text */}
                <h1 className="text-3xl font-extrabold text-foreground leading-tight">
                    {t('pages.notFound.title')}
                </h1>
                <p className="text-muted-foreground text-sm mt-3 leading-relaxed max-w-xs mx-auto">
                    {t('pages.notFound.description')}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 h-11 px-6 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all">
                        <Home size={15} />
                        {t('pages.notFound.backToHome')}
                    </Link>
                    <Link
                        href="/products"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 h-11 px-6 bg-white dark:bg-gray-900 border border-border hover:bg-gray-50 dark:hover:bg-gray-800/50 text-foreground text-sm font-medium rounded-xl transition-colors">
                        <Search size={15} />
                        {t('pages.notFound.browseProducts')}
                    </Link>
                </div>

                {/* Back link */}
                <button
                    onClick={() => window.history.back()}
                    className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto">
                    <ArrowLeft size={13} />
                    {t('pages.notFound.goBackPrevious')}
                </button>

                {/* Helpful links */}
                <div className="mt-12 pt-8 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-4 font-medium">{t('pages.notFound.maybeLookingFor')}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {helpfulLinks.map(({ label, href }) => (
                            <Link
                                key={href}
                                href={href}
                                className="px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-full hover:bg-green-100 dark:hover:bg-green-950/60 transition-colors">
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}