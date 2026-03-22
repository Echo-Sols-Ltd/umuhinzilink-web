'use client';

import { Bell, ShoppingCart, Menu } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { UserType } from '@/types';

interface Props {
    onMenuClick: () => void;
}

export default function DashboardTopbar({ onMenuClick }: Props) {
    const { user }           = useAuth();
    const { getCartItemCount } = useCart();
    const { unreadCount }    = useNotificationContext();

    const cartCount = getCartItemCount();

    // only buyers have a cart
    const showCart = user?.role === UserType.BUYER;

    // notification href per role
    const notifHref =
        user?.role === UserType.GOVERNMENT ? '/government/notifications' : '/notifications';

    return (
        <header className="
            lg:hidden fixed top-0 left-0 right-0 z-30 h-14
            flex items-center justify-between px-4
            bg-card border-b border-border
        ">
            {/* hamburger */}
            <button
                onClick={onMenuClick}
                className="p-2 -ml-1 text-muted-foreground hover:text-foreground rounded-xl hover:bg-accent transition-colors"
                aria-label="Open navigation"
            >
                <Menu size={20} />
            </button>

            {/* brand — centred on mobile */}
            <span className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold text-foreground">
                UmuhinziLink
            </span>

            {/* right actions */}
            <div className="flex items-center gap-1">
                {showCart && (
                    <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-accent transition-colors">
                        <ShoppingCart size={18} />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center bg-primary text-primary-foreground text-[9px] font-bold rounded-full">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </Link>
                )}

                <Link href={notifHref} className="relative p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-accent transition-colors">
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center bg-destructive text-white text-[9px] font-bold rounded-full">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
}