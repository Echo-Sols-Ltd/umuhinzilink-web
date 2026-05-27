'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
    ChevronLeft, Upload, X, Check, ChevronDown,
    Sprout, Package, MapPin, Tag, Scale,
    DollarSign, Info, ImagePlus, AlertCircle,
    ToggleLeft, ToggleRight,
} from 'lucide-react';

// ── Enums (mirror backend) ────────────────────────────────────────────────────

const CATEGORIES = [
    { group: 'Produce', items: ['CEREALS', 'LEGUMES_PULSES', 'ROOTS_TUBERS', 'BANANAS_PLANTAINS', 'VEGETABLES', 'FRUITS', 'CASH_CROPS', 'OILSEEDS', 'SPICES_HERBS', 'FODDER_FORAGE'] },
    { group: 'Inputs & Equipment', items: ['FERTILISER', 'PESTICIDE', 'HERBICIDE', 'FUNGICIDE', 'SEEDS_SEEDLINGS', 'IRRIGATION', 'HAND_TOOLS', 'MACHINERY', 'STORAGE_EQUIPMENT', 'PACKAGING', 'ANIMAL_FEED', 'VETERINARY'] },
    { group: 'Other', items: ['OTHER'] },
];

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

const UNITS = [
    { value: 'KG', label: 'Kilogram (kg)' },
    { value: 'G', label: 'Gram (g)' },
    { value: 'TON', label: 'Metric Ton' },
    { value: 'LITER', label: 'Liter' },
    { value: 'ML', label: 'Milliliter' },
    { value: 'BAG_25KG', label: '25 kg Bag' },
    { value: 'BAG_50KG', label: '50 kg Bag' },
    { value: 'BAG_100KG', label: '100 kg Bag' },
    { value: 'CRATE', label: 'Crate' },
    { value: 'BUNDLE', label: 'Bundle' },
    { value: 'BUNCH', label: 'Bunch' },
    { value: 'PIECE', label: 'Piece' },
    { value: 'DOZEN', label: 'Dozen' },
    { value: 'JERRICAN', label: 'Jerrican' },
    { value: 'SACK', label: 'Sack' },
];

