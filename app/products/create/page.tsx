'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
    Upload, X, Check, ChevronDown,
    Package, MapPin, Eye, ImageIcon,
    DollarSign, Info, ImagePlus, AlertCircle,
    ToggleLeft, ToggleRight, Loader2,
} from '@/lib/icons';
import { District, MeasurementUnit, ProductCategory, ProductRequest } from '@/types';
import { useProductAction } from '@/hooks/useProductAction';
import DetailPageShell from '@/components/layout/DetailPageShell';
import AppLayout from '@/components/layout/AppLayout';
import SellerGuard from '@/contexts/guard/SellerGuard';

const CATEGORY_LABELS: Record<string, string> = {
    CEREALS: 'Cereals', LEGUMES_PULSES: 'Legumes & Pulses', ROOTS_TUBERS: 'Roots & Tubers',
    BANANAS_PLANTAINS: 'Bananas & Plantains', VEGETABLES: 'Vegetables', FRUITS: 'Fruits',
    CASH_CROPS: 'Cash Crops', OILSEEDS: 'Oilseeds', SPICES_HERBS: 'Spices & Herbs',
    FODDER_FORAGE: 'Fodder & Forage', FERTILISER: 'Fertiliser', PESTICIDE: 'Pesticide',
    HERBICIDE: 'Herbicide', FUNGICIDE: 'Fungicide', SEEDS_SEEDLINGS: 'Seeds & Seedlings',
    IRRIGATION: 'Irrigation Equipment', HAND_TOOLS: 'Hand Tools', MACHINERY: 'Machinery',
    STORAGE_EQUIPMENT: 'Storage Equipment', PACKAGING: 'Packaging Material',
    ANIMAL_FEED: 'Animal Feed', VETERINARY: 'Veterinary Products', OTHER: 'Other',
};

const CATEGORY_GROUPS = [
    { group: 'Produce', keys: ['CEREALS', 'LEGUMES_PULSES', 'ROOTS_TUBERS', 'BANANAS_PLANTAINS', 'VEGETABLES', 'FRUITS', 'CASH_CROPS', 'OILSEEDS', 'SPICES_HERBS', 'FODDER_FORAGE'] },
    { group: 'Inputs & Equipment', keys: ['FERTILISER', 'PESTICIDE', 'HERBICIDE', 'FUNGICIDE', 'SEEDS_SEEDLINGS', 'IRRIGATION', 'HAND_TOOLS', 'MACHINERY', 'STORAGE_EQUIPMENT', 'PACKAGING', 'ANIMAL_FEED', 'VETERINARY'] },
    { group: 'Other', keys: ['OTHER'] },
];

const UNITS: Record<string, string> = {
    KG: 'Kilogram (kg)', G: 'Gram (g)', TON: 'Metric Ton', LITER: 'Liter', ML: 'Milliliter',
    BAG_25KG: '25 kg Bag', BAG_50KG: '50 kg Bag', BAG_100KG: '100 kg Bag',
    CRATE: 'Crate', BUNDLE: 'Bundle', BUNCH: 'Bunch', PIECE: 'Piece',
    DOZEN: 'Dozen', JERRICAN: 'Jerrican', SACK: 'Sack',
};

const DISTRICTS = [
    'BUGESERA', 'BURERA', 'GAKENKE', 'GASABO', 'GATSIBO', 'GICUMBI', 'GISAGARA', 'HUYE',
    'KAMONYI', 'KARONGI', 'KAYONZA', 'KICUKIRO', 'KIREHE', 'MUHANGA', 'MUSANZE', 'NGOMA',
    'NGORORERO', 'NYABIHU', 'NYAGATARE', 'NYAMASHEKE', 'NYANZA', 'NYARUGENGE',
    'NYARUGURU', 'RUBAVU', 'RUHANGO', 'RULINDO', 'RUSIZI', 'RUTSIRO', 'RWAMAGANA',
];

type FieldErrors = Partial<Record<keyof ProductRequest | 'image', string>>;

const inputCls = (err?: string) =>
    `w-full h-11 px-3.5 rounded-xl border text-sm text-foreground bg-gray-50 dark:bg-gray-800/60 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${err ? 'border-red-400' : 'border-border'}`;

