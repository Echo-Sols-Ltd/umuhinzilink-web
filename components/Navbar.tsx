import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Package, ShoppingCart, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const { t } = useI18n();
  const router = useRouter()
  const { user } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();


  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'home', offset: 0 },
        { id: 'features', offset: 0 },
        { id: 'agribusiness', offset: 0 },
        { id: 'lenders', offset: 0 },
        { id: 'contact', offset: 0 },
      ];
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          if (window.scrollY >= top) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="w-full bg-card/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-fade-in border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold text-success font-sans">
            Umuhinzi
            <span className="text-2xl font-extrabold text-foreground font-sans">
              Link
            </span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/dashboard"
            className="px-3 py-2 rounded-md text-sm font-bold text-foreground hover:text-success transition-all"
          >
            {t('landing.nav.marketplace') || 'Products'}
          </Link>
          <Link
            href="/about"
            className="px-3 py-2 rounded-md text-sm font-bold text-foreground hover:text-success transition-all"
          >
            {t('landing.nav.aboutUs') || 'About Us'}
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">

           <Link href={`${user?.role.toLowerCase()}/orders`} className="relative p-2 text-foreground hover:text-success transition-colors flex">
            <Package className="w-6 h-6" />
            Orders
          </Link>


          <Link href="/cart" className="relative p-2 text-foreground hover:text-success transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-success text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-background">
                {cartItemCount}
              </span>
            )}
          </Link>

          {user ? (
            <Link
              href={`/${user?.role.toLowerCase()}/dashboard`}
              className="flex items-center space-x-2 bg-success/10 text-success border border-success/20 px-4 py-2 rounded-full hover:bg-success/20 transition-all"
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-semibold">{t('common.dashboard') || 'Dashboard'}</span>
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="bg-success text-white px-6 py-2 rounded-full hover:bg-success/90 transition-all shadow-lg shadow-success/20 font-semibold"
            >
              {t('auth.signIn.signIn')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

