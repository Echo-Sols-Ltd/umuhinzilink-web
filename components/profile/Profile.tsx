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
  Bell,
  Sprout,
} from '@/lib/icons';
import { Negotiation, NegotiationStatus, User as UserType, UserRole } from '@/types';
import { imageUrl } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import NegotiationCard from '@/components/negotiation/NegotiationCard';

interface ProfileProps {
  user: UserType;
  walletBalance: number;
  totalOrders: number;
  completedOrders: number;
  savedProductsCount: number;
  activeNegotiations: Negotiation[];
  negotiationsLoading?: boolean;
}

function formatRWF(amount: number) {
  return new Intl.NumberFormat('rw-RW', { style: 'decimal' }).format(amount) + ' RWF';
}

function formatJoined(createdAt?: string) {
  if (!createdAt) return 'Member';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'Member';
  return date.toLocaleDateString('en-RW', { month: 'long', year: 'numeric' });
}

const ROLE_META: Record<UserRole, { label: string; className: string }> = {
  [UserRole.BUYER]: {
    label: 'Buyer',
    className: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
  },
  [UserRole.SELLER]: {
    label: 'Seller',
    className: 'bg-primary/10 text-primary',
  },
  [UserRole.ADMIN]: {
    label: 'Admin',
    className: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
  },
};

function StatCard({
  href,
  icon: Icon,
  label,
  value,
  hint,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-accent/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <Icon size={17} className="text-primary" />
        </div>
        <ChevronRight
          size={14}
          className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
        />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-xl font-bold leading-tight text-foreground">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Link>
  );
}