function Field({ label, required, hint, error, children }: {
    label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                    {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
            </div>
            {children}
            {error && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={11} /> {error}
                </p>
            )}
        </div>
    );
}

function SectionHeader({ icon: Icon, title, sub, color }: {
    icon: React.ElementType; title: string; sub: string; color: string;
}) {
    return (
        <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
                <Icon size={16} />
            </div>
            <div>
                <p className="text-sm font-bold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
        </div>
    );
}

function CategoryPicker({ value, error, onChange }: {
    value: string; error?: string; onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className={`${inputCls(error)} flex items-center justify-between text-left`}>
                <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
                    {value ? CATEGORY_LABELS[value] : 'Select a category'}
                </span>
                <ChevronDown size={14} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-white shadow-xl dark:bg-gray-900">
                        {CATEGORY_GROUPS.map(({ group, keys }) => (
                            <div key={group}>
                                <p className="sticky top-0 bg-gray-50 px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50">
                                    {group}
                                </p>
                                {keys.map(k => (
                                    <button
                                        key={k}
                                        type="button"
                                        onClick={() => { onChange(k); setOpen(false); }}
                                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-green-50 dark:hover:bg-green-950/20 ${value === k ? 'font-semibold text-green-600' : 'text-foreground'}`}>
                                        {CATEGORY_LABELS[k]}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function PreviewCard({ form, previewUrl }: { form: ProductRequest; previewUrl: string | null }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm dark:bg-gray-900">
            <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Package size={32} className="text-gray-300" />
                    </div>
                )}
                {form.isNegotiable && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-green-600/90 px-2 py-0.5 text-xs font-semibold text-white">
                        Negotiable
                    </span>
                )}
            </div>
            <div className="space-y-2 p-4">
                <p className="line-clamp-1 font-bold text-foreground">{form.name || 'Product name'}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                    {form.description || 'Description will appear here…'}
                </p>
                <div className="flex items-baseline gap-1.5 pt-1">
                    <p className="text-base font-extrabold text-green-700 dark:text-green-400">
                        {form.unitPrice
                            ? new Intl.NumberFormat('rw-RW').format(Number(form.unitPrice)) + ' RWF'
                            : '— RWF'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        / {UNITS[form.measurementUnit]?.split(' ')[0].toLowerCase() || 'unit'}
                    </p>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-1 text-xs text-muted-foreground">
                    <span>{form.stockQuantity || '0'} in stock</span>
                    <span>
                        {form.district
                            ? form.district.charAt(0) + form.district.slice(1).toLowerCase()
                            : 'No district'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function CreateProduct() {
    return (
        <SellerGuard>
            <CreateProductForm />
        </SellerGuard>
    );
}

function CreateProductForm() {
    const { createProduct } = useProductAction();
    const [form, setForm] = useState<ProductRequest>({
        name: '',
        description: '',
        category: ProductCategory.VEGETABLES,
        unitPrice: 0,
        stockQuantity: 0,
        measurementUnit: MeasurementUnit.KG,
        district: District.BUGESERA,
        image: '',
        isNegotiable: false,
    });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<File | null>(null);

    const validate = (): boolean => {
        const e: FieldErrors = {};
        if (!form.name.trim()) e.name = 'Product name is required';
        if (!form.category) e.category = 'Select a category';
        if (!form.unitPrice || isNaN(Number(form.unitPrice)) || Number(form.unitPrice) <= 0)
            e.unitPrice = 'Enter a valid price greater than 0';
        if (!form.stockQuantity || isNaN(Number(form.stockQuantity)) || Number(form.stockQuantity) <= 0)
            e.stockQuantity = 'Enter a valid quantity greater than 0';
        if (!form.measurementUnit) e.measurementUnit = 'Select a unit';
        if (!form.district) e.district = 'Select your district';
        if (!form.image) e.image = 'Product image is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const set = <K extends keyof ProductRequest>(field: K, value: ProductRequest[K]) => {
        setForm(p => ({ ...p, [field]: value }));
        if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setErrors(p => ({ ...p, image: 'Image must be under 5 MB' }));
            return;
        }
        setImage(file);
        const reader = new FileReader();
        reader.onload = ev => {
            const result = ev.target?.result as string;
            setImagePreview(result);
            set('image', result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await createProduct(form, image!);
            setSuccess(true);
        } catch {
            // handled by hook
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({
            name: '', description: '', category: ProductCategory.VEGETABLES,
            unitPrice: 0, stockQuantity: 0, measurementUnit: MeasurementUnit.KG,
            district: District.BUGESERA, image: '', isNegotiable: false,
        });
        setImagePreview(null);
        setImage(null);
        setSuccess(false);
    };

    if (success) {
        return (
            <AppLayout maxWidth="max-w-lg" mainClassName="flex items-center justify-center min-h-[60vh]">
                <div className="w-full max-w-sm animate-in fade-in zoom-in-95 text-center duration-500">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                        <Check size={36} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-foreground">Listing published!</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        <span className="font-semibold text-foreground">{form.name}</span> is now live and visible to buyers across Rwanda.
                    </p>
                    {imagePreview && (
                        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white text-left dark:bg-gray-900">
                            <img src={imagePreview} alt={form.name} className="h-40 w-full object-cover" />
                            <div className="p-4">
                                <p className="font-bold text-foreground">{form.name}</p>
                                <p className="mt-1 text-sm font-semibold text-green-600">
                                    {Number(form.unitPrice).toLocaleString()} RWF / {UNITS[form.measurementUnit] ?? form.measurementUnit}
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="mt-6 space-y-3">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition-colors hover:bg-green-700">
                            <Package size={16} /> Add another listing
                        </button>
                        <Link
                            href="/products/seller"
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white text-sm font-medium text-foreground transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50">
                            View my listings
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const footer = (
        <div className="flex items-center gap-3">
            <Link
                href="/products/seller"
                className="flex h-11 flex-1 items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                Cancel
            </Link>
            <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex h-11 flex-[2] items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition-all hover:bg-green-700 active:scale-[0.98] disabled:opacity-60">
                {loading ? (
                    <><Loader2 size={15} className="animate-spin" /> Publishing…</>
                ) : (
                    <><Check size={15} /> Publish listing</>
                )}
            </button>
        </div>
    );

    return (
        <DetailPageShell
            maxWidth="max-w-5xl"
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'My listings', href: '/products/seller' },
                { label: 'New listing' },
            ]}
            backHref="/products/seller"
            backLabel="My listings"
            footer={footer}
        >
            <div className="mb-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Add new listing</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Fill in your product details. Buyers will see a live preview as you type.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    {/* Image */}
                    <div className="rounded-2xl border border-border bg-white p-5 dark:bg-gray-900">
                        <SectionHeader
                            icon={ImageIcon}
                            title="Product photo"
                            sub="A clear photo helps buyers trust your listing"
                            color="bg-amber-50 text-amber-600 dark:bg-amber-950/30"
                        />
                        <div
                            onClick={() => fileRef.current?.click()}
                            className={`relative h-52 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-colors ${errors.image
                                ? 'border-red-400 bg-red-50 dark:bg-red-950/10'
                                : imagePreview
                                    ? 'border-transparent'
                                    : 'border-border bg-gray-50 hover:border-green-400 dark:bg-gray-800/50 dark:hover:bg-green-950/10'
                                }`}>
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
                                        <span className="flex items-center gap-2 text-sm font-medium text-white">
                                            <ImagePlus size={16} /> Change image
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={e => { e.stopPropagation(); setImagePreview(null); setImage(null); set('image', ''); }}
                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70">
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                        <Upload size={22} />
                                    </div>
                                    <p className="text-sm font-medium text-foreground">Upload product photo</p>
                                    <p className="text-xs">JPG, PNG up to 5 MB</p>
                                </div>
                            )}
                        </div>
                        {errors.image && (
                            <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle size={11} /> {errors.image}
                            </p>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>

                    {/* Details */}
                    <div className="rounded-2xl border border-border bg-white p-5 dark:bg-gray-900">
                        <SectionHeader
                            icon={Package}
                            title="Product details"
                            sub="Name, description, and category"
                            color="bg-green-50 text-green-600 dark:bg-green-950/30"
                        />
                        <div className="space-y-4">
                            <Field label="Product name" required error={errors.name}>
                                <input
                                    type="text"
                                    placeholder="e.g. Fresh Maize, Tomatoes, Fertiliser NPK"
                                    value={form.name}
                                    onChange={e => set('name', e.target.value)}
                                    className={inputCls(errors.name)}
                                />
                            </Field>
                            <Field label="Description" hint="Optional" error={errors.description}>
                                <textarea
                                    rows={3}
                                    placeholder="Quality, harvest date, storage, variety…"
                                    value={form.description}
                                    onChange={e => set('description', e.target.value)}
                                    className={`${inputCls(errors.description)} h-auto resize-none py-3`}
                                />
                            </Field>
                            <Field label="Category" required error={errors.category}>
                                <CategoryPicker
                                    value={form.category}
                                    error={errors.category}
                                    onChange={v => set('category', v as ProductCategory)}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="rounded-2xl border border-border bg-white p-5 dark:bg-gray-900">
                        <SectionHeader
                            icon={DollarSign}
                            title="Pricing & stock"
                            sub="Set your price and available quantity"
                            color="bg-blue-50 text-blue-600 dark:bg-blue-950/30"
                        />
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Field label="Unit price (RWF)" required error={errors.unitPrice}>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">RWF</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="100"
                                            placeholder="0"
                                            value={form.unitPrice || ''}
                                            onChange={e => set('unitPrice', Number(e.target.value))}
                                            className={`${inputCls(errors.unitPrice)} pl-10`}
                                        />
                                    </div>
                                </Field>
                                <Field label="Quantity" required error={errors.stockQuantity}>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0"
                                        value={form.stockQuantity || ''}
                                        onChange={e => set('stockQuantity', Number(e.target.value))}
                                        className={inputCls(errors.stockQuantity)}
                                    />
                                </Field>
                            </div>
                            <Field label="Measurement unit" required error={errors.measurementUnit}>
                                <select
                                    value={form.measurementUnit}
                                    onChange={e => set('measurementUnit', e.target.value as MeasurementUnit)}
                                    className={inputCls(errors.measurementUnit)}>
                                    <option value="">Select unit</option>
                                    {Object.entries(UNITS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </Field>
                            <div className="flex items-center justify-between rounded-xl border border-border bg-gray-50 p-3.5 dark:bg-gray-800/50">
                                <div>
                                    <p className="text-sm font-medium text-foreground">Allow negotiation</p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">Buyers can propose a different price</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => set('isNegotiable', !form.isNegotiable)}
                                    className="focus:outline-none">
                                    {form.isNegotiable
                                        ? <ToggleRight size={32} className="text-green-600" />
                                        : <ToggleLeft size={32} className="text-gray-400 dark:text-gray-600" />
                                    }
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="rounded-2xl border border-border bg-white p-5 dark:bg-gray-900">
                        <SectionHeader
                            icon={MapPin}
                            title="Location"
                            sub="Where this product is available"
                            color="bg-purple-50 text-purple-600 dark:bg-purple-950/30"
                        />
                        <Field label="District" required error={errors.district}>
                            <select
                                value={form.district}
                                onChange={e => set('district', e.target.value as District)}
                                className={inputCls(errors.district)}>
                                <option value="">Select district</option>
                                {DISTRICTS.map(d => (
                                    <option key={d} value={d}>
                                        {d.charAt(0) + d.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>
                </div>

                {/* Preview sidebar */}
                <div className="lg:col-span-1">
                    <div className="space-y-4 lg:sticky lg:top-4">
                        <div className="rounded-2xl border border-border bg-white p-4 dark:bg-gray-900">
                            <div className="mb-4 flex items-center gap-2">
                                <Eye size={14} className="text-green-600" />
                                <p className="text-sm font-bold text-foreground">Buyer preview</p>
                            </div>
                            <PreviewCard form={form} previewUrl={imagePreview} />
                        </div>
                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                            <div className="flex items-start gap-2.5">
                                <Info size={14} className="mt-0.5 shrink-0 text-blue-500" />
                                <div>
                                    <p className="mb-2 text-xs font-bold text-foreground">Tips for better visibility</p>
                                    <ul className="space-y-1.5 text-xs leading-relaxed text-blue-700 dark:text-blue-300">
                                        <li>• Use clear, well-lit photos of the actual product</li>
                                        <li>• Mention variety, quality grade, and harvest date</li>
                                        <li>• Keep stock quantity up to date</li>
                                        <li>• Enable negotiation for faster sales</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DetailPageShell>
    );
}
