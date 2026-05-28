'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, Package, DollarSign, MapPin,
  ImageIcon, Eye, Info, Upload, Check,
  Loader2, X, ToggleLeft, ToggleRight,
  ChevronDown, Sprout, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { notify } from '@/lib/notify';
import { imageUrl } from '@/lib/utils';
import { productService } from '@/services/products';
import SellerGuard from '@/contexts/guard/SellerGuard';
import { useProduct } from '@/contexts/ProductContext';
import { District, MeasurementUnit, Product, ProductCategory } from '@/types';
import { useProductAction } from '@/hooks/useProductAction';

// ── Enums (mirror backend) ────────────────────────────────────────────────────

const CATEGORIES: Record<string, string> = {
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

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Category picker ───────────────────────────────────────────────────────────

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
          {value ? CATEGORIES[value] : 'Select a category'}
        </span>
        <ChevronDown size={14} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-900 border border-border rounded-xl shadow-xl max-h-64 overflow-y-auto">
            {CATEGORY_GROUPS.map(({ group, keys }) => (
              <div key={group}>
                <p className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50 sticky top-0">
                  {group}
                </p>
                {keys.map(k => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => { onChange(k); setOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-green-50 dark:hover:bg-green-950/20 ${value === k ? 'text-green-600 font-semibold' : 'text-foreground'
                      }`}>
                    {CATEGORIES[k]}
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

// ── Live preview card ─────────────────────────────────────────────────────────

function PreviewCard({ form, previewUrl, originalImage }: {
  form: Partial<Product>; previewUrl: string | null; originalImage: string;
}) {
  const img = previewUrl ?? (originalImage ? imageUrl(originalImage) : null);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Image */}
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
            Negotiable
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <p className="font-bold text-foreground line-clamp-1">
          {form.name || 'Product name'}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {form.description || 'Description will appear here...'}
        </p>
        <div className="flex items-baseline gap-1.5 pt-1">
          <p className="text-base font-extrabold text-green-700 dark:text-green-400">
            {form.unitPrice
              ? new Intl.NumberFormat('rw-RW').format(Number(form.unitPrice)) + ' RWF'
              : '— RWF'}
          </p>
          <p className="text-xs text-muted-foreground">
            / {UNITS[form.measurementUnit?.toString()!]?.split(' ')[0].toLowerCase() || 'unit'}
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
          <span>{form.stockQuantity || '0'} left</span>
          <span>{form.district ? form.district.charAt(0) + form.district.slice(1).toLowerCase() : 'No district'}</span>
        </div>
      </div>
    </div>
  );
}

// ── Edit form ─────────────────────────────────────────────────────────────────

function EditProductForm() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const { fetchProductById } = useProduct()
  const productId = params.id as string;

  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const { updateProduct } = useProductAction()
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

  // ── Load product ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!productId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchProductById(productId);
        if (!res) {
          notify.error('Failed to load product');
          router.push('/seller/listings');
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
        notify.error('Failed to load product');
        router.push('/seller/listings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  // ── Handlers ──────────────────────────────────────────────────────────

  const set = (field: keyof FormData, value: string | boolean) => {
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
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
    if (errors.image) setErrors(p => ({ ...p, image: undefined }));
  };

  // ── Validation ────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: FieldErrors = {};
    if (!form.name?.trim()) e.name = 'Name is required';
    if (!form.category) e.category = 'Select a category';
    if (!form.description?.trim()) e.description = 'Description is required';
    if (!form.unitPrice || Number(form.unitPrice) <= 0) e.unitPrice = 'Enter a valid price';
    if (!form.stockQuantity || Number(form.stockQuantity) <= 0) e.stockQuantity = 'Enter a valid quantity';
    if (!form.measurementUnit) e.measurementUnit = 'Select a unit';
    if (!form.district) e.district = 'Select a district';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────

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
      notify.success('Product updated successfully');
      router.push('/seller/listings');
    } catch {
      notify.error('Failed to update product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-green-600 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading product…</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950">

      {/* Header */}
      <header className="sticky top-0 z-40 h-14 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-border flex items-center justify-between px-4">
        <Link
          href="/products/seller"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={16} /> My listings
        </Link>
        <div className="flex items-center gap-1.5">
          <Sprout size={16} className="text-green-600" />
          <span className="text-sm font-bold text-foreground">Edit listing</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="h-8 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5">
          {submitting
            ? <><Loader2 size={12} className="animate-spin" /> Saving…</>
            : <><Check size={12} /> Save</>
          }
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 h-screen overflow-auto pb-40">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left: Form ─────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Image */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5">
                <SectionHeader
                  icon={ImageIcon}
                  title="Product image"
                  sub="Update the photo buyers see"
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
                          <Upload size={14} /> Change image
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
                      <p className="text-sm font-medium text-foreground">Upload image</p>
                      <p className="text-xs">JPG, PNG up to 5 MB</p>
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

              {/* Basic info */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5">
                <SectionHeader
                  icon={Package}
                  title="Product details"
                  sub="Essential information about your listing"
                  color="bg-green-50 dark:bg-green-950/30 text-green-600"
                />
                <div className="space-y-4">
                  <Field label="Product name" required error={errors.name}>
                    <input
                      type="text"
                      placeholder="e.g. Fresh Maize, NPK Fertiliser"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      className={inputCls(errors.name)}
                    />
                  </Field>

                  <Field label="Category" required error={errors.category}>
                    <CategoryPicker
                      value={form.category?.toString()!}
                      error={errors.category}
                      onChange={v => set('category', v)}
                    />
                  </Field>

                  <Field label="Description" error={errors.description}>
                    <textarea
                      rows={3}
                      placeholder="Quality, variety, harvest date, storage conditions…"
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                      className={`${inputCls(errors.description)} h-auto py-3 resize-none`}
                    />
                  </Field>
                </div>
              </div>

              {/* Pricing & stock */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5">
                <SectionHeader
                  icon={DollarSign}
                  title="Pricing & stock"
                  sub="Set your price and available quantity"
                  color="bg-blue-50 dark:bg-blue-950/30 text-blue-600"
                />
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Unit price (RWF)" required error={errors.unitPrice}>
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

                    <Field label="Quantity" required error={errors.stockQuantity}>
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

                  <Field label="Measurement unit" required error={errors.measurementUnit}>
                    <select
                      value={form.measurementUnit}
                      onChange={e => set('measurementUnit', e.target.value)}
                      className={inputCls(errors.measurementUnit)}>
                      <option value="">Select unit</option>
                      {Object.entries(UNITS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
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
                      onClick={() => set('isNegotiable', !form.isNegotiable)}>
                      {form.isNegotiable
                        ? <ToggleRight size={32} className="text-green-600" />
                        : <ToggleLeft size={32} className="text-gray-400 dark:text-gray-600" />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5">
                <SectionHeader
                  icon={MapPin}
                  title="Location"
                  sub="Where this product is available"
                  color="bg-purple-50 dark:bg-purple-950/30 text-purple-600"
                />
                <Field label="District" required error={errors.district}>
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

            </div>

            {/* ── Right: Preview + tips ──────────────────────── */}
            <div className="lg:col-span-1 space-y-4">
              <div className="sticky top-20 space-y-4">

                {/* Preview */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye size={14} className="text-green-600" />
                    <p className="text-sm font-bold text-foreground">Buyer preview</p>
                  </div>
                  <PreviewCard
                    form={form}
                    previewUrl={previewUrl}
                    originalImage={originalProduct?.image ?? ''}
                  />
                </div>

                {/* Tips */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-2xl p-4">
                  <div className="flex items-start gap-2.5">
                    <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-foreground mb-2">Tips for better visibility</p>
                      <ul className="space-y-1.5 text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
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

          {/* Bottom bar */}
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-border px-4 py-3">
            <div className="max-w-5xl mx-auto flex items-center gap-3">
              <Link
                href="/seller/listings"
                className="flex-1 h-11 border border-border rounded-xl text-sm font-medium text-foreground flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] h-11 bg-green-600 hover:bg-green-700 disabled:opacity-60 active:scale-[0.98] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all">
                {submitting ? (
                  <><Loader2 size={15} className="animate-spin" /> Saving changes…</>
                ) : (
                  <><Check size={15} /> Save changes</>
                )}
              </button>
            </div>
          </div>

          {/* Spacer for bottom bar */}
          <div className="h-20" />
        </form>
      </main>
    </div>
  );
}

// ── Export with guard ─────────────────────────────────────────────────────────

export default function EditProductPage() {
  return (
    <SellerGuard>
      <EditProductForm />
    </SellerGuard>
  );
}