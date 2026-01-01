'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  ChevronLeft,
  Download,
  Calendar,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Filter,
  Search,
  Eye,
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'users' | 'products' | 'financial' | 'inventory';
  generatedDate: string;
  fileSize: string;
  format: 'PDF' | 'Excel' | 'CSV';
  downloadUrl: string;
}

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
        // window.location.href = '/signin';
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

function ReportsPageComponent() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API calls
    setReports([
      {
        id: '1',
        name: 'Monthly Sales Report',
        description: 'Comprehensive sales analysis for March 2024',
        type: 'sales',
        generatedDate: '2024-03-31',
        fileSize: '2.4 MB',
        format: 'PDF',
        downloadUrl: '#',
      },
      {
        id: '2',
        name: 'User Registration Report',
        description: 'New user registrations and demographics',
        type: 'users',
        generatedDate: '2024-03-30',
        fileSize: '1.2 MB',
        format: 'Excel',
        downloadUrl: '#',
      },
      {
        id: '3',
        name: 'Product Performance Report',
        description: 'Top performing products and categories',
        type: 'products',
        generatedDate: '2024-03-29',
        fileSize: '3.1 MB',
        format: 'PDF',
        downloadUrl: '#',
      },
      {
        id: '4',
        name: 'Financial Summary Q1 2024',
        description: 'Quarterly financial overview and projections',
        type: 'financial',
        generatedDate: '2024-03-28',
        fileSize: '4.5 MB',
        format: 'Excel',
        downloadUrl: '#',
      },
      {
        id: '5',
        name: 'Inventory Status Report',
        description: 'Current inventory levels and stock alerts',
        type: 'inventory',
        generatedDate: '2024-03-27',
        fileSize: '890 KB',
        format: 'CSV',
        downloadUrl: '#',
      },
    ]);
  }, []);

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'sales':
        return <ShoppingCart className="w-5 h-5 text-blue-600" />;
      case 'users':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'products':
        return <Package className="w-5 h-5 text-purple-600" />;
      case 'financial':
        return <DollarSign className="w-5 h-5 text-yellow-600" />;
      case 'inventory':
        return <Package className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'PDF':
        return 'bg-red-100 text-red-800';
      case 'Excel':
        return 'bg-green-100 text-green-800';
      case 'CSV':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;

    return matchesSearch && matchesType;
  });

  const reportTemplates = [
    {
      name: 'Sales Report',
      description: 'Generate comprehensive sales analysis',
      type: 'sales',
      icon: <ShoppingCart className="w-6 h-6" />,
    },
    {
      name: 'User Analytics',
      description: 'User demographics and activity',
      type: 'users',
      icon: <Users className="w-6 h-6" />,
    },
    {
      name: 'Product Performance',
      description: 'Product sales and inventory',
      type: 'products',
      icon: <Package className="w-6 h-6" />,
    },
    {
      name: 'Financial Summary',
      description: 'Revenue and expense reports',
      type: 'financial',
      icon: <DollarSign className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/admin"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Generate New Report Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map((template, index) => (
              <button
                key={index}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    {template.icon}
                  </div>
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Types</option>
              <option value="sales">Sales</option>
              <option value="users">Users</option>
              <option value="products">Products</option>
              <option value="financial">Financial</option>
              <option value="inventory">Inventory</option>
            </select>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getReportIcon(report.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                          <div className="text-sm text-gray-500">{report.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-sm text-gray-900">{report.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFormatColor(report.format)}`}
                      >
                        {report.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.fileSize}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.generatedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <AdminGuard>
      <ReportsPageComponent />
    </AdminGuard>
  );
}