const DISTRICTS = [
    'BUGESERA','BURERA','GAKENKE','GASABO','GATSIBO','GICUMBI','GISAGARA','HUYE',
    'KAMONYI','KARONGI','KAYONZA','KICUKIRO','KIREHE','MUHANGA','MUSANZE','NGOMA',
    'NGORORERO','NYABIHU','NYAGATARE','NYAMASHEKE','NYANZA','NYARUGENGE',
    'NYARUGURU','RUBAVU','RUHANGO','RULINDO','RUSIZI','RUTSIRO','RWAMAGANA',
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProductFormData {
    name: string;
    description: string;
    category: string;
    unitPrice: string;
    stockQuantity: string;
    measurementUnit: string;
    district: string;
    isNegotiable: boolean;
    image: string; // base64 or URL — swap for file upload integration
}

type FieldErrors = Partial<Record<keyof ProductFormData, string>>;

// ── Helper ────────────────────────────────────────────────────────────────────

const inputCls = (err?: string) =>
    `w-full h-11 px-3.5 rounded-xl border text-sm text-foreground bg-gray-50 dark:bg-gray-800/60 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
        err ? 'border-red-400' : 'border-border'
    }`;

function Field({ label, hint, error, children }: {
    label: string; hint?: string; error?: string; children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">{label}</label>
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

// ── Main ──────────────────────────────────────────────────────────────────────

export default function CreateProduct() {
    const [form, setForm] = useState<ProductFormData>({
        name: '', description: '', category: '', unitPrice: '',
        stockQuantity: '', measurementUnit: '', district: '',
        isNegotiable: false, image: '',
    });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [catOpen, setCatOpen] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    // ── Validation ────────────────────────────────────────────────────────

    const validate = (): boolean => {
        const e: FieldErrors = {};
        if (!form.name.trim()) e.name = 'Product name is required';
        if (!form.description.trim()) e.description = 'Description is required';
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

    // ── Handlers ──────────────────────────────────────────────────────────

    const set = (field: keyof ProductFormData, value: string | boolean) => {
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
            // TODO: POST /api/v1/products with form data
            // await productService.create({ ...form, unitPrice: new BigDecimal(form.unitPrice), stockQuantity: ... });
            await new Promise(r => setTimeout(r, 1400));
            setSuccess(true);
        } catch {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    // ── Success state ─────────────────────────────────────────────────────

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
                <div className="max-w-sm w-full text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-6">
                        <Check size={36} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-foreground">Listing published!</h2>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        <span className="font-semibold text-foreground">{form.name}</span> is now live and visible to buyers across Rwanda.
                    </p>

                    {/* Preview card */}
                    {imagePreview && (
                        <div className="mt-6 rounded-2xl overflow-hidden border border-border bg-white dark:bg-gray-900 text-left">
                            <img src={imagePreview} alt={form.name} className="w-full h-40 object-cover" />
                            <div className="p-4">
                                <p className="font-bold text-foreground">{form.name}</p>
                                <p className="text-sm text-green-600 font-semibold mt-1">
                                    {Number(form.unitPrice).toLocaleString()} RWF / {UNITS.find(u => u.value === form.measurementUnit)?.label ?? form.measurementUnit}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 mt-6">
                        <button
                            onClick={() => { setForm({ name:'',description:'',category:'',unitPrice:'',stockQuantity:'',measurementUnit:'',district:'',isNegotiable:false,image:'' }); setImagePreview(null); setSuccess(false); }}
                            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors">
                            <Package size={16} /> Add another listing
                        </button>
                        <Link
                            href="/seller/listings"
                            className="w-full h-11 border border-border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-foreground font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors">
                            View my listings
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Form ──────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

            {/* Sticky header */}
            <header className="sticky top-0 z-40 h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4">
                <Link
                    href="/seller/listings"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft size={16} /> My listings
                </Link>
                <div className="flex items-center gap-1.5">
                    <Sprout size={16} className="text-green-600" />
                    <span className="text-sm font-bold text-foreground">New listing</span>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="h-8 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-semibold rounded-full transition-colors">
                    {loading ? 'Publishing…' : 'Publish'}
                </button>
            </header>

            <main className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-24">

                {/* Image upload */}
                <div
                    onClick={() => fileRef.current?.click()}
                    className={`relative w-full h-52 rounded-2xl overflow-hidden border-2 border-dashed cursor-pointer transition-colors ${
                        errors.image
                            ? 'border-red-400 bg-red-50 dark:bg-red-950/10'
                            : imagePreview
                            ? 'border-transparent'
                            : 'border-border bg-white dark:bg-gray-900 hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-950/10'
                    }`}>
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm font-medium flex items-center gap-2">
                                    <ImagePlus size={16} /> Change image
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={e => { e.stopPropagation(); setImagePreview(null); set('image', ''); }}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <Upload size={22} className="text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-foreground">Upload product photo</p>
                            <p className="text-xs">JPG, PNG up to 5 MB</p>
                        </div>
                    )}
                </div>
                {errors.image && (
                    <p className="flex items-center gap-1 text-xs text-red-500 -mt-2">
                        <AlertCircle size={11} /> {errors.image}
                    </p>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

                {/* Basic info */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <Package size={13} /> Product details
                    </div>

                    <Field label="Product name" error={errors.name}>
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
                            className={`${inputCls(errors.description)} h-auto py-3 resize-none`}
                        />
                    </Field>

                    {/* Category picker */}
                    <Field label="Category" error={errors.category}>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setCatOpen(v => !v)}
                                className={`${inputCls(errors.category)} flex items-center justify-between text-left`}>
                                <span className={form.category ? 'text-foreground' : 'text-muted-foreground'}>
                                    {form.category ? CATEGORY_LABELS[form.category] : 'Select a category'}
                                </span>
                                <ChevronDown size={15} className={`shrink-0 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {catOpen && (
                                <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-900 border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
                                    {CATEGORIES.map(({ group, items }) => (
                                        <div key={group}>
                                            <p className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50 sticky top-0">
                                                {group}
                                            </p>
                                            {items.map(item => (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() => { set('category', item); setCatOpen(false); }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-green-50 dark:hover:bg-green-950/20 ${
                                                        form.category === item ? 'text-green-600 font-semibold' : 'text-foreground'
                                                    }`}>
                                                    {CATEGORY_LABELS[item]}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Field>
                </div>

                {/* Pricing & quantity */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <DollarSign size={13} /> Pricing & stock
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Unit price (RWF)" error={errors.unitPrice}>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">RWF</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="100"
                                    placeholder="0"
                                    value={form.unitPrice}
                                    onChange={e => set('unitPrice', e.target.value)}
                                    className={`${inputCls(errors.unitPrice)} pl-10`}
                                />
                            </div>
                        </Field>

                        <Field label="Quantity" error={errors.stockQuantity}>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0"
                                value={form.stockQuantity}
                                onChange={e => set('stockQuantity', e.target.value)}
                                className={inputCls(errors.stockQuantity)}
                            />
                        </Field>
                    </div>

                    <Field label="Measurement unit" error={errors.measurementUnit}>
                        <select
                            value={form.measurementUnit}
                            onChange={e => set('measurementUnit', e.target.value)}
                            className={inputCls(errors.measurementUnit)}>
                            <option value="">Select unit</option>
                            {UNITS.map(u => (
                                <option key={u.value} value={u.value}>{u.label}</option>
                            ))}
                        </select>
                    </Field>

                    {/* Negotiable toggle */}
                    <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-border">
                        <div>
                            <p className="text-sm font-medium text-foreground">Allow negotiation</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Buyers can propose a different price</p>
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

                {/* Location */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <MapPin size={13} /> Location
                    </div>

                    <Field label="District" error={errors.district}>
                        <select
                            value={form.district}
                            onChange={e => set('district', e.target.value)}
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

                {/* Info note */}
                <div className="flex items-start gap-2.5 px-1">
                    <Info size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Stock is reserved when a buyer places an order. Keep your quantity updated to avoid overselling.
                    </p>
                </div>

            </main>

            {/* Sticky bottom bar */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-border px-4 py-3">
                <div className="max-w-lg mx-auto flex items-center gap-3">
                    <Link
                        href="/seller/listings"
                        className="flex-1 h-11 border border-border rounded-xl text-sm font-medium text-foreground flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        Cancel
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-[2] h-11 bg-green-600 hover:bg-green-700 disabled:opacity-60 active:scale-[0.98] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all">
                        {loading ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
                                </svg>
                                Publishing…
                            </>
                        ) : (
                            <><Check size={16} /> Publish listing</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}