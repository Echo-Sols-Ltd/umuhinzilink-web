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

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

const menuItems = [
  { label: 'Dashboard', href: '/farmer_dashboard', icon: CheckCircle },
  { label: 'My Produce', href: '/farmer_dashboard/products', icon: LayoutGrid },
  { label: 'Requests', href: '/farmer_dashboard/requests', icon: FilePlus },
  { label: 'Orders', href: '/farmer_dashboard/orders', icon: ShoppingCart },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Profile', href: '/farmer_dashboard/profile', icon: User },
  { label: 'Contact', href: '/farmer_dashboard/contact', icon: Mail },
  { label: 'Settings', href: '/farmer_dashboard/settings', icon: Settings },
  { label: 'Logout', href: '/logout', icon: LogOut },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b h-16 flex items-center px-8 shadow-sm">
        <Logo />
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6"></div>
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((m, index) => {
              const isActive = m.label === 'Contact';
              const showDivider = index === 4 || index === 8;
              return (
                <div key={m.label}>
                  <Link href={m.href} className="block">
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium ${
                        isActive
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <m.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      <span>{m.label}</span>
                    </div>
                  </Link>
                  {showDivider && <div className="border-t border-gray-200 my-2 mx-4"></div>}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
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
                <span className="text-gray-700">support@umuhinzi.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-green-600 w-6 h-6" />
                <span className="text-gray-700">+250 788 123 456</span>
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
    </div>
  );
}
