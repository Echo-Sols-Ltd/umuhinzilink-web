'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package, DollarSign, MapPin,
  ImageIcon, Eye, Info, Upload, Check,
  Loader2, X, ToggleLeft, ToggleRight,
  ChevronDown, AlertCircle,
} from '@/lib/icons';
import { useAuth } from '@/contexts/AuthContext';
import { notify } from '@/lib/notify';
import { imageUrl } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';
import { formatCurrency } from '@/lib/localeFormat';
import SellerGuard from '@/contexts/guard/SellerGuard';
import { useProduct } from '@/contexts/ProductContext';
import { District, MeasurementUnit, Product, ProductCategory } from '@/types';
import { useProductAction } from '@/hooks/useProductAction';
import PageLoading from '@/components/layout/PageLoading';
import DetailPageShell from '@/components/layout/DetailPageShell';

const CATEGORY_GROUPS = [
  { groupKey: 'produce', keys: ['CEREALS', 'LEGUMES_PULSES', 'ROOTS_TUBERS', 'BANANAS_PLANTAINS', 'VEGETABLES', 'FRUITS', 'CASH_CROPS', 'OILSEEDS', 'SPICES_HERBS', 'FODDER_FORAGE'] },
  { groupKey: 'inputs', keys: ['FERTILISER', 'PESTICIDE', 'HERBICIDE', 'FUNGICIDE', 'SEEDS_SEEDLINGS', 'IRRIGATION', 'HAND_TOOLS', 'MACHINERY', 'STORAGE_EQUIPMENT', 'PACKAGING', 'ANIMAL_FEED', 'VETERINARY'] },
  { groupKey: 'other', keys: ['OTHER'] },
] as const;

const UNIT_KEYS = Object.keys(MeasurementUnit) as (keyof typeof MeasurementUnit)[];

const DISTRICTS = [
  'BUGESERA', 'BURERA', 'GAKENKE', 'GASABO', 'GATSIBO', 'GICUMBI', 'GISAGARA', 'HUYE',
  'KAMONYI', 'KARONGI', 'KAYONZA', 'KICUKIRO', 'KIREHE', 'MUHANGA', 'MUSANZE', 'NGOMA',
  'NGORORERO', 'NYABIHU', 'NYAGATARE', 'NYAMASHEKE', 'NYANZA', 'NYARUGENGE',
  'NYARUGURU', 'RUBAVU', 'RUHANGO', 'RULINDO', 'RUSIZI', 'RUTSIRO', 'RWAMAGANA',
];

