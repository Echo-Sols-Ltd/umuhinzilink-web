'use client';

import { Bell, ShoppingCart, Menu, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { UserType } from '@/types';
import { imageUrl } from '@/lib/utils';

interface Props {
    onMenuClick: () => void;
    title?: string;
}

function getPageTitle(pathname: string): string {
    const segment = pathname.split('/').filter(Boolean).pop() ?? 'dashboard';
    return segment
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

const notifHref = (role?: string) =>
    role === UserType.GOVERNMENT ? '/government/notifications' : '/notifications';

export default function DashboardTopbar({ onMenuClick, title }: Props) {
    const { user } = useAuth();
    const { getCartItemCount } = useCart();
    const { unreadCount } = useNotificationContext();
    const pathname = usePathname();

    const cartCount = getCartItemCount();
    const showCart = user?.role === UserType.BUYER;
    const pageTitle = title ?? getPageTitle(pathname);
    const firstName = user?.firstName ?? '';
    const initials = firstName ? firstName[0].toUpperCase() : 'U';

    return (
        <header className="
            fixed top-0 z-50 w-full h-14
            flex items-center justify-between px-4 lg:px-6
            bg-card border-b border-border shrink-0
        ">
            {/* left */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-1.5 -ml-1 text-muted-foreground hover:text-foreground rounded-xl hover:bg-accent transition-colors"
                    aria-label="Open navigation"
                >
                    <Menu size={18} />
                </button>
                <div className="flex items-center gap-1.5 text-sm">
                    <span className="hidden lg:block text-muted-foreground font-medium">UmuhinziLink</span>
                    <ChevronRight size={13} className="hidden lg:block text-muted-foreground/50" />
                    <span className="font-semibold text-foreground">{pageTitle}</span>
                </div>
            </div>

            {/* right */}
            <div className="flex items-center gap-1">
                {showCart && (
                    <Link href="/cart"
                        className="relative p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-accent transition-colors"
                        title="Cart">
                        <ShoppingCart size={18} />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-primary text-primary-foreground text-[9px] font-bold rounded-full">
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>
                )}

                <Link href={notifHref(user?.role)}
                    className="relative p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-accent transition-colors"
                    title="Notifications">
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-destructive text-white text-[9px] font-bold rounded-full">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Link>

                <Link href={`/${user?.role?.toLowerCase()}/profile`}
                    className="ml-1 flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-accent transition-colors"
                    title="Profile">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center overflow-hidden shrink-0">
                        {user?.avatar
                            ? <img src={imageUrl(user.avatar)} alt={firstName} className="w-7 h-7 object-cover" />
                            : <span className="text-[11px] font-semibold text-primary-foreground">{initials}</span>}
                    </div>
                    <span className="hidden lg:block text-[13px] font-medium text-foreground/80">
                        {firstName}
                    </span>
                </Link>
            </div>
        </header>
    );
}