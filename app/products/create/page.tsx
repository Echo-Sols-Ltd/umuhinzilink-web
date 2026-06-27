'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
    Upload, X, Check, ChevronDown,
    Package, MapPin,
    DollarSign, Info, ImagePlus, AlertCircle,
    ToggleLeft, ToggleRight,
} from 'lucide-react';
import { District, MeasurementUnit, ProductCategory, ProductRequest } from '@/types';
import { useProductAction } from '@/hooks/useProductAction';
import { useI18n } from '@/contexts/I18nContext';
import { formatCurrency } from '@/lib/localeFormat';
import DetailPageShell from '@/components/layout/DetailPageShell';
import AppLayout from '@/components/layout/AppLayout';

const CATEGORY_GROUPS = [
    { groupKey: 'produce', items: ['CEREALS', 'LEGUMES_PULSES', 'ROOTS_TUBERS', 'BANANAS_PLANTAINS', 'VEGETABLES', 'FRUITS', 'CASH_CROPS', 'OILSEEDS', 'SPICES_HERBS', 'FODDER_FORAGE'] },
    { groupKey: 'inputs', items: ['FERTILISER', 'PESTICIDE', 'HERBICIDE', 'FUNGICIDE', 'SEEDS_SEEDLINGS', 'IRRIGATION', 'HAND_TOOLS', 'MACHINERY', 'STORAGE_EQUIPMENT', 'PACKAGING', 'ANIMAL_FEED', 'VETERINARY'] },
    { groupKey: 'other', items: ['OTHER'] },
] as const;

const UNIT_KEYS = Object.keys(MeasurementUnit) as (keyof typeof MeasurementUnit)[];

const DISTRICTS = [
    'BUGESERA', 'BURERA', 'GAKENKE', 'GASABO', 'GATSIBO', 'GICUMBI', 'GISAGARA', 'HUYE',
    'KAMONYI', 'KARONGI', 'KAYONZA', 'KICUKIRO', 'KIREHE', 'MUHANGA', 'MUSANZE', 'NGOMA',
    'NGORORERO', 'NYABIHU', 'NYAGATARE', 'NYAMASHEKE', 'NYANZA', 'NYARUGENGE',
    'NYARUGURU', 'RUBAVU', 'RUHANGO', 'RULINDO', 'RUSIZI', 'RUTSIRO', 'RWAMAGANA',
];

interface ProductFormData {
    name: string;
    description: string;
    category: string;
    unitPrice: string;
    stockQuantity: string;
    measurementUnit: string;
    district: string;
    isNegotiable: boolean;
    image: string;
}

type FieldErrors = Partial<Record<keyof ProductFormData, string>>;

