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
  BarChart3,
  User as UserIcon,
} from 'lucide-react';
import AdminGuard from '@/contexts/guard/AdminGuard';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';

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
        return <ShoppingCart className="w-5 h-5 text-info" />;
      case 'users':
        return <Users className="w-5 h-5 text-success" />;
      case 'products':
        return <UserIcon className="w-5 h-5 text-purple-600" />;
      case 'financial':
        return <DollarSign className="w-5 h-5 text-warning" />;
      case 'inventory':
        return <Package className="w-5 h-5 text-destructive" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'PDF':
        return 'bg-destructive/10 text-destructive';
      case 'Excel':
        return 'bg-success/10 text-success';
      case 'CSV':
        return 'bg-info/10 text-info';
      default:
        return 'bg-muted text-muted-foreground';
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
      icon: <UserIcon className="w-6 h-6" />,
    },
    {
      name: 'Financial Summary',
      description: 'Revenue and expense reports',
      type: 'financial',
      icon: <DollarSign className="w-6 h-6" />,
    },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Reports'
      />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Reports Center</h1>
            <p className="text-xs text-muted-foreground">Generate and download platform reports</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-background p-6 space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-success"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-success"
            >
              <option value="all">All Reports</option>
              <option value="sales">Sales</option>
              <option value="users">Users</option>
              <option value="products">Products</option>
              <option value="financial">Financial</option>
              <option value="inventory">Inventory</option>
            </select>
          </div>

          {/* Generate New Report Section */}
          <div className="bg-card rounded-lg shadow-sm p-6 border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Orders Trend</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTemplates.map((template, index) => (
                <button
                  key={index}
                  className="p-4 border rounded-lg hover:bg-card text-left transition-colors"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center text-success">
                      {template.icon}
                    </div>
                    <h3 className="font-medium text-foreground">{template.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
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
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
              >
                <option value="all">All Types</option>
                <option value="sales">Sales</option>
                <option value="users">Users</option>
                <option value="products">Products</option>
                <option value="financial">Financial</option>
                <option value="inventory">Inventory</option>
              </select>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                />
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      REPORT
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      TYPE
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      FORMAT
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      FILE SIZE
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      GENERATED
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredReports.map(report => (
                    <tr key={report.id} className="hover:bg-card">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            {getReportIcon(report.type)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{report.name}</div>
                            <div className="text-sm text-muted-foreground">{report.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="capitalize text-sm text-foreground">{report.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFormatColor(report.format)}`}
                        >
                          {report.format}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {report.fileSize}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {report.generatedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-info hover:text-info/90">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-success hover:text-success/90">
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
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-info rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground mt-1">Integrate with Chart.js or Recharts</p>
                  <p className="text-2xl font-semibold text-foreground">{reports.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-muted-foreground">Revenue chart visualization</p>
                  <p className="text-2xl font-semibold text-foreground">12</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-semibold text-foreground">3</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
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
