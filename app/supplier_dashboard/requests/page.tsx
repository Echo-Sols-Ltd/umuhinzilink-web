"use client";
import React from 'react';
import {
  CheckCircle, LayoutGrid, FilePlus, ShoppingCart,
  User, Phone, Settings, LogOut, Mail, Search, Filter
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SupplierGuard } from '@/components/auth/AuthGuard';
import { logout } from '@/lib/auth';
import { Input } from '@/components/ui/input';

const Logo = () => (
  <div className="flex items-center gap-2 py-2">
    <span className="font-extrabold text-xl tracking-tight">
      <span className="text-white">Umuhinzi</span><span className="text-white">Link</span>
    </span>
  </div>
);

const requestData = [
  { id: "R001", farmer: "Christine Uwera", address: "123 Kicukiro Street, Kigali 250", date: "04 Aug 2024", input: "NPK fertilizer", quantity: "120", status: "Approved" },
  { id: "R002", farmer: "Jean Ntawukuriryayo", address: "456 Remera Avenue, Gasabo 250", date: "03 Aug 2024", input: "Maize Seeds", quantity: "80", status: "Pending" },
  { id: "R003", farmer: "Marie Mukamana", address: "789 Nyamirambo Road, Nyarugenge 250", date: "02 Aug 2024", input: "NPK fertilizer", quantity: "150", status: "Approved" },
  { id: "R004", farmer: "Robert Nshimiye", address: "321 Kimisagara Street, Nyarugenge 250", date: "01 Aug 2024", input: "Maize Seeds", quantity: "100", status: "Pending" },
  { id: "R005", farmer: "Alice Uwimana", address: "654 Gikondo Avenue, Kicukiro 250", date: "31 Jul 2024", input: "Fertilizer Seeds", quantity: "75", status: "Approved" },
  { id: "R006", farmer: "Eric Cyiza", address: "987 Kanombe Road, Kicukiro 250", date: "30 Jul 2024", input: "Fertilizer Seeds", quantity: "90", status: "Pending" },
  { id: "R007", farmer: "Grace Mukantwari", address: "147 Gisozi Street, Gasabo 250", date: "29 Jul 2024", input: "Fertilizer Seeds", quantity: "110", status: "Approved" },
  { id: "R008", farmer: "Patrick Habimana", address: "258 Muhima Avenue, Nyarugenge 250", date: "28 Jul 2024", input: "Fertilizer Seeds", quantity: "85", status: "Pending" },
  { id: "R009", farmer: "Alice Cyiza", address: "369 Kacyiru Road, Gasabo 250", date: "27 Jul 2024", input: "Fertilizer Seeds", quantity: "95", status: "Approved" },
  { id: "R010", farmer: "Alice Cyiza", address: "741 Nyakabanda Street, Nyarugenge 250", date: "26 Jul 2024", input: "Fertilizer Seeds", quantity: "105", status: "Pending" },
  { id: "R011", farmer: "Alice Cyiza", address: "852 Kimihurura Avenue, Gasabo 250", date: "25 Jul 2024", input: "Fertilizer Seeds", quantity: "125", status: "Approved" },
  { id: "R012", farmer: "Alice Cyiza", address: "963 Rugando Road, Gasabo 250", date: "24 Jul 2024", input: "Fertilizer Seeds", quantity: "70", status: "Pending" },
  { id: "R013", farmer: "Alice Cyiza", address: "159 Kabuga Street, Gasabo 250", date: "23 Jul 2024", input: "Fertilizer Seeds", quantity: "115", status: "Approved" },
  { id: "R014", farmer: "Alice Cyiza", address: "357 Nyarutarama Avenue, Gasabo 250", date: "22 Jul 2024", input: "Fertilizer Seeds", quantity: "140", status: "Pending" },
  { id: "R015", farmer: "Alice Cyiza", address: "468 Kinyinya Road, Gasabo 250", date: "21 Jul 2024", input: "Fertilizer Seeds", quantity: "160", status: "Approved" },
  { id: "R016", farmer: "Alice Cyiza", address: "579 Jabana Street, Gasabo 250", date: "20 Jul 2024", input: "Fertilizer Seeds", quantity: "130", status: "Pending" },
  { id: "R017", farmer: "Alice Cyiza", address: "681 Rusororo Avenue, Gasabo 250", date: "19 Jul 2024", input: "Fertilizer Seeds", quantity: "180", status: "Approved" },
  { id: "R018", farmer: "Alice Cyiza", address: "792 Ndera Road, Gasabo 250", date: "18 Jul 2024", input: "Fertilizer Seeds", quantity: "200", status: "Pending" }
];

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


