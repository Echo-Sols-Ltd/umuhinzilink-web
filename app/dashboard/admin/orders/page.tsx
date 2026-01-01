'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  LayoutGrid,
  Users,
  ArrowUpDown,
  Bell,
  User as UserIcon,
  Settings,
  Menu,
  X,
  Eye,
  Trash2,
} from 'lucide-react';

interface Transaction {
  id: string;
  senderType: string;
  senderName: string;
  receiverType: string;
  receiverName: string;
  date: string;
  status: 'Completed' | 'Processing' | 'Failed';
}

interface MenuItem {
  label: string;
  href: string;
  icon: any;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutGrid },
  { label: 'Users', href: '/dashboard/admin/users', icon: Users },
  { label: 'Payments', href: '/dashboard/admin/orders', icon: ArrowUpDown },
  { label: 'Notifications', href: '/dashboard/admin/reports', icon: Bell },
];

const MENU_ITEMS_BOTTOM: MenuItem[] = [
  { label: 'Profile', href: '/dashboard/admin/settings', icon: UserIcon },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
];

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Temporarily bypass authentication for admin dashboard access
        // const user = await getCurrentUser();
        // if (user?.role !== 'ADMIN') {
        //   window.location.href = '/unauthorized';
        //   return;
        // }
        // setCurrentUser(user);
      } catch (error) {
        // window.location.href = '/auth/signin';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

function OrderManagement() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTransactions([
      {
        id: '1',
        senderType: 'Farmer',
        senderName: 'Christine Brooks',
        receiverType: 'Supplier',
        receiverName: 'Gilbert Johnston',
        date: '2 Nov 2025',
        status: 'Completed',
      },
      {
        id: '2',
        senderType: 'Farmer',
        senderName: 'Rosie Pearson',
        receiverType: 'Supplier',
        receiverName: '28 May 2019',
        date: '2 Nov 2025',
        status: 'Processing',
      },
      {
        id: '3',
        senderType: 'Buyer',
        senderName: 'Darrell Caldwell',
        receiverType: 'Farmer',
        receiverName: '23 Nov 2019',
        date: '2 Nov 2025',
        status: 'Failed',
      },
      {
        id: '4',
        senderType: 'Buyer',
        senderName: 'Gilbert Johnston',
        receiverType: 'Farmer',
        receiverName: '05 Feb 2019',
        date: '2 Nov 2025',
        status: 'Completed',
      },
      {
        id: '5',
        senderType: 'Farmer',
        senderName: 'Alan Cain',
        receiverType: 'Supplier',
        receiverName: '29 Jul 2019',
        date: '2 Nov 2025',
        status: 'Processing',
      },
      {
        id: '6',
        senderType: 'Farmer',
        senderName: 'Alan Cain',
        receiverType: 'Supplier',
        receiverName: '29 Jul 2019',
        date: '2 Nov 2025',
        status: 'Processing',
      },
      {
        id: '7',
        senderType: 'Buyer',
        senderName: 'Darrell Caldwell',
        receiverType: 'Farmer',
        receiverName: '23 Nov 2019',
        date: '2 Nov 2025',
        status: 'Failed',
      },
      {
        id: '8',
        senderType: 'Farmer',
        senderName: 'Christine Brooks',
        receiverType: 'Supplier',
        receiverName: 'Gilbert Johnston',
        date: '2 Nov 2025',
        status: 'Completed',
      },
      {
        id: '9',
        senderType: 'Farmer',
        senderName: 'Christine Brooks',
        receiverType: 'Supplier',
        receiverName: 'Gilbert Johnston',
        date: '2 Nov 2025',
        status: 'Completed',
      },
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-purple-100 text-purple-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.senderType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.receiverType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar - Green */}
      <div
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-green-600 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-white">UmuhiniLink</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {MENU_ITEMS.map(item => {
            const isActive = item.label === 'Payments';
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-white text-green-600' : 'text-white hover:bg-green-700'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          <div className="border-t border-green-500 my-4"></div>

          {MENU_ITEMS_BOTTOM.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-white hover:bg-green-700"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - White with Search */}
        <header className="bg-white border-b h-16 flex items-center px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 bg-white p-6">
          {/* Transactions Table */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receiver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map(transaction => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.senderType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.senderName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.receiverType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.receiverName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          <button className="text-green-600 hover:text-green-800">View</button>
                          <button className="text-red-600 hover:text-red-800">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <AdminGuard>
      <OrderManagement />
    </AdminGuard>
  );
}