const inputCls = (err?: string) =>
    `w-full h-11 px-3.5 rounded-xl border text-sm text-foreground bg-gray-50 dark:bg-gray-800/60 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${err ? 'border-red-400' : 'border-border'
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

export default function CreateProduct() {
    const { createProduct } = useProductAction();
    const { t, locale } = useI18n();
    const [form, setForm] = useState<ProductRequest>({
        name: '',
        description: '',
        category: ProductCategory.ANIMAL_FEED,
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
    const [catOpen, setCatOpen] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<File | null>(null);

    const validate = (): boolean => {
        const e: FieldErrors = {};
        if (!form.name.trim()) e.name = t('products.create.validation.nameRequired');
        if (!form.description.trim()) e.description = t('products.create.validation.descriptionRequired');
        if (!form.category) e.category = t('products.create.validation.categoryRequired');
        if (!form.unitPrice || isNaN(Number(form.unitPrice)) || Number(form.unitPrice) <= 0)
            e.unitPrice = t('products.create.validation.priceInvalid');
        if (!form.stockQuantity || isNaN(Number(form.stockQuantity)) || Number(form.stockQuantity) <= 0)
            e.stockQuantity = t('products.create.validation.quantityInvalid');
        if (!form.measurementUnit) e.measurementUnit = t('products.create.validation.unitRequired');
        if (!form.district) e.district = t('products.create.validation.districtRequired');
        if (!form.image) e.image = t('products.create.validation.imageRequired');
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const set = (field: keyof ProductFormData, value: string | boolean) => {
        setForm(p => ({ ...p, [field]: value }));
        if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }));
    };

    const categoryDisplay = (key: string) => {
        const label = t(`enums.categories.${key}`);
        return label !== `enums.categories.${key}` ? label : key;
    };

    const unitDisplay = (key: keyof typeof MeasurementUnit) => t(`enums.units.${key}`);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setErrors(p => ({ ...p, image: t('products.create.validation.imageSize') }));
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
            // handle error
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        const unitKey = Object.entries(MeasurementUnit).find(([, v]) => v === form.measurementUnit)?.[0];
        return (
            <AppLayout maxWidth="max-w-lg" mainClassName="flex items-center justify-center min-h-[60vh]">
                <div className="max-w-sm w-full text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-6">
                        <Check size={36} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-foreground">{t('products.create.success.title')}</h2>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {t('products.create.success.description', { name: form.name })}
                    </p>

                    {imagePreview && (
                        <div className="mt-6 rounded-2xl overflow-hidden border border-border bg-white dark:bg-gray-900 text-left">
                            <img src={imagePreview} alt={form.name} className="w-full h-40 object-cover" />
                            <div className="p-4">
                                <p className="font-bold text-foreground">{form.name}</p>
                                <p className="text-sm text-green-600 font-semibold mt-1">
                                    {formatCurrency(Number(form.unitPrice), locale)} / {unitKey ? unitDisplay(unitKey as keyof typeof MeasurementUnit) : form.measurementUnit}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 mt-6">
                        <button
                            onClick={() => { setForm({ name: '', description: '', category: ProductCategory.ANIMAL_FEED, unitPrice: 0, stockQuantity: 0, measurementUnit: MeasurementUnit.KG, district: District.BUGESERA, image: '', isNegotiable: false }); setImagePreview(null); setSuccess(false); }}
                            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors">
                            <Package size={16} /> {t('products.create.success.addAnother')}
                        </button>
                        <Link
                            href="/products/seller"
                            className="w-full h-11 border border-border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-foreground font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors">
                            {t('products.create.success.viewListings')}
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const publishButton = (
        <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="h-8 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors"
        >
            {loading ? t('products.create.publishing') : t('products.create.publish')}
        </button>
    );

    const selectedCategoryKey = Object.keys(ProductCategory).find(
        k => ProductCategory[k as keyof typeof ProductCategory] === form.category
    ) ?? String(form.category);

    return (
        <DetailPageShell
            maxWidth="max-w-lg"
            breadcrumbs={[
                { label: t('products.create.breadcrumbs.home'), href: '/' },
                { label: t('products.create.breadcrumbs.myListings'), href: '/products/seller' },
                { label: t('products.create.breadcrumbs.newListing') },
            ]}
            backHref="/products/seller"
            backLabel={t('products.create.backLabel')}
            actions={publishButton}
            className="pb-24"
        >
            <div className="space-y-4">

                <div
                    onClick={() => fileRef.current?.click()}
                    className={`relative w-full h-52 rounded-2xl overflow-hidden border-2 border-dashed cursor-pointer transition-colors ${errors.image
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
                                    <ImagePlus size={16} /> {t('products.create.image.change')}
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
                            <p className="text-sm font-medium text-foreground">{t('products.create.image.upload')}</p>
                            <p className="text-xs">{t('products.create.image.hint')}</p>
                        </div>
                    )}
                </div>
                {errors.image && (
                    <p className="flex items-center gap-1 text-xs text-red-500 -mt-2">
                        <AlertCircle size={11} /> {errors.image}
                    </p>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <Package size={13} /> {t('products.create.sections.details')}
                    </div>

                    <Field label={t('products.create.fields.name')} error={errors.name}>
                        <input
                            type="text"
                            placeholder={t('products.create.fields.namePlaceholder')}
                            value={form.name}
                            onChange={e => set('name', e.target.value)}
                            className={inputCls(errors.name)}
                        />
                    </Field>

                    <Field label={t('products.create.fields.description')} hint={t('products.create.fields.descriptionOptional')} error={errors.description}>
                        <textarea
                            rows={3}
                            placeholder={t('products.create.fields.descriptionPlaceholder')}
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                            className={`${inputCls(errors.description)} h-auto py-3 resize-none`}
                        />
                    </Field>

                    <Field label={t('products.create.fields.category')} error={errors.category}>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setCatOpen(v => !v)}
                                className={`${inputCls(errors.category)} flex items-center justify-between text-left`}>
                                <span className={form.category ? 'text-foreground' : 'text-muted-foreground'}>
                                    {form.category ? categoryDisplay(selectedCategoryKey) : t('products.create.fields.selectCategory')}
                                </span>
                                <ChevronDown size={15} className={`shrink-0 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {catOpen && (
                                <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-900 border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
                                    {CATEGORY_GROUPS.map(({ groupKey, items }) => (
                                        <div key={groupKey}>
                                            <p className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50 sticky top-0">
                                                {t(`products.create.categoryGroups.${groupKey}`)}
                                            </p>
                                            {items.map(item => (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() => { set('category', ProductCategory[item as keyof typeof ProductCategory] ?? item); setCatOpen(false); }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-green-50 dark:hover:bg-green-950/20 ${selectedCategoryKey === item ? 'text-green-600 font-semibold' : 'text-foreground'
                                                        }`}>
                                                    {categoryDisplay(item)}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Field>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <DollarSign size={13} /> {t('products.create.sections.pricing')}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label={t('products.create.fields.unitPrice')} error={errors.unitPrice}>
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

                        <Field label={t('products.create.fields.quantity')} error={errors.stockQuantity}>
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

                    <Field label={t('products.create.fields.measurementUnit')} error={errors.measurementUnit}>
                        <select
                            value={form.measurementUnit}
                            onChange={e => set('measurementUnit', e.target.value)}
                            className={inputCls(errors.measurementUnit)}>
                            <option value="">{t('products.create.fields.selectUnit')}</option>
                            {UNIT_KEYS.map(u => (
                                <option key={u} value={MeasurementUnit[u]}>{unitDisplay(u)}</option>
                            ))}
                        </select>
                    </Field>

                    <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-border">
                        <div>
                            <p className="text-sm font-medium text-foreground">{t('products.create.fields.negotiable')}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{t('products.create.fields.negotiableHint')}</p>
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

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <MapPin size={13} /> {t('products.create.sections.location')}
                    </div>

                    <Field label={t('products.create.fields.district')} error={errors.district}>
                        <select
                            value={form.district}
                            onChange={e => set('district', e.target.value)}
                            className={inputCls(errors.district)}>
                            <option value="">{t('products.create.fields.selectDistrict')}</option>
                            {DISTRICTS.map(d => (
                                <option key={d} value={d}>
                                    {d.charAt(0) + d.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>

                <div className="flex items-start gap-2.5 px-1">
                    <Info size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {t('products.create.infoNote')}
                    </p>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-border px-4 py-3">
                <div className="max-w-lg mx-auto flex items-center gap-3">
                    <Link
                        href="/products/seller"
                        className="flex-1 h-11 border border-border rounded-xl text-sm font-medium text-foreground flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        {t('products.create.cancel')}
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
                                {t('products.create.publishing')}
                            </>
                        ) : (
                            <><Check size={16} /> {t('products.create.publishListing')}</>
                        )}
                    </button>
                </div>
            </div>
        </DetailPageShell>
    );
}