function FarmerRequests() {
  const router = useRouter();

  const handleLogout = () => {
    logout(router);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 bg-green-600 flex flex-col fixed left-0 h-screen overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1">
            <Logo />
            {menuItems.map((item, index) => {
              const isActive = item.label === 'Farmer Request';
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
                            ? "bg-white text-green-600 shadow-sm"
                            : "text-white hover:bg-green-700"
                          }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-green-600" : "text-white"}`} />
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

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto ml-64 relative">
          {/* Header */}
          <header className="fixed top-0 left-64 z-30 right-0 bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
            {/* Search Section */}
            <div className='w-1/2 relative'>
              <Input
                type='text'
                placeholder='Search...'
                className='pl-4 pr-10 h-10 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-3xl'
              />
              <Search size={18} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              {/* Add Product Button */}
              <button className="bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                + Add New Product
              </button>
            </div>
          </header>

          {/* Content with top margin for fixed header */}
          <div className='mt-16'>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-semibold text-gray-900">Farmer Request</h1>
            </div>


            {/* Search and Filters */}
            <div className="flex justify-between items-center mb-4 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-white border border-gray-300 text-gray-600 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="flex gap-2">
                <button className="bg-white border border-gray-300 text-gray-700 rounded-md py-2 px-3 text-sm flex items-center gap-1 hover:bg-gray-50 transition-colors cursor-pointer">
                  Filter
                  <Filter className="w-3 h-3" />
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 rounded-md py-2 px-3 text-sm hover:bg-gray-50 transition-colors cursor-pointer">
                  Export
                </button>
                <button className="bg-green-600 text-white rounded-md py-2 px-3 text-sm hover:bg-green-700 transition-colors cursor-pointer">
                  Filter
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">FARMER</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ADDRESS</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">DATE</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">INPUT</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">QUANTITY</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestData.map((request, index) => (
                      <tr key={request.id} className={index < 17 ? "border-b border-gray-100" : ""}>
                        <td className="py-3 px-4 text-gray-900 text-sm">{request.id}</td>
                        <td className="py-3 px-4 text-gray-900 text-sm">{request.farmer}</td>
                        <td className="py-3 px-4 text-gray-500 text-sm">{request.address}</td>
                        <td className="py-3 px-4 text-gray-900 text-sm">{request.date}</td>
                        <td className="py-3 px-4 text-gray-900 text-sm">{request.input}</td>
                        <td className="py-3 px-4 text-gray-900 text-sm">{request.quantity}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium hover:bg-green-200 transition-colors cursor-pointer">
                              Approve
                            </button>
                            <button className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium hover:bg-red-200 transition-colors cursor-pointer">
                              Decline
                            </button>
                            <button className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer">
                              Offer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  &lt;
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded text-sm font-medium">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-sm cursor-pointer">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-sm cursor-pointer">
                  3
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-sm cursor-pointer">
                  4
                </button>
                <span className="px-2 text-gray-400">...</span>
                <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-sm cursor-pointer">
                  10
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function FarmerRequestsWrapper() {
  return (
    <SupplierGuard>
      <FarmerRequests />
    </SupplierGuard>
  );
}
