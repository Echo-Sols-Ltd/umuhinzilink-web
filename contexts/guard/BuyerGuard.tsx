'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import { UserType } from '@/types';

export default function BuyerGuard(props: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== UserType.BUYER) {
                router.push('/unauthorized');
            } else {
                setIsVerified(true);
            }
        }
    }, [user, loading]);

    if (!isVerified) {
        return null;
    }

    return <>{props.children}</>;
}
