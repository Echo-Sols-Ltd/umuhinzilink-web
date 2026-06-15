'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    User, Mail, Phone, MapPin, ShoppingBag,
    Heart, Clock, ChevronRight, Edit2, Package,
    CheckCircle, XCircle, AlertCircle, Wallet
} from 'lucide-react';
import { Negotiation, User as UserType } from '@/types';



interface BuyerProfileProps {
    user: UserType
    walletBalance: number;
    totalOrders: number;
    completedOrders: number;
    savedProductsCount: number;
    activeNegotiations: Negotiation[];
}



function formatRWF(amount: number) {
    return new Intl.NumberFormat('rw-RW', { style: 'decimal' }).format(amount) + ' RWF';
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    sub?: string;
}) {
    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon size={14} />
                <span className="text-xs font-medium">{label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
    );
}



// ── Main Component ────────────────────────────────────────────────────────────

export default function Profile({
    user,
    walletBalance,
    totalOrders,
    completedOrders,
    savedProductsCount,
    activeNegotiations,
}: BuyerProfileProps) {
    const [tab, setTab] = useState<'negotiations' | 'saved'>('negotiations');
    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

    return (
        <div className="space-y-4">

                {/* Profile card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border shadow-sm overflow-hidden">

                    {/* Green header strip */}
                    <div className="h-20 bg-green-600 relative">
                        <Link
                            href="/profile/edit"
                            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-full transition-colors">
                            <Edit2 size={12} />
                            Edit
                        </Link>
                    </div>

                    <div className="px-6 pb-6">
                        {/* Avatar */}
                        <div className="-mt-10 mb-4 flex items-end justify-between">
                            <div className="w-20 h-20 z-20 rounded-2xl border-4 border-white dark:border-gray-900 bg-green-100 dark:bg-green-900 flex items-center justify-center overflow-hidden shadow-sm">
                                {user.profilePicture ? (
                                    <img src={user.profilePicture} alt={user.firstName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold text-green-700 dark:text-green-300">{initials}</span>
                                )}
                            </div>
                            {user.emailVerified && (
                                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
                                    <CheckCircle size={11} />
                                    Verified
                                </span>
                            )}
                        </div>

                        {/* Name & meta */}
                        <h1 className="text-xl font-bold text-foreground">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {user.role} · Joined {new Date(user.createdAt).toLocaleDateString('en-RW', { month: 'long', year: 'numeric' })}
                        </p>

                        {/* Contact */}
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail size={14} />
                                <span>{user.email}</span>
                            </div>
                            {user.phoneNumber && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone size={14} />
                                    <span>{user.phoneNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                    <StatCard
                        icon={Wallet}
                        label="Wallet balance"
                        value={formatRWF(walletBalance)}
                    />
                    <StatCard
                        icon={ShoppingBag}
                        label="Total orders"
                        value={totalOrders}
                        sub={`${completedOrders} completed`}
                    />
                    <StatCard
                        icon={AlertCircle}
                        label="Active negotiations"
                        value={activeNegotiations.filter(n => n.status === 'PENDING').length}
                    />
                    <StatCard
                        icon={Heart}
                        label="Saved products"
                        value={savedProductsCount}
                    />
                </div>

                {/* Wallet CTA */}
                <Link
                    href="/wallet"
                    className="flex items-center justify-between w-full bg-green-600 hover:bg-green-700 text-white px-5 py-4 rounded-2xl transition-colors">
                    <div className="flex items-center gap-3">
                        <Wallet size={20} />
                        <div>
                            <p className="text-sm font-semibold">My Wallet</p>
                            <p className="text-xs text-green-200">{formatRWF(walletBalance)} available</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-green-300" />
                </Link>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="flex border-b border-border">
                        {(['negotiations', 'saved'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === t
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}>
                                {t === 'negotiations' ? 'Negotiations' : 'Saved'}
                            </button>
                        ))}
                    </div>

                    <div className="p-3">
                        {tab === 'negotiations' ? (
                            activeNegotiations.length > 0 ? (
                                <div className="space-y-1">
                                    <Link
                                        href="/negotiations"
                                        className="flex items-center justify-center gap-1.5 py-3 text-sm text-green-600 font-medium hover:underline">
                                        View all negotiations
                                        <ChevronRight size={14} />
                                    </Link>
                                </div>
                            ) : (
                                <div className="py-10 text-center">
                                    <ShoppingBag size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
                                    <p className="text-sm text-muted-foreground">No negotiations yet</p>
                                    <Link href="/products" className="text-sm text-green-600 font-medium mt-1 inline-block hover:underline">
                                        Browse products
                                    </Link>
                                </div>
                            )
                        ) : (
                            <div className="py-10 text-center">
                                <Heart size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
                                <p className="text-sm text-muted-foreground">No saved products</p>
                                <Link href="/products" className="text-sm text-green-600 font-medium mt-1 inline-block hover:underline">
                                    Start browsing
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick actions */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border shadow-sm divide-y divide-border">
                    {[
                        { label: 'Order history', href: '/orders', icon: Package },
                        { label: 'Saved products', href: '/products/saved', icon: Heart },
                        { label: 'Account settings', href: '/settings', icon: User },
                    ].map(({ label, href, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                            <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                                <Icon size={16} className="text-muted-foreground" />
                                {label}
                            </div>
                            <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </div>

        </div>
    );
}