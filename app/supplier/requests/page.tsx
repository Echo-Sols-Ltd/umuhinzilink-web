'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  User,
  MapPin,
  Calendar,
  Package,
  Eye,
  CheckCircle,
  XCircle,
  Zap,
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const requestData = [
  {
    id: 'R001',
    farmer: 'Christine Uwera',
    address: '123 Kicukiro Street, Kigali 250',
    date: '04 Aug 2024',
    input: 'NPK fertilizer',
    quantity: '120',
    status: 'Approved',
  },
  {
    id: 'R002',
    farmer: 'Jean Ntawukuriryayo',
    address: '456 Remera Avenue, Gasabo 250',
    date: '03 Aug 2024',
    input: 'Maize Seeds',
    quantity: '80',
    status: 'Pending',
  },
  {
    id: 'R003',
    farmer: 'Marie Mukamana',
    address: '789 Nyamirambo Road, Nyarugenge 250',
    date: '02 Aug 2024',
    input: 'NPK fertilizer',
    quantity: '150',
    status: 'Approved',
  },
  {
    id: 'R004',
    farmer: 'Robert Nshimiye',
    address: '321 Kimisagara Street, Nyarugenge 250',
    date: '01 Aug 2024',
    input: 'Maize Seeds',
    quantity: '100',
    status: 'Pending',
  },
  {
    id: 'R005',
    farmer: 'Alice Uwimana',
    address: '654 Gikondo Avenue, Kicukiro 250',
    date: '31 Jul 2024',
    input: 'Fertilizer Seeds',
    quantity: '75',
    status: 'Approved',
  },
];

function FarmerRequestsComponent() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = requestData.filter(req =>
    req.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.input.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar userType={UserType.SUPPLIER} activeItem="Farmer Request" />

      <main className="flex-1 overflow-auto bg-gray-50/30">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Farmer Requests</h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">Review and respond to agricultural input requests</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-all">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search farmers or inputs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-bold py-5">FARMER INFO</TableHead>
                  <TableHead className="font-bold">INPUT DETAILS</TableHead>
                  <TableHead className="font-bold">REQUEST DATE</TableHead>
                  <TableHead className="font-bold">STATUS</TableHead>
                  <TableHead className="text-right font-bold pr-8">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} className="group hover:bg-gray-50/50 transition-colors">
                    <TableCell className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 border border-green-100 flex items-center justify-center text-green-600 shadow-sm group-hover:scale-110 transition-transform">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{request.farmer}</span>
                          <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {request.address}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 font-bold text-gray-800">
                          <Package className="w-4 h-4 text-blue-500" />
                          {request.input}
                        </div>
                        <span className="text-[11px] text-gray-400 font-bold tracking-wider mt-1 uppercase">
                          QTY: {request.quantity} units
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {request.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={request.status === 'Approved' ? 'success' : 'warning'}
                        className="font-bold text-[10px] px-3 py-1 uppercase tracking-widest rounded-full"
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-2  transition-all transform translate-x-4 group-hover:translate-x-0">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-[11px] font-bold rounded-xl hover:bg-green-700 shadow-md shadow-green-100 transition-all">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Decline">
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Make Offer">
                          <Zap className="w-5 h-5 font-bold" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function FarmerRequestsWrapper() {
  return (
    <SupplierGuard>
      <FarmerRequestsComponent />
    </SupplierGuard>
  );
}