function ActionRow({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent/50 sm:px-5"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
        <Icon size={18} className="text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
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
  const initials =
    `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  const pendingNegotiations = activeNegotiations.filter(
    (n) => n.status === NegotiationStatus.PENDING,
  ).length;
  const recentNegotiations = activeNegotiations.slice(0, 2);
  const isSeller = user.role === UserRole.SELLER;
  const roleMeta = ROLE_META[user.role] ?? ROLE_META[UserRole.BUYER];

  const stats = isSeller
    ? [
        {
          href: ROUTES.wallet,
          icon: Wallet,
          label: 'Wallet',
          value: formatRWF(walletBalance),
          hint: 'Available balance',
        },
        {
          href: ROUTES.sellerProducts,
          icon: Package,
          label: 'Listings',
          value: 'Manage',
          hint: 'Products you sell',
        },
        {
          href: ROUTES.orders,
          icon: ShoppingBag,
          label: 'Orders',
          value: totalOrders,
          hint: completedOrders > 0 ? `${completedOrders} completed` : 'Order history',
        },
        {
          href: ROUTES.negotiations,
          icon: MessageSquare,
          label: 'Negotiations',
          value: pendingNegotiations,
          hint: pendingNegotiations > 0 ? 'Need your response' : 'All conversations',
        },
      ]
    : [
        {
          href: ROUTES.wallet,
          icon: Wallet,
          label: 'Wallet',
          value: formatRWF(walletBalance),
          hint: 'Available balance',
        },
        {
          href: ROUTES.orders,
          icon: ShoppingBag,
          label: 'Orders',
          value: totalOrders,
          hint: completedOrders > 0 ? `${completedOrders} completed` : 'Order history',
        },
        {
          href: ROUTES.savedProducts,
          icon: Heart,
          label: 'Saved',
          value: savedProductsCount,
          hint: savedProductsCount > 0 ? 'Products saved' : 'Browse marketplace',
        },
        {
          href: ROUTES.negotiations,
          icon: MessageSquare,
          label: 'Negotiations',
          value: pendingNegotiations,
          hint: pendingNegotiations > 0 ? 'Need your response' : 'All conversations',
        },
      ];

  const accountLinks = [
    {
      href: ROUTES.profileEdit,
      icon: User,
      title: 'Edit profile',
      description: 'Update your name, photo, phone, and language',
    },
    {
      href: ROUTES.settings,
      icon: Settings,
      title: 'Account settings',
      description: 'Security, notifications, and preferences',
    },
    {
      href: ROUTES.notifications,
      icon: Bell,
      title: 'Notifications',
      description: 'View alerts about orders and messages',
    },
    ...(isSeller
      ? [
          {
            href: ROUTES.productCreate,
            icon: Sprout,
            title: 'Add a product',
            description: 'List new produce or farm supplies',
          },
        ]
      : [
          {
            href: ROUTES.products,
            icon: Sprout,
            title: 'Browse marketplace',
            description: 'Find fresh produce from Rwandan sellers',
          },
        ]),
  ];

  return (
    <div className="space-y-6">
      {/* Profile identity */}
      <section className="overflow-hidden rounded-2xl border border-border shadow-sm">
        <div className="relative bg-gradient-to-br from-primary via-primary to-secondary px-4 py-6 sm:px-6 sm:py-8">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/30 bg-white/15 shadow-lg sm:h-24 sm:w-24">
                {user.profilePicture ? (
                  <img
                    src={imageUrl(user.profilePicture)}
                    alt={user.firstName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {user.firstName} {user.lastName}
                  </h2>
                  {user.emailVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white">
                      <CheckCircle size={10} />
                      Verified
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-emerald-50/90">
                  <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                    {roleMeta.label}
                  </span>
                  <span aria-hidden className="text-white/50">
                    ·
                  </span>
                  <span>Joined {formatJoined(user.createdAt)}</span>
                </div>
              </div>
            </div>
            <Link
              href={ROUTES.profileEdit}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/30 bg-white/15 px-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:self-auto"
            >
              <Edit2 size={15} />
              Edit profile
            </Link>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <Mail size={16} className="shrink-0 text-emerald-50" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-100/80">
                  Email
                </p>
                <p className="truncate text-sm font-medium text-white">{user.email}</p>
              </div>
            </div>
            {user.phoneNumber ? (
              <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <Phone size={16} className="shrink-0 text-emerald-50" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-100/80">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-white">{user.phoneNumber}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-3">
                <Phone size={16} className="shrink-0 text-emerald-100/60" />
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-100/80">
                    Phone
                  </p>
                  <Link
                    href={ROUTES.profileEdit}
                    className="text-sm font-medium text-white underline-offset-2 hover:underline"
                  >
                    Add phone number
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Overview stats */}
      <section>
        <div className="mb-3 px-0.5">
          <h3 className="text-sm font-bold text-foreground">Overview</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Tap a card to jump to wallet, orders, saved items, or negotiations.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.href + item.label} {...item} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Recent negotiations */}
        <section className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
              <div>
                <h3 className="text-sm font-bold text-foreground">Recent negotiations</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {isSeller
                    ? 'Latest price discussions with buyers'
                    : 'Your latest offers and counter-offers'}
                </p>
              </div>
              <Link
                href={ROUTES.negotiations}
                className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-primary hover:underline"
              >
                View all
                <ChevronRight size={13} />
              </Link>
            </div>

            {negotiationsLoading && recentNegotiations.length === 0 ? (
              <div className="space-y-3 p-4 sm:p-5">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-xl bg-muted"
                  />
                ))}
              </div>
            ) : recentNegotiations.length > 0 ? (
              <div className="grid gap-3 p-4 sm:p-5">
                {recentNegotiations.map((neg) => (
                  <NegotiationCard key={neg.id} neg={neg} role={user.role} />
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                  <MessageSquare size={22} className="text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">No negotiations yet</p>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                  {isSeller
                    ? 'When buyers negotiate on your listings, the conversation will show up here.'
                    : 'Open a product and tap negotiate to request a better price from the seller.'}
                </p>
                <Link
                  href={isSeller ? ROUTES.sellerProducts : ROUTES.products}
                  className="mt-5 inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {isSeller ? 'View my listings' : 'Browse products'}
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Account shortcuts */}
        <section className="lg:col-span-2">
          <div className="mb-3 px-0.5 lg:mb-0 lg:sr-only">
            <h3 className="text-sm font-bold text-foreground">Manage account</h3>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-4 py-4 sm:px-5">
              <h3 className="text-sm font-bold text-foreground">Manage account</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Profile, settings, and quick actions
              </p>
            </div>
            <div className="divide-y divide-border">
              {accountLinks.map((link) => (
                <ActionRow key={link.href} {...link} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
