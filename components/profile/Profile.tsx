'use client';

import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  ShoppingBag,
  Heart,
  ChevronRight,
  Edit2,
  Package,
  CheckCircle,
  Wallet,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { Negotiation, NegotiationStatus, User as UserType, UserRole } from '@/types';
import { imageUrl } from '@/lib/utils';
import NegotiationCard from '@/components/negotiation/NegotiationCard';
import { useI18n } from '@/contexts/I18nContext';
import { INTL_LOCALE, formatCurrency as fmtCurrency, formatDate as fmtDate } from '@/lib/localeFormat';

interface ProfileProps {
  user: UserType;
  walletBalance: number;
  totalOrders: number;
  completedOrders: number;
  savedProductsCount: number;
  activeNegotiations: Negotiation[];
  negotiationsLoading?: boolean;
}

const ROLE_KEYS: Record<UserRole, string> = {
  [UserRole.SELLER]: 'nav.roles.seller',
  [UserRole.BUYER]: 'nav.roles.buyer',
  [UserRole.ADMIN]: 'nav.roles.admin',
};

function ShortcutCard({
  href,
  icon: Icon,
  label,
  value,
  sub,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-2 bg-white dark:bg-gray-900 rounded-2xl border border-border p-4 hover:border-green-300 dark:hover:border-green-700 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-950/40 flex items-center justify-center">
          <Icon size={17} className="text-green-600 dark:text-green-400" />
        </div>
        <ChevronRight
          size={14}
          className="text-muted-foreground shrink-0"
        />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </Link>
  );
}

