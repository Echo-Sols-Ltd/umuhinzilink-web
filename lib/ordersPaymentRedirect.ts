const STORAGE_KEY = 'umuhinzilink:orders-payment-required';

export type OrdersPaymentRedirect = {
  paymentRequired: boolean;
  orderId: string | null;
};

/** Set before navigating to /orders after checkout payment failed. */
export function setOrdersPaymentRedirect(orderId?: string | null): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, orderId ?? '1');
}

/** Read and clear the one-shot redirect flag (sessionStorage). */
export function consumeOrdersPaymentRedirect(): OrdersPaymentRedirect {
  if (typeof window === 'undefined') {
    return { paymentRequired: false, orderId: null };
  }
  const value = sessionStorage.getItem(STORAGE_KEY);
  if (!value) {
    return { paymentRequired: false, orderId: null };
  }
  sessionStorage.removeItem(STORAGE_KEY);
  return {
    paymentRequired: true,
    orderId: value === '1' ? null : value,
  };
}

/** Support old links with ?payment=required&orderId=… */
export function parseLegacyOrdersPaymentQuery(): OrdersPaymentRedirect {
  if (typeof window === 'undefined') {
    return { paymentRequired: false, orderId: null };
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get('payment') !== 'required') {
    return { paymentRequired: false, orderId: null };
  }
  return {
    paymentRequired: true,
    orderId: params.get('orderId'),
  };
}
