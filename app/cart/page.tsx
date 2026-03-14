'use client';

import React, { useState, useMemo } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { ShoppingCart, Truck, CreditCard, ChevronRight, Minus, Plus, Trash2, MapPin, Phone, Mail, User, CheckCircle2, AlertCircle, MessageCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem, CartItemType, PaymentMethod } from '@/types';
import { notify } from '@/lib/notify';

enum CheckoutStep {
  SHIPPING = 0,
  DELIVERY = 1,
  PAYMENT = 2
}

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, getCartTotal, negotiateItems, checkoutNormal, checkoutNegotiated, checkoutMixed } = useCart();
  const { user } = useAuth();
  const { t } = useI18n();
  const [step, setStep] = useState<CheckoutStep>(CheckoutStep.SHIPPING);

  // Helper functions for negotiation items
  const isNegotiationItem = (item: CartItem) => item.type === CartItemType.NEGOTIATION;
  const isAcceptedNegotiation = (item: CartItem) => item.type === CartItemType.NEGOTIATION_ACCEPTED;
  const getNegotiationStatus = (item: CartItem) => {
    if (isAcceptedNegotiation(item)) return { text: 'Accepted', color: 'text-green-600', bg: 'bg-green-50' };
    if (isNegotiationItem(item)) return { text: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return null;
  };
  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Form states
  const [formData, setFormData] = useState({
    firstName: user?.names?.split(' ')[0] || '',
    lastName: user?.names?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    landmark: '',
    deliveryOption: 'standard',
    paymentMethod: 'pod' // pod: Pay on Delivery, card: Credit/Debit
  });

  const subtotal = getCartTotal();
  const negotiationItemIds = useMemo(() => 
    cart?.items.filter(item => item.type === CartItemType.NEGOTIATION).map(item => item.id) || [], 
  [cart]);

  const hasPendingNegotiations = negotiationItemIds.length > 0;

  const shippingFee = formData.deliveryOption === 'standard' ? 0 : formData.deliveryOption === 'express' ? 5000 : 15000;
  const salesTax = subtotal * 0.18; // 18% VAT
  const total = subtotal + shippingFee + salesTax;

  const handleUpdateQuantity = (item: CartItem, delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      removeItem(item.id);
    } else {
      updateItem(item.id, { quantity: newQuantity });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < CheckoutStep.PAYMENT) {
      setStep(step + 1);
    } else {
      handlePlaceOrder();
    }
  };

  const handleBack = () => {
    if (step > CheckoutStep.SHIPPING) {
      setStep(step - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart?.items.length) return;
    
    // Determine checkout type based on cart items
    const hasNormalItems = cart.items.some(item => item.type === CartItemType.NORMAL);
    const hasAcceptedNegotiations = cart.items.some(item => item.type === CartItemType.NEGOTIATION_ACCEPTED);
    
    let result;
    const paymentMethod: PaymentMethod = formData.paymentMethod === 'pod' ? PaymentMethod.CASH_ON_DELIVERY : PaymentMethod.WALLET;
    
    if (hasNormalItems && hasAcceptedNegotiations) {
      // Mixed checkout
      result = await checkoutMixed({ paymentMethod });
    } else if (hasAcceptedNegotiations) {
      // Negotiated checkout only
      result = await checkoutNegotiated({ paymentMethod });
    } else {
      // Normal checkout only
      result = await checkoutNormal({ paymentMethod });
    }

    if (result) {
      notify.success('Your orders have been placed successfully!', 'Order Confirmed');
      // In a real app, redirect to order confirmation or orders page
    }
  };

  if (loading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className=" h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="bg-muted/30 p-8 rounded-full mb-6">
          <ShoppingCart className="w-16 h-16 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          href="/dashboard"
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-auto h-screen bg-[#F8F9FA] pb-20">
      {/* Header / Stepper Overlay */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold flex items-center gap-2">
             <span className="text-primary truncate max-w-[120px]">UmuhinziLink</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <div className={`flex items-center gap-2 ${step >= CheckoutStep.SHIPPING ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= CheckoutStep.SHIPPING ? 'border-primary bg-primary/10' : 'border-gray-200'}`}>
                {step > CheckoutStep.SHIPPING ? <CheckCircle2 className="w-5 h-5" /> : 1}
              </div>
              <span className="font-semibold">Shipping</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <div className={`flex items-center gap-2 ${step >= CheckoutStep.DELIVERY ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= CheckoutStep.DELIVERY ? 'border-primary bg-primary/10' : 'border-gray-200'}`}>
                {step > CheckoutStep.DELIVERY ? <CheckCircle2 className="w-5 h-5" /> : 2}
              </div>
              <span className="font-semibold">Delivery</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <div className={`flex items-center gap-2 ${step >= CheckoutStep.PAYMENT ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= CheckoutStep.PAYMENT ? 'border-primary bg-primary/10' : 'border-gray-200'}`}>
                3
              </div>
              <span className="font-semibold">Payment</span>
            </div>
          </div>

          <div className="text-sm font-medium text-gray-500">
            {cart.items.length} items in cart
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Order Summary (Consistent across steps) */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 sticky top-28">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Order Summary
            </h2>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
              {cart.items.map((item) => {
                const status = getNegotiationStatus(item);
                const isNegotiating = isNegotiationItem(item);
                
                return (
                  <div key={item.id} className="flex gap-4 items-center group">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                      <Image 
                        src={item.product.image || '/placeholder-product.png'} 
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      {isNegotiating && (
                        <div className="absolute top-1 right-1 bg-yellow-500 text-white rounded-full p-1">
                          <MessageCircle className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-gray-900 truncate">{item.product.name}</h3>
                        {status && (
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                            {status.text}
                          </span>
                        )}
                      </div>
                      
                      {/* Price Display */}
                      <div className="space-y-1 mb-2">
                        {isNegotiating ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 line-through">
                              {item.unitPrice.toLocaleString()} RWF
                            </span>
                            <span className="text-sm font-bold text-primary">
                              Proposed: {item.proposedPrice?.toLocaleString()} RWF
                            </span>
                            <span className="text-xs text-green-600 font-semibold">
                              Save {((item.unitPrice - (item.proposedPrice || 0)) / item.unitPrice * 100).toFixed(0)}%
                            </span>
                          </div>
                        ) : isAcceptedNegotiation(item) ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 line-through">
                              {item.unitPrice.toLocaleString()} RWF
                            </span>
                            <span className="text-sm font-bold text-green-600">
                              {item.proposedPrice?.toLocaleString()} RWF
                            </span>
                            <span className="text-xs text-green-600 font-semibold">
                              ✓ Accepted
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">{item.unitPrice.toLocaleString()} RWF</p>
                        )}
                      </div>

                      {/* Negotiation Timer */}
                      {isNegotiating && item.negotiationExpiresAt && (
                        <div className="flex items-center gap-1 text-xs text-yellow-600 mb-2">
                          <Clock className="w-3 h-3" />
                          <span>Expires in {getTimeRemaining(item.negotiationExpiresAt)}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                          <button 
                            onClick={() => handleUpdateQuantity(item, -1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item, 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-dashed border-gray-100 pt-6 space-y-3">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{subtotal.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Sales Tax (18%)</span>
                <span className="font-semibold text-gray-900">{salesTax.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping Fee</span>
                <span className="font-semibold text-gray-900">{shippingFee === 0 ? 'FREE' : `${shippingFee.toLocaleString()} RWF`}</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-4 border-t border-gray-100 text-primary">
                <span>Total Due</span>
                <span>{total.toLocaleString()} RWF</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-8">
               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Discount Code"
                    className="w-full bg-gray-50 border-none rounded-xl h-12 pl-4 pr-24 focus:ring-2 focus:ring-primary/20"
                  />
                  <button className="absolute right-2 top-2 bottom-2 px-4 bg-white text-primary text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 border border-primary/10">
                    Apply
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Step Content */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-8">
          {hasPendingNegotiations && (
            <div className="p-6 bg-linear-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl shadow-yellow-900/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle className="w-7 h-7 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-black text-yellow-900 text-lg">Pending Negotiations</h4>
                  <p className="text-sm text-yellow-700 font-medium">Some items in your cart need price review from sellers.</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  try {
                    await negotiateItems({ itemIds: negotiationItemIds });
                    notify.success('Negotiation requests sent to sellers', 'Success');
                  } catch (error) {
                    console.error('Failed to negotiate:', error);
                  }
                }}
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-yellow-500/30 active:scale-95 whitespace-nowrap"
              >
                Start Negotiations
              </button>
            </div>
          )}
          
          {/* Step 1: Shipping */}
          {step === CheckoutStep.SHIPPING && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Step 1: Shipping</h2>
                <p className="text-gray-400">Please provide your contact and shipping information.</p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary">
                  <User className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Contact Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                    <input 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full h-14 bg-[#F8F9FA] border-none rounded-2xl px-5 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                    <input 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full h-14 bg-[#F8F9FA] border-none rounded-2xl px-5 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-[#F8F9FA] border-none rounded-2xl pl-12 pr-5 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-[#F8F9FA] border-none rounded-2xl pl-12 pr-5 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="+250 7XX XXX XXX"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="space-y-6 pt-6 ">
                 <div className="flex items-center gap-2 text-primary">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Shipping Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Street Address</label>
                    <input 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full h-14 bg-[#F8F9FA] border-none rounded-2xl px-5 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="Street name, house no, sector, cell..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">City</label>
                    <input 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full h-14 bg-[#F8F9FA] border-none rounded-2xl px-5 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="Kigali"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">District / State</label>
                    <input 
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full h-14 bg-[#F8F9FA] border-none rounded-2xl px-5 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="Nyarugenge"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <button 
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground h-14 px-10 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all flex items-center gap-2"
                >
                  Continue to Delivery
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Delivery */}
          {step === CheckoutStep.DELIVERY && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Step 2: Delivery Method</h2>
                <p className="text-gray-400">Choose how you want your items delivered.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { id: 'standard', title: 'Standard Delivery', time: '2-4 Business Days', price: 0, desc: 'Deliver within a few days for free.' },
                  { id: 'express', title: 'Express Delivery', time: '1-2 Business Days', price: 5000, desc: 'Faster delivery for a small fee.' },
                  { id: 'sameday', title: 'Same Day Delivery', time: 'Same Day (if ordered before 12PM)', price: 15000, desc: 'Get your products aujourd\'hui.' },
                ].map((option) => (
                  <label 
                    key={option.id}
                    className={`relative flex items-center p-6 rounded-3xl border-2 transition-all cursor-pointer group ${formData.deliveryOption === option.id ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                  >
                    <input 
                      type="radio"
                      name="deliveryOption"
                      value={option.id}
                      checked={formData.deliveryOption === option.id}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-6 transition-all ${formData.deliveryOption === option.id ? 'border-primary bg-primary' : 'border-gray-200 group-hover:border-gray-300'}`}>
                      {formData.deliveryOption === option.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-lg text-gray-900">{option.title}</span>
                        <span className={`font-black ${option.price === 0 ? 'text-green-600' : 'text-primary'}`}>
                          {option.price === 0 ? 'FREE' : `${option.price.toLocaleString()} RWF`}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <Truck className="w-4 h-4" />
                          {option.time}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-400">{option.desc}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-between pt-8">
                <button 
                  onClick={handleBack}
                  className="h-14 px-8 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground h-14 px-10 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all flex items-center gap-2"
                >
                  Continue to Payment
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === CheckoutStep.PAYMENT && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Step 3: Payment</h2>
                <p className="text-gray-400">Select a payment method and complete your order.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { id: 'pod', title: 'Pay on Delivery', desc: 'Pay with cash or Mobile Money when items arrive.', icon: Truck },
                  { id: 'card', title: 'Credit or Debit Card', desc: 'Pay securely using your card via Momo/Bank.', icon: CreditCard },
                ].map((method) => (
                  <div key={method.id} className="space-y-4">
                    <label 
                      className={`relative flex items-center p-6 rounded-3xl border-2 transition-all cursor-pointer group ${formData.paymentMethod === method.id ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                    >
                      <input 
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-6 transition-all ${formData.paymentMethod === method.id ? 'border-primary bg-primary' : 'border-gray-200 group-hover:border-gray-300'}`}>
                        {formData.paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <method.icon className={`w-5 h-5 ${formData.paymentMethod === method.id ? 'text-primary' : 'text-gray-400'}`} />
                          <span className="font-bold text-lg text-gray-900">{method.title}</span>
                        </div>
                        <p className="text-sm text-gray-400">{method.desc}</p>
                      </div>
                    </label>

                    {/* Card Details (Only if card selected) */}
                    {formData.paymentMethod === 'card' && method.id === 'card' && (
                      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4 mx-4 animate-in slide-in-from-top-4 duration-300">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Card Number</label>
                          <input 
                            className="w-full h-12 bg-white border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                            placeholder="xxxx xxxx xxxx xxxx"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Expiry Date</label>
                            <input 
                              className="w-full h-12 bg-white border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/20 transition-all"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">CVV</label>
                            <input 
                              className="w-full h-12 bg-white border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/20 transition-all"
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-200 flex gap-4">
                 <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0" />
                 <p className="text-sm text-yellow-800">
                   By clicking "Pay", you agree to UmuhinziLink's <Link href="#" className="underline font-bold">Terms of Service</Link> and <Link href="#" className="underline font-bold">Privacy Policy</Link>.
                 </p>
              </div>

              <div className="flex justify-between pt-8">
                <button 
                  onClick={handleBack}
                  className="h-14 px-8 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleNext}
                   className="bg-primary text-primary-foreground h-14 px-12 rounded-2xl font-black shadow-2xl shadow-primary/40 hover:shadow-primary/50 active:scale-95 transition-all text-lg flex items-center gap-2"
                >
                  Pay {total.toLocaleString()} RWF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }
      `}</style>
    </div>
  );
}
