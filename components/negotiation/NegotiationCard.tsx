'use client';

import { Negotiation, NegotiationStatus, UserRole } from "@/types";
import { imageUrl } from "@/lib/utils";
import Link from "next/link";
import { Package, User, Calendar, Clock, ChevronRight, MessageSquare, AlertCircle, CheckCircle, XCircle } from '@/lib/icons';
import { cn } from "@/lib/utils";
import { useI18n } from '@/contexts/I18nContext';

const STATUS_STYLE: Record<NegotiationStatus, {
    icon: React.ElementType;
    bg: string; text: string; dot: string;
    labelKey: string;
}> = {
    PENDING: { labelKey: 'settings.negotiations.pending', icon: AlertCircle, bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
    ACCEPTED: { labelKey: 'settings.negotiations.accepted', icon: CheckCircle, bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
    REJECTED: { labelKey: 'settings.negotiations.rejected', icon: XCircle, bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-500', dot: 'bg-red-500' },
    EXPIRED: { labelKey: 'settings.negotiations.expired', icon: Clock, bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-500', dot: 'bg-gray-400' },
};

function fmt(n: number) {
    return new Intl.NumberFormat('rw-RW').format(n) + ' RWF';
}

function timeAgo(dateStr: string, t: (key: string, vars?: Record<string, string | number>) => string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('settings.negotiations.timeAgo.justNow');
    if (mins < 60) return t('settings.negotiations.timeAgo.minutes', { count: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t('settings.negotiations.timeAgo.hours', { count: hrs });
    const days = Math.floor(hrs / 24);
    return t('settings.negotiations.timeAgo.days', { count: days });
}

function expiryLabel(dateStr: string, status: NegotiationStatus, t: (key: string, vars?: Record<string, string | number>) => string) {
    if (status !== 'PENDING') return null;
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff <= 0) return t('settings.negotiations.expired');
    const days = Math.floor(diff / 86400000);
    const hrs = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return t('settings.negotiations.timeLeft', { time: `${days}d ${hrs}h` });
    if (hrs > 0) return t('settings.negotiations.timeLeft', { time: `${hrs}h` });
    return t('settings.negotiations.expiringSoon');
}

export default function NegotiationCard({ neg, role }: { neg: Negotiation; role: UserRole }) {
    const { t } = useI18n();
    const { labelKey, icon: Icon, bg, text, dot } = STATUS_STYLE[neg.status];
    const label = t(labelKey);
    const product = neg.order.product;
    const expiry = expiryLabel(neg.expiresAt, neg.status, t);
    const otherName = role === 'SELLER'
        ? `${neg.order.buyer.firstName} ${neg.order.buyer.lastName}`
        : `${neg.order.product.owner.firstName} ${neg.order.product.owner.lastName}`;

    const discount = Math.round((1 - neg.buyerProposedPrice / product.unitPrice) * 100);
    const isActive = neg.status === 'PENDING';

    return (
        <Link
            href={`/negotiations/${neg.id}`}
            className="group block bg-white dark:bg-gray-900 rounded-2xl border border-border hover:border-green-300 dark:hover:border-green-700 hover:shadow-md transition-all duration-200 overflow-hidden">

            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                        {product.image ? (
                            <img src={imageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package size={20} className="text-gray-300 dark:text-gray-600" />
                            </div>
                        )}
                        <div className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ${dot} ring-2 ring-white dark:ring-gray-800`} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                    <User size={10} />
                                    <span className="truncate">{otherName}</span>
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground mt-1.5">
                            {neg.order.orderNumber} · {neg.order.quantity} {product.measurementUnit?.replace(/_/g, ' ').toLowerCase()}
                        </p>
                    </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{t('settings.negotiations.offered')}</p>
                            <p className="text-sm font-extrabold text-foreground">
                                {fmt(neg.buyerProposedPrice)}
                            </p>
                        </div>

                        {discount > 0 && (
                            <>
                                <ChevronRight size={12} className="text-muted-foreground" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{t('settings.negotiations.listed')}</p>
                                    <p className="text-xs text-muted-foreground line-through">{fmt(product.unitPrice)}</p>
                                </div>
                            </>
                        )}

                        {neg.agreedPrice && neg.agreedPrice !== neg.buyerProposedPrice && (
                            <>
                                <ChevronRight size={12} className="text-muted-foreground" />
                                <div>
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold tracking-wider">{t('settings.negotiations.agreedLabel')}</p>
                                    <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{fmt(neg.agreedPrice)}</p>
                                </div>
                            </>
                        )}
                    </div>

                    <span className={cn(
                        'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full',
                        bg, text
                    )}>
                        <Icon size={11} /> {label}
                    </span>
                </div>

                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar size={10} /> {timeAgo(neg.createdAt, t)}
                        </span>
                        {expiry && (
                            <span className={cn(
                                'flex items-center gap-1 font-medium',
                                expiry === t('settings.negotiations.expiringSoon') ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'
                            )}>
                                <Clock size={10} /> {expiry}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold group-hover:gap-2 transition-all">
                        {isActive ? (
                            <><MessageSquare size={12} /> {t('settings.negotiations.chat')}</>
                        ) : (
                            <>{t('settings.negotiations.view')}</>
                        )}
                        <ChevronRight size={12} />
                    </div>
                </div>
            </div>
        </Link>
    );
}
