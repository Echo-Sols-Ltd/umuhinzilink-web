'use client';
'use client';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  LayoutGrid,
  FilePlus,
  ShoppingCart,
  MessageSquare,
  Settings,
  LogOut,
  CheckCircle,
  User,
} from 'lucide-react';
import { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { SupplierPages, UserType } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

function SupplierContactComponent() {
  const [logoutPending, setLogoutPending] = useState(false);

  const handleLogout = async () => {
    // Handle logout logic
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          userType={UserType.SUPPLIER}
          activeItem='Contact'
        />

        {/* Main Content */}
        <main className="flex-1 p-8 h-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Get in Touch</h2>
                <p className="text-gray-600">
                  Have questions or need help? You can reach us through any of the following
                  methods:
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-green-600 w-6 h-6" />
                <span className="text-gray-700">supplier-support@umuhinzi.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-green-600 w-6 h-6" />
                <span className="text-gray-700">+250 788 987 654</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-green-600 w-6 h-6" />
                <span className="text-gray-700">Kigali, Rwanda</span>
              </div>
            </div>

            {/* Contact Form */}
            <form className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Send us a Message</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700">Your Name</label>
                <input
                  type="text"
                  className="mt-1 w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Your Email</label>
                <input
                  type="email"
                  className="mt-1 w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  className="mt-1 w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="Subject here"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  rows={4}
                  className="mt-1 w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="Write your message..."
                />
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </main>
    </div>
  );
}

export default function SupplierContactPage() {
  return (
    <SupplierGuard>
      <SupplierContactComponent />
    </SupplierGuard>
  );
}