export default function Profile({
  user,
  walletBalance,
  totalOrders,
  completedOrders,
  savedProductsCount,
  activeNegotiations,
  negotiationsLoading = false,
}: ProfileProps) {
  const { t, locale } = useI18n();
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  const pendingNegotiations = activeNegotiations.filter((n) => n.status === NegotiationStatus.PENDING).length;
  const recentNegotiations = activeNegotiations.slice(0, 3);
  const isSeller = user.role === UserRole.SELLER;

  const formatJoined = (createdAt?: string) => {
    if (!createdAt) return t('profile.overview.member');
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return t('profile.overview.member');
    const monthYear = date.toLocaleDateString(INTL_LOCALE[locale], {
      month: 'long',
      year: 'numeric',
    });
    return t('profile.overview.joined', { monthYear });
  };

  const shortcuts = isSeller
    ? [
        {
          href: '/wallet',
          icon: Wallet,
          label: t('profile.overview.wallet'),
          value: formatCurrency(walletBalance, locale),
          sub: t('profile.overview.availableBalance'),
        },
        {
          href: '/products/seller',
          icon: Package,
          label: t('profile.overview.myListings'),
          value: t('profile.overview.manage'),
          sub: t('profile.overview.productsYouSell'),
        },
        {
          href: '/orders',
          icon: ShoppingBag,
          label: t('profile.overview.orders'),
          value: totalOrders,
          sub: completedOrders > 0
            ? t('profile.overview.completed', { count: completedOrders })
            : t('profile.overview.viewHistory'),
        },
        {
          href: '/negotiations',
          icon: MessageSquare,
          label: t('profile.overview.negotiations'),
          value: pendingNegotiations,
          sub: pendingNegotiations > 0
            ? t('profile.overview.awaitingResponse')
            : t('profile.overview.viewAll'),
        },
      ]
    : [
        {
          href: '/wallet',
          icon: Wallet,
          label: t('profile.overview.wallet'),
          value: formatCurrency(walletBalance, locale),
          sub: t('profile.overview.availableBalance'),
        },
        {
          href: '/orders',
          icon: ShoppingBag,
          label: t('profile.overview.orders'),
          value: totalOrders,
          sub: completedOrders > 0
            ? t('profile.overview.completed', { count: completedOrders })
            : t('profile.overview.viewHistory'),
        },
        {
          href: '/products/saved',
          icon: Heart,
          label: t('profile.overview.saved'),
          value: savedProductsCount,
          sub: savedProductsCount > 0
            ? t('profile.overview.savedForLater')
            : t('profile.overview.browseProducts'),
        },
        {
          href: '/negotiations',
          icon: MessageSquare,
          label: t('profile.overview.negotiations'),
          value: pendingNegotiations,
          sub: pendingNegotiations > 0
            ? t('profile.overview.awaitingResponse')
            : t('profile.overview.viewAll'),
        },
      ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      {/* Profile hero */}
      <div className="xl:col-span-1 bg-white dark:bg-gray-900 rounded-2xl border border-border overflow-hidden">
        <div className="h-14 bg-green-600" />
        <div className="px-5 pb-5">
          <div className="-mt-9 flex items-end justify-between gap-3 mb-4">
            <div
              className="w-[4.5rem] h-[4.5rem] rounded-2xl border-4 border-white dark:border-gray-900 bg-green-100 dark:bg-green-900 flex items-center justify-center overflow-hidden shadow-sm shrink-0"
            >
              {user.profilePicture ? (
                <img
                  src={imageUrl(user.profilePicture)}
                  alt={user.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-green-700 dark:text-green-300">{initials}</span>
              )}
            </div>
            <Link
              href="/profile/edit"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-border text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shrink-0"
            >
              <Edit2 size={12} />
              {t('profile.overview.editProfile')}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-foreground">
              {user.firstName} {user.lastName}
            </h1>
            {user.emailVerified && (
              <span className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full">
                <CheckCircle size={10} />
                {t('profile.overview.verified')}
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {t(ROLE_KEYS[user.role])} · {formatJoined(user.createdAt)}
          </p>

          <div className="mt-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={14} className="shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.phoneNumber && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} className="shrink-0" />
                <span>{user.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="xl:col-span-2 space-y-5">
      {/* Shortcuts */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3 px-0.5">
          {t('profile.overview.quickAccess')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {shortcuts.map((item) => (
            <ShortcutCard key={item.href} {...item} />
          ))}
        </div>
      </div>

      {/* Recent negotiations */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">{t('profile.overview.recentNegotiations')}</h2>
          <Link
            href="/negotiations"
            className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-0.5"
          >
            {t('profile.overview.seeAll')}
            <ChevronRight size={13} />
          </Link>
        </div>

        {negotiationsLoading && recentNegotiations.length === 0 ? (
          <div className="p-5 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : recentNegotiations.length > 0 ? (
          <div className="p-3 grid grid-cols-1 lg:grid-cols-2 gap-2">
            {recentNegotiations.map((neg) => (
              <NegotiationCard key={neg.id} neg={neg} role={user.role} />
            ))}
          </div>
        ) : (
          <div className="py-12 px-6 text-center">
            <MessageSquare size={28} className="text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-foreground">{t('profile.overview.noNegotiationsYet')}</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              {isSeller
                ? t('profile.overview.sellerNegotiationsHint')
                : t('profile.overview.buyerNegotiationsHint')}
            </p>
            {!isSeller && (
              <Link
                href="/products"
                className="mt-4 inline-flex h-9 items-center px-4 text-sm font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                {t('profile.overview.browseProducts')}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Account links */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border divide-y divide-border">
        <Link
          href="/profile/edit"
          className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-foreground">
            <User size={16} className="text-muted-foreground" />
            {t('profile.overview.editProfile')}
          </div>
          <ChevronRight size={14} className="text-muted-foreground shrink-0" />
        </Link>
        <Link
          href="/settings"
          className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-foreground">
            <Settings size={16} className="text-muted-foreground" />
            {t('profile.overview.settings')}
          </div>
          <ChevronRight size={14} className="text-muted-foreground shrink-0" />
        </Link>
      </div>
      </div>
    </div>
  );
}
