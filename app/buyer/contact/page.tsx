// /pages/buyercontact.tsx
'use client';

import Link from 'next/link'; import {
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import Sidebar from '@/components/shared/Sidebar';
import { BuyerPages, UserType } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';

const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-foreground">Link</span>
  </span>
);

import { useI18n } from '@/contexts/I18nContext';

function ContactComponent() {
  const { t } = useI18n();
  const router = useRouter();
  const [logoutPending, setLogoutPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully!", {
      title: "Success"
    });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        userType={UserType.BUYER}
        activeItem='Contact'
      />
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto h-full">
        <h1 className="text-2xl font-semibold text-foreground mb-6">{t('contact.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="bg-card rounded-lg shadow-sm border p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">{t('contact.getInTouch')}</h2>
              <p className="text-muted-foreground">
                {t('contact.description')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-success w-6 h-6" />
              <span className="text-foreground">support@umuhinzi.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-success w-6 h-6" />
              <span className="text-foreground">+250 788 123 456</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-success w-6 h-6" />
              <span className="text-foreground">{t('contact.location')}: Kigali, Rwanda</span>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-2">{t('contact.sendMessage')}</h2>

            <div>
              <label className="block text-sm font-medium text-foreground">{t('contact.yourName')}</label>
              <input
                type="text"
                required
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success bg-card"
                placeholder={t('contact.placeholders.name')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">{t('contact.yourEmail')}</label>
              <input
                type="email"
                required
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success bg-card"
                placeholder={t('contact.placeholders.email')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">{t('contact.subject')}</label>
              <input
                type="text"
                required
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success bg-card"
                placeholder={t('contact.placeholders.subject')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">{t('contact.message')}</label>
              <textarea
                rows={4}
                required
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success bg-card"
                placeholder={t('contact.placeholders.message')}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-success text-primary-foreground px-4 py-3 rounded-lg hover:bg-success/90 transition-colors font-medium shadow-sm"
            >
              {t('contact.sendAction')}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function ContactPage() {
  return (
    <BuyerGuard>
      <ContactComponent />
    </BuyerGuard>
  );
}
