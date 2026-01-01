'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Truck, CheckCircle, DollarSign, Eye, Check } from 'lucide-react';

const orderStats = [
  { label: 'Pending Orders', value: '42', icon: Package, color: 'text-yellow-600' },
  { label: 'In Progress', value: '28', icon: Truck, color: 'text-blue-600' },
  { label: 'Completed', value: '178', icon: CheckCircle, color: 'text-green-600' },
  { label: 'Total Revenue', value: '$24,580', icon: DollarSign, color: 'text-green-600' },
];

const orders = [
  {
    id: '#ORD-2024-001',
    product: 'Organic Tomatoes',
    customer: 'Sarah Johnson',
    quantity: '50 kg',
    date: 'Jan 15, 2024',
    status: 'Pending',
    actions: ['👁️', '❌'],
  },
  {
    id: '#ORD-2024-002',
    product: 'Fresh Lettuce',
    customer: 'Mike Chen',
    quantity: '25 kg',
    date: 'Jan 14, 2024',
    status: 'In Progress',
    actions: ['👁️', '✅'],
  },
  {
    id: '#ORD-2024-003',
    product: 'Bell Peppers',
    customer: 'Emma Davis',
    quantity: '30 kg',
    date: 'Jan 13, 2024',
    status: 'Completed',
    actions: ['👁️', '✅'],
  },
];

export default function Orders() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage your order request of you produce</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {orderStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Management</CardTitle>
            <div className="flex gap-4">
              <Tabs defaultValue="all" className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
              <Input placeholder="Search by Order ID or Customer Name" className="max-w-sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Order ID</th>
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Quantity</th>
                  <th className="text-left p-3">Order Date</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="p-3 font-medium">{order.id}</td>
                    <td className="p-3">{order.product}</td>
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3">{order.quantity}</td>
                    <td className="p-3">{order.date}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          order.status === 'Completed'
                            ? 'default'
                            : order.status === 'In Progress'
                              ? 'secondary'
                              : 'outline'
                        }
                        className={
                          order.status === 'Completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : order.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">Showing 1 to 10 of 248 results</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
