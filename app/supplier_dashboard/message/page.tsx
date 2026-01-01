'use client';
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Send,
  CheckCircle,
  LayoutGrid,
  FilePlus,
  ShoppingCart,
  User,
  Phone,
  Settings,
  LogOut,
  Mail,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

interface Contact {
  id: number;
  name: string;
  role: string;
}

interface Message {
  text: string;
  sender: string;
  timestamp: string;
}

interface Conversation {
  id: number;
  name: string;
  role: string;
  messages: Message[];
}

const Logo = () => (
  <div className="flex items-center gap-2 py-2">
    <span className="font-extrabold text-xl tracking-tight">
      <span className="text-white">Umuhinzi</span>
      <span className="text-white">Link</span>
    </span>
  </div>
);

const menuItems = [
  { label: 'Dashboard', href: '/supplier_dashboard', icon: CheckCircle },
  { label: 'My Inputs', href: '/supplier_dashboard/products', icon: LayoutGrid },
  { label: 'Farmer Request', href: '/supplier_dashboard/requests', icon: FilePlus },
  { label: 'Orders', href: '/supplier_dashboard/orders', icon: ShoppingCart },
  { label: 'Message', href: '/supplier_dashboard/message', icon: Mail },
  { label: 'Profile', href: '/supplier_dashboard/profile', icon: User },
  { label: 'Contact', href: '/supplier_dashboard/contact', icon: Phone },
  { label: 'Settings', href: '/supplier_dashboard/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

const mockContacts: Contact[] = [
  { id: 1, name: 'Harvest Hill Farm', role: 'Farmer' },
  { id: 2, name: 'Green Valley Co-op', role: 'Farmer' },
  { id: 3, name: 'AgroBuy Exporters', role: 'Buyer' },
  { id: 4, name: 'Urban Market Traders', role: 'Buyer' },
];

function SupplierMessages() {
  const router = useRouter();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { logout } = useAuth();
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const stored = localStorage.getItem('supplierConversations');
    if (stored) setConversations(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('supplierConversations', JSON.stringify(conversations));
  }, [conversations]);

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;
    const updated = conversations.map(conv =>
      conv.id === activeChat.id
        ? {
          ...conv,
          messages: [
            ...conv.messages,
            {
              sender: 'Supplier',
              text: message,
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          ],
        }
        : conv
    );
    setConversations(updated);
    setMessage('');
  };

  const startConversation = (contact: Contact) => {
    const existing = conversations.find(c => c.name === contact.name);
    if (existing) {
      setActiveChat(existing);
    } else {
      const newConv = {
        id: Date.now(),
        name: contact.name,
        role: contact.role,
        messages: [],
      };
      setConversations([...conversations, newConv]);
      setActiveChat(newConv);
    }
    setIsModalOpen(false);
    setSearch('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 min-h-0">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-green-600 flex flex-col fixed left-0 h-screen overflow-y-auto z-40">
          <nav className="flex-1 px-4 py-6 space-y-1">
            <Logo />
            {menuItems.map((item, index) => {
              const isActive = item.label === 'Message';
              const Icon = item.icon;
              const showDivider = index === 3 || index === 7;
              return (
                <div key={item.label}>
                  {item.isLogout ? (
                    <div
                      onClick={handleLogout}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm font-medium text-white hover:bg-green-700`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                      <span>{item.label}</span>
                    </div>
                  ) : (
                    <Link href={item.href} className="block">
                      <div
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm font-medium
                          ${isActive
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-white hover:bg-green-700'
                          }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-white'}`} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )}
                  {showDivider && <div className="border-t border-green-500 my-2 mx-3"></div>}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 ml-64 flex flex-col">
          {/* Header */}
          <header className="fixed top-0 left-64 z-30 right-0 bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
            {/* Search Section */}
            <div className="w-1/2 relative">
              <Input
                type="text"
                placeholder="Search..."
                className="pl-4 pr-10 h-10 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-3xl"
              />
              <Search
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                >
                  <span className="text-lg">
                    {languages.find(lang => lang.code === selectedLanguage)?.flag}
                  </span>
                  <span className="font-medium text-gray-700">
                    {languages.find(lang => lang.code === selectedLanguage)?.name}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {isLanguageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {languages.map(language => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setSelectedLanguage(language.code);
                          setIsLanguageDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">AS</span>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Agri Supply Co.</p>
                  <p className="text-gray-500 text-xs">Supplier</p>
                </div>
              </div>
            </div>
          </header>

          {/* Messages Content */}
          <div className="flex h-screen bg-gray-100 text-gray-800 mt-16">
            {/* Messages Sidebar */}
            <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-green-600 text-white">
                <h2 className="text-lg font-semibold">Messages</h2>
                <button
                  className="bg-white text-green-600 p-2 rounded-full hover:bg-gray-200 transition"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center bg-gray-100 rounded px-2">
                  <Search size={16} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="flex-1 p-2 bg-transparent outline-none text-sm text-gray-800"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-200 ${activeChat?.id === conv.id ? 'bg-green-50' : ''
                      }`}
                    onClick={() => setActiveChat(conv)}
                  >
                    <div className="font-medium">{conv.name}</div>
                    <div className="text-xs text-gray-500">{conv.role}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {activeChat ? (
                <>
                  <div className="p-4 border-b border-gray-200 bg-white flex items-center shadow-sm">
                    <div>
                      <div className="font-medium">{activeChat.name}</div>
                      <div className="text-xs text-gray-500">{activeChat.role}</div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {activeChat.messages.map((msg: Message, i: number) => (
                      <div
                        key={i}
                        className={`flex ${msg.sender === 'Supplier' ? 'justify-end' : 'justify-start'
                          }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow-sm ${msg.sender === 'Supplier'
                            ? 'bg-green-600 text-white rounded-br-none'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                            }`}
                        >
                          {msg.text}
                          <div className="text-[10px] mt-1 opacity-70">{msg.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-200 bg-white flex">
                    <input
                      type="text"
                      className="flex-1 border border-gray-200 rounded-l-lg p-2 text-sm outline-none text-gray-800"
                      placeholder="Type your message..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                    <button
                      className="bg-green-600 text-white px-4 rounded-r-lg hover:bg-green-700 transition"
                      onClick={sendMessage}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select a conversation
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-96 p-5 shadow-lg text-gray-800 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Start New Conversation</h3>
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 border border-gray-200 rounded mb-4 text-sm text-gray-800"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="max-h-60 overflow-y-auto space-y-2">
                {mockContacts
                  .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
                  .map(contact => (
                    <div
                      key={contact.id}
                      className="p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition"
                      onClick={() => startConversation(contact)}
                    >
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-xs text-gray-500">{contact.role}</div>
                    </div>
                  ))}
              </div>
              <div className="mt-4 text-right">
                <button
                  className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SupplierMessagesWrapper() {
  return (
    <SupplierGuard>
      <SupplierMessages />
    </SupplierGuard>
  );
}