interface FormData {
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

type FieldErrors = Partial<Record<keyof FormData, string>>;

const inputCls = (err?: string) =>
  `w-full h-11 px-3.5 text-sm text-foreground bg-gray-50 dark:bg-gray-800/60 border rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${err ? 'border-red-400' : 'border-border'
  }`;

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
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
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function CategoryPicker({ value, error, onChange, t }: {
  value: string; error?: string; onChange: (v: string) => void;
  t: (key: string) => string;
}) {
  const [open, setOpen] = useState(false);

  const categoryDisplay = (key: string) => {
    const label = t(`enums.categories.${key}`);
    return label !== `enums.categories.${key}` ? label : key;
  };

  const selectedKey = Object.keys(ProductCategory).find(
    k => ProductCategory[k as keyof typeof ProductCategory] === value
  ) ?? value;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`${inputCls(error)} flex items-center justify-between text-left`}>
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
          {value ? categoryDisplay(selectedKey) : t('products.edit.fields.selectCategory')}
        </span>
        <ChevronDown size={14} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-900 border border-border rounded-xl shadow-xl max-h-64 overflow-y-auto">
            {CATEGORY_GROUPS.map(({ groupKey, keys }) => (
              <div key={groupKey}>
                <p className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50 sticky top-0">
                  {t(`products.edit.categoryGroups.${groupKey}`)}
                </p>
                {keys.map(k => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => { onChange(ProductCategory[k as keyof typeof ProductCategory] ?? k); setOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-green-50 dark:hover:bg-green-950/20 ${selectedKey === k ? 'text-green-600 font-semibold' : 'text-foreground'
                      }`}>
                    {categoryDisplay(k)}
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

function PreviewCard({ form, previewUrl, originalImage, t, locale }: {
  form: Partial<Product>; previewUrl: string | null; originalImage: string;
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: import('@/lib/i18n').SupportedLocale;
}) {
  const img = previewUrl ?? (originalImage ? imageUrl(originalImage) : null);
  const unitKey = Object.entries(MeasurementUnit).find(([, v]) => v === form.measurementUnit)?.[0];
  const unit = unitKey ? t(`enums.units.${unitKey}`).toLowerCase() : 'unit';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
        {img ? (
          <img src={img} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={32} className="text-gray-300" />
          </div>
        )}
        {form.isNegotiable && (
          <span className="absolute top-2.5 left-2.5 text-xs font-semibold text-white bg-green-600/90 px-2 py-0.5 rounded-full">
            {t('products.edit.preview.negotiable')}
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <p className="font-bold text-foreground line-clamp-1">
          {form.name || t('products.edit.preview.namePlaceholder')}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {form.description || t('products.edit.preview.descriptionPlaceholder')}
        </p>
        <div className="flex items-baseline gap-1.5 pt-1">
          <p className="text-base font-extrabold text-green-700 dark:text-green-400">
            {form.unitPrice
              ? formatCurrency(Number(form.unitPrice), locale)
              : '— RWF'}
          </p>
          <p className="text-xs text-muted-foreground">/ {unit}</p>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
          <span>{t('products.edit.preview.left', { count: form.stockQuantity || '0' })}</span>
          <span>{form.district ? form.district.charAt(0) + form.district.slice(1).toLowerCase() : t('products.edit.preview.noDistrict')}</span>
        </div>
      </div>
    </div>
  );
}

function EditProductForm() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const { fetchProductById } = useProduct();
  const productId = params.id as string;

  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const { updateProduct } = useProductAction();
  const [form, setForm] = useState<Partial<Product>>({
    name: '', description: '',
    category: ProductCategory.VEGETABLES,
    unitPrice: 0,
    stockQuantity: 0,
    measurementUnit: MeasurementUnit.KG,
    district: District.BUGESERA,
    isNegotiable: false,
    image: '',
  });

  const unitDisplay = (key: keyof typeof MeasurementUnit) => t(`enums.units.${key}`);

  useEffect(() => {
    if (!productId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchProductById(productId);
        if (!res) {
          notify.error(t('products.edit.loadFailed'));
          router.push('/products/seller');
          return;
        }
        setOriginalProduct(res);
        setForm({
          name: res.name,
          description: res.description,
          category: res.category,
          unitPrice: res.unitPrice,
          stockQuantity: res.stockQuantity,
          measurementUnit: res.measurementUnit,
          district: res.district,
          isNegotiable: res.isNegotiable,
          image: res.image,
        });
      } catch {
        notify.error(t('products.edit.loadFailed'));
        router.push('/products/seller');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId, fetchProductById, router, t]);

  const set = (field: keyof FormData, value: string | boolean) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(p => ({ ...p, image: t('products.edit.validation.imageSize') }));
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
    if (errors.image) setErrors(p => ({ ...p, image: undefined }));
  };

  const validate = (): boolean => {
    const e: FieldErrors = {};
    if (!form.name?.trim()) e.name = t('products.edit.validation.nameRequired');
    if (!form.category) e.category = t('products.edit.validation.categoryRequired');
    if (!form.description?.trim()) e.description = t('products.edit.validation.descriptionRequired');
    if (!form.unitPrice || Number(form.unitPrice) <= 0) e.unitPrice = t('products.edit.validation.priceInvalid');
    if (!form.stockQuantity || Number(form.stockQuantity) <= 0) e.stockQuantity = t('products.edit.validation.quantityInvalid');
    if (!form.measurementUnit) e.measurementUnit = t('products.edit.validation.unitRequired');
    if (!form.district) e.district = t('products.edit.validation.districtRequired');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await updateProduct(productId, {
        name: form.name!,
        description: form.description!,
        category: form.category!,
        district: form.district!,
        unitPrice: form.unitPrice!,
        stockQuantity: form.stockQuantity!,
        measurementUnit: form.measurementUnit!,
        isNegotiable: form.isNegotiable!,
        image: form.image!,
      }, imageFile!);

      await new Promise(r => setTimeout(r, 1200));
      notify.success(t('products.updated.success'));
      router.push('/products/seller');
    } catch {
      notify.error(t('products.edit.updateFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLoading
        label={t('products.edit.loadingLabel')}
        description={t('products.edit.loadingDescription')}
      />
    );
  }

  const saveButton = (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={submitting}
      className="h-8 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
    >
      {submitting
        ? <><Loader2 size={12} className="animate-spin" /> {t('products.edit.saving')}</>
        : <><Check size={12} /> {t('products.edit.save')}</>
      }
    </button>
  );

  // ── Render ────────────────────────────────────────────────────────────

  const footer = (
    <div className="flex items-center gap-3">
      <Link
        href="/products/seller"
        className="flex h-11 flex-1 items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
        Cancel
      </Link>
      <button
        type="submit"
        form="edit-product-form"
        disabled={submitting}
        className="flex h-11 flex-[2] items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition-all hover:bg-green-700 active:scale-[0.98] disabled:opacity-60">
        {submitting ? (
          <><Loader2 size={15} className="animate-spin" /> Saving changes…</>
        ) : (
          <><Check size={15} /> Save changes</>
        )}
      </button>
    </div>
  );

  return (
    <DetailPageShell
      maxWidth="max-w-5xl"
      breadcrumbs={[
        { label: t('products.edit.breadcrumbs.home'), href: '/' },
        { label: t('products.edit.breadcrumbs.myListings'), href: '/products/seller' },
        { label: originalProduct?.name ?? t('products.edit.breadcrumbs.editListing') },
      ]}
      backHref="/products/seller"
      backLabel={t('products.edit.backLabel')}
      actions={saveButton}
      footer={footer}
    >
        <form id="edit-product-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 space-y-4">

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5">
                <SectionHeader
                  icon={ImageIcon}
                  title={t('products.edit.sections.image')}
                  sub={t('products.edit.sections.imageSub')}
                  color="bg-amber-50 dark:bg-amber-950/30 text-amber-600"
                />
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`relative h-44 rounded-xl overflow-hidden border-2 border-dashed cursor-pointer transition-colors ${previewUrl || (originalProduct?.image)
                    ? 'border-transparent'
                    : 'border-border hover:border-green-400 bg-gray-50 dark:bg-gray-800/50'
                    }`}>
                  {previewUrl || originalProduct?.image ? (
                    <>
                      <img
                        src={previewUrl ?? imageUrl(originalProduct?.image)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium flex items-center gap-2">
                          <Upload size={14} /> {t('products.edit.image.change')}
                        </span>
                      </div>
                      {previewUrl && (
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setPreviewUrl(null); setImageFile(null); }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                          <X size={13} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Upload size={22} />
                      <p className="text-sm font-medium text-foreground">{t('products.edit.image.upload')}</p>
                      <p className="text-xs">{t('products.edit.image.hint')}</p>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-2">
                    <AlertCircle size={11} /> {errors.image}
                  </p>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5">
                <SectionHeader
                  icon={Package}
                  title={t('products.edit.sections.details')}
                  sub={t('products.edit.sections.detailsSub')}
                  color="bg-green-50 dark:bg-green-950/30 text-green-600"
                />
                <div className="space-y-4">
                  <Field label={t('products.edit.fields.name')} required error={errors.name}>
                    <input
                      type="text"
                      placeholder={t('products.edit.fields.namePlaceholder')}
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      className={inputCls(errors.name)}
                    />
                  </Field>

                  <Field label={t('products.edit.fields.category')} required error={errors.category}>
                    <CategoryPicker
                      value={form.category?.toString()!}
                      error={errors.category}
                      onChange={v => set('category', v)}
                      t={t}
                    />
                  </Field>

                  <Field label={t('products.edit.fields.description')} error={errors.description}>
                    <textarea
                      rows={3}
                      placeholder={t('products.edit.fields.descriptionPlaceholder')}
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                      className={`${inputCls(errors.description)} h-auto py-3 resize-none`}
                    />
                  </Field>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5">
                <SectionHeader
                  icon={DollarSign}
                  title={t('products.edit.sections.pricing')}
                  sub={t('products.edit.sections.pricingSub')}
                  color="bg-blue-50 dark:bg-blue-950/30 text-blue-600"
                />
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t('products.edit.fields.unitPrice')} required error={errors.unitPrice}>
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

                    <Field label={t('products.edit.fields.quantity')} required error={errors.stockQuantity}>
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

                  <Field label={t('products.edit.fields.measurementUnit')} required error={errors.measurementUnit}>
                    <select
                      value={form.measurementUnit}
                      onChange={e => set('measurementUnit', e.target.value)}
                      className={inputCls(errors.measurementUnit)}>
                      <option value="">{t('products.edit.fields.selectUnit')}</option>
                      {UNIT_KEYS.map(k => (
                        <option key={k} value={MeasurementUnit[k]}>{unitDisplay(k)}</option>
                      ))}
                    </select>
                  </Field>

                  <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">{t('products.edit.fields.negotiable')}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t('products.edit.fields.negotiableHint')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => set('isNegotiable', !form.isNegotiable)}>
                      {form.isNegotiable
                        ? <ToggleRight size={32} className="text-green-600" />
                        : <ToggleLeft size={32} className="text-gray-400 dark:text-gray-600" />
                      }
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5">
                <SectionHeader
                  icon={MapPin}
                  title={t('products.edit.sections.location')}
                  sub={t('products.edit.sections.locationSub')}
                  color="bg-purple-50 dark:bg-purple-950/30 text-purple-600"
                />
                <Field label={t('products.edit.fields.district')} required error={errors.district}>
                  <select
                    value={form.district}
                    onChange={e => set('district', e.target.value)}
                    className={inputCls(errors.district)}>
                    <option value="">{t('products.edit.fields.selectDistrict')}</option>
                    {DISTRICTS.map(d => (
                      <option key={d} value={d}>
                        {d.charAt(0) + d.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

            </div>

            <div className="lg:col-span-1 space-y-4">
              <div className="sticky top-28 space-y-4">

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye size={14} className="text-green-600" />
                    <p className="text-sm font-bold text-foreground">{t('products.edit.preview.title')}</p>
                  </div>
                  <PreviewCard
                    form={form}
                    previewUrl={previewUrl}
                    originalImage={originalProduct?.image ?? ''}
                    t={t}
                    locale={locale}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-2xl p-4">
                  <div className="flex items-start gap-2.5">
                    <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-foreground mb-2">{t('products.edit.tips.title')}</p>
                      <ul className="space-y-1.5 text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                        <li>• {t('products.edit.tips.photo')}</li>
                        <li>• {t('products.edit.tips.details')}</li>
                        <li>• {t('products.edit.tips.stock')}</li>
                        <li>• {t('products.edit.tips.negotiate')}</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </form>
    </DetailPageShell>
  );
}

export default function EditProductPage() {
  return (
    <SellerGuard>
      <EditProductForm />
    </SellerGuard>
  );
}
