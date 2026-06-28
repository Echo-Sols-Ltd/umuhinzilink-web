'use client'

import { Product, ProductStatus } from "@/types";
import { AlertTriangle, CheckCircle, Eye, FileText, MoreVertical, Package, PauseCircle, Trash2, XCircle } from '@/lib/icons';
import Link from "next/link";
import { Edit3 } from '@/lib/icons';
import { useState } from "react";
import { imageUrl } from "@/lib/utils";

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ProductStatus, { label: string; icon: React.ElementType; cls: string; dot: string }> = {
    IN_STOCK: { label: 'In stock', icon: CheckCircle, cls: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
    LOW_STOCK: { label: 'Low stock', icon: AlertTriangle, cls: 'text-amber-600  bg-amber-50  dark:bg-amber-950/30  dark:text-amber-400', dot: 'bg-amber-500' },
    OUT_OF_STOCK: { label: 'Out of stock', icon: XCircle, cls: 'text-red-500    bg-red-50    dark:bg-red-950/30    dark:text-red-400', dot: 'bg-red-500' },
    DRAFT: { label: 'Draft', icon: FileText, cls: 'text-gray-500   bg-gray-100  dark:bg-gray-800      dark:text-gray-400', dot: 'bg-gray-400' },
    DISCONTINUED: { label: 'Discontinued', icon: PauseCircle, cls: 'text-gray-400   bg-gray-100  dark:bg-gray-800      dark:text-gray-500', dot: 'bg-gray-300' },
};

const UNIT_LABELS: Record<string, string> = {
    KG: 'kg', G: 'g', TON: 'ton', LITER: 'L', ML: 'ml',
    BAG_25KG: '25kg bag', BAG_50KG: '50kg bag', BAG_100KG: '100kg bag',
    CRATE: 'crate', BUNDLE: 'bundle', BUNCH: 'bunch',
    PIECE: 'pc', DOZEN: 'doz', JERRICAN: 'jerrican', SACK: 'sack',
};
function StatusBadge({ status }: { status: ProductStatus }) {
    const { label, icon: Icon, cls } = STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
            <Icon size={10} />
            {label}
        </span>
    );
}

const CATEGORY_LABELS: Record<string, string> = {
    CEREALS: 'Cereals', LEGUMES_PULSES: 'Legumes', ROOTS_TUBERS: 'Roots & Tubers',
    BANANAS_PLANTAINS: 'Bananas', VEGETABLES: 'Vegetables', FRUITS: 'Fruits',
    CASH_CROPS: 'Cash Crops', OILSEEDS: 'Oilseeds', SPICES_HERBS: 'Spices',
    FODDER_FORAGE: 'Fodder', FERTILISER: 'Fertiliser', PESTICIDE: 'Pesticide',
    HERBICIDE: 'Herbicide', FUNGICIDE: 'Fungicide', SEEDS_SEEDLINGS: 'Seeds',
    IRRIGATION: 'Irrigation', HAND_TOOLS: 'Tools', MACHINERY: 'Machinery',
    STORAGE_EQUIPMENT: 'Storage', PACKAGING: 'Packaging',
    ANIMAL_FEED: 'Animal Feed', VETERINARY: 'Veterinary', OTHER: 'Other',
};

function ActionMenu({ listing, onDelete }: { listing: Product; onDelete: (id: string) => void }) {
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
                            <Edit3 size={13} className="text-muted-foreground" /> Edit listing
                        </Link>
                        <Link
                            href={`/products/${listing.id}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Eye size={13} className="text-muted-foreground" /> View as buyer
                        </Link>
                        <div className="border-t border-border my-1" />
                        <button
                            onClick={() => { onDelete(listing.id); setOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                            <Trash2 size={13} /> Delete listing
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}


export default function ProductList({ listing, onDelete }: { listing: Product; onDelete: (id: string) => void }) {
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
                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold shrink-0">Negotiable</span>
                    )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{CATEGORY_LABELS[listing.category]}</p>
                <div className="flex items-center gap-3 mt-1.5">
                    <StatusBadge status={listing.status} />
                    <span className="text-xs text-muted-foreground">
                        {listing.stockQuantity} {UNIT_LABELS[listing.measurementUnit] ?? listing.measurementUnit} left
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