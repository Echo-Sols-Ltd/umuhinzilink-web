'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LegacyResetPasswordRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      router.replace(`/auth/reset-password?code=${encodeURIComponent(code)}`);
      return;
    }
    router.replace('/auth/forgot-password');
  }, [router, searchParams]);

  return null;
}

export default function LegacyResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <LegacyResetPasswordRedirect />
    </Suspense>
  );
}
