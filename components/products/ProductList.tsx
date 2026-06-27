'use client'

import { Product, ProductCategory, ProductStatus, MeasurementUnit } from "@/types";
import { AlertTriangle, CheckCircle, Eye, FileText, MoreVertical, Package, PauseCircle, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import { Edit3 } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { imageUrl } from "@/lib/utils";

function categoryLabel(category: string, t: (key: string) => string): string {
    const direct = t(`enums.categories.${category}`);
    if (direct !== `enums.categories.${category}`) return direct;
    const enumKey = Object.keys(ProductCategory).find(
        (k) => ProductCategory[k as keyof typeof ProductCategory] === category,
    );
    if (enumKey) {
        const translated = t(`enums.categories.${enumKey}`);
        if (translated !== `enums.categories.${enumKey}`) return translated;
    }
    return category;
}

function unitLabel(unit: string, t: (key: string) => string): string {
    const byKey = t(`enums.units.${unit}`);
    if (byKey !== `enums.units.${unit}`) return byKey.toLowerCase();
    const entry = Object.entries(MeasurementUnit).find(([, v]) => v === unit);
    if (entry) return t(`enums.units.${entry[0]}`).toLowerCase();
    return unit?.toLowerCase() ?? '';
}

const STATUS_ICONS: Record<ProductStatus, { icon: React.ElementType; cls: string }> = {
    IN_STOCK: { icon: CheckCircle, cls: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400' },
    LOW_STOCK: { icon: AlertTriangle, cls: 'text-amber-600  bg-amber-50  dark:bg-amber-950/30  dark:text-amber-400' },
    OUT_OF_STOCK: { icon: XCircle, cls: 'text-red-500    bg-red-50    dark:bg-red-950/30    dark:text-red-400' },
    DRAFT: { icon: FileText, cls: 'text-gray-500   bg-gray-100  dark:bg-gray-800      dark:text-gray-400' },
    DISCONTINUED: { icon: PauseCircle, cls: 'text-gray-400   bg-gray-100  dark:bg-gray-800      dark:text-gray-500' },
};

function StatusBadge({ status }: { status: ProductStatus }) {
    const { t } = useI18n();
    const { icon: Icon, cls } = STATUS_ICONS[status];
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
            <Icon size={10} />
            {t(`enums.productStatus.${status}`)}
        </span>
    );
}

function ActionMenu({ listing, onDelete }: { listing: Product; onDelete: (id: string) => void }) {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={e => { e.preventDefault(); setOpen(v => !v); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <MoreVertical size={14} />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-gray-900 border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                        <Link
                            href={`/products/${listing.id}/edit`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Edit3 size={13} className="text-muted-foreground" /> {t('products.list.editListing')}
                        </Link>
                        <Link
                            href={`/products/${listing.id}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Eye size={13} className="text-muted-foreground" /> {t('products.list.viewAsBuyer')}
                        </Link>
                        <div className="border-t border-border my-1" />
                        <button
                            onClick={() => { onDelete(listing.id); setOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                            <Trash2 size={13} /> {t('products.list.deleteListing')}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}


export default function ProductList({ listing, onDelete }: { listing: Product; onDelete: (id: string) => void }) {
    const { t } = useI18n();
    const unit = unitLabel(String(listing.measurementUnit), t);

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                {listing.image ? (
                    <img src={imageUrl(listing.image)} alt={listing.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package size={20} className="text-gray-300 dark:text-gray-600" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-foreground truncate">{listing.name}</p>
                    {listing.isNegotiable && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold shrink-0">
                            {t('products.list.negotiable')}
                        </span>
                    )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {categoryLabel(String(listing.category), t)}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                    <StatusBadge status={listing.status} />
                    <span className="text-xs text-muted-foreground">
                        {t('products.list.left', { quantity: listing.stockQuantity, unit })}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
                <Link
                    href={`/products/${listing.id}/edit`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100">
                    <Edit3 size={14} />
                </Link>
                <ActionMenu listing={listing} onDelete={onDelete} />
            </div>
        </div>
    );
}
