'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function BuyerMessageRedirect() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  useEffect(() => {
    // Redirect to global chat route
    router.replace(`/chat/${chatId}`);
  }, [chatId, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to chat...</p>
      </div>
    </div>
  );
}
