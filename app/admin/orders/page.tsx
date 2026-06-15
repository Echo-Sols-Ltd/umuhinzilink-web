'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Menu,
  Filter,
  ArrowUpRight,
  User,
  Calendar,
  Eye,
  Trash2,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import Sidebar from '@/components/shared/Sidebar';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import { UserRole as UserType } from '@/types';
import AdminGuard from '@/contexts/guard/AdminGuard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

function FarmerOrderManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { orders } = useAdmin();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Processing': return 'info';
      case 'Failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.buyer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.owner?.firstName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={UserType.ADMIN} activeItem="Order Management" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminPageHeader
          title="Farmer Orders"
          description="Monitor and manage farmer-to-buyer transactions"
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Table Container */}
          <div className="bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-card/30">
                  <TableHead className="py-6 pl-8 font-semibold">SETTLEMENT INFO</TableHead>
                  <TableHead className="font-semibold">PARTICIPANTS</TableHead>
                  <TableHead className="font-semibold">EXECUTION DATE</TableHead>
                  <TableHead className="font-semibold">STATUS</TableHead>
                  <TableHead className="text-right pr-8 font-semibold">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center opacity-20">
                        <Search className="w-16 h-16 mb-4" />
                        <p className="text-xl font-semibold text-foreground">No Transactions Captured</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map(order => (
                    <TableRow key={order.id} className="group hover:bg-card/50 transition-all">
                      <TableCell className="py-5 pl-8">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold text-success uppercase  mb-1">TX-REF: {order.id.slice(0, 8)}</span>
                          <span className="text-gray-900 text-base leading-tight ">
                            RWF {order.totalPrice.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-medium">Farmer Settlement Order</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase ">Sender</span>
                            <span className="text-sm text-foreground flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-info" />
                              {order.buyer.firstName} {order.buyer.lastName}
                            </span>
                          </div>
                          <div className="w-4 h-px bg-divider" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase ">Receiver</span>
                            <span className="text-sm text-foreground flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-success" />
                              {order.product.owner?.firstName} {order.product.owner?.lastName}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(order.status)}
                          className="font-semibold text-[9px] px-3 py-1 uppercase  rounded-full"
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-2 transition-all transform translate-x-4 group-hover:translate-x-0">
                          <button
                            onClick={() => router.push(`/admin/orders/${order.id}`)}
                            className="p-3 text-muted-foreground hover:text-success hover:bg-success/10 rounded-2xl transition-all"
                            title="View order details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all" title="Archive">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function FarmerOrdersPage() {
  return (
    <AdminGuard>
      <FarmerOrderManagement />
    </AdminGuard>
  );
}
