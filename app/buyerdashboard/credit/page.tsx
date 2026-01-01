'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const creditStats = [
  { label: 'Total Requests', value: '12', color: 'blue' },
  { label: 'Approved', value: '8', color: 'green' },
  { label: 'Pending', value: '3', color: 'yellow' },
];

const inputProducts = [
  {
    id: 1,
    name: 'Premium Corn Seeds',
    category: 'Seeds',
    price: '$45.00',
    stock: 'Stock 150',
    image: '/corn-seeds.png',
    status: 'In Stock',
  },
  {
    id: 2,
    name: 'NPK Fertilizer',
    category: 'Fertilizers',
    price: '$32.50',
    stock: 'Stock 8',
    image: '/npk-fertilizer-bag.png',
    status: 'Low Stock',
  },
  {
    id: 3,
    name: 'Garden Hoe',
    category: 'Tools',
    price: '$28.00',
    stock: 'Stock 45',
    image: '/garden-hoe-tool.png',
    status: 'In Stock',
  },
  {
    id: 4,
    name: 'Garden Hoe',
    category: 'Tools',
    price: '$28.00',
    stock: 'Stock 45',
    image: '/red-garden-hoe.png',
    status: 'In Stock',
  },
  {
    id: 5,
    name: 'Organic Pesticide',
    category: 'Pesticides',
    price: '$22.90',
    stock: 'Stock 57',
    image: '/organic-pesticide-spray.png',
    status: 'In Stock',
  },
  {
    id: 6,
    name: 'Wheat Seeds',
    category: 'Seeds',
    price: '$38.20',
    stock: 'Stock 12',
    image: '/wheat-seeds.png',
    status: 'Low Stock',
  },
  {
    id: 7,
    name: 'Watering Can',
    category: 'Tools',
    price: '$15.50',
    stock: 'Stock 89',
    image: '/watering-can.png',
    status: 'In Stock',
  },
  {
    id: 8,
    name: 'Watering Can',
    category: 'Tools',
    price: '$15.50',
    stock: 'Stock 89',
    image: '/watering-can.png',
    status: 'In Stock',
  },
];

const recentRequests = [
  {
    id: '#CR001',
    item: 'Maize Seeds',
    quantity: '50kg',
    date: 'Jan 15, 2024',
    status: 'Approved',
    action: 'View',
  },
  {
    id: '#CR002',
    item: 'NPK Fertilizer',
    quantity: '25kg',
    date: 'Jan 20, 2024',
    status: 'Pending',
    action: 'Cancel',
  },
  {
    id: '#CR003',
    item: 'Pesticide',
    quantity: '5L',
    date: 'Jan 18, 2024',
    status: 'Rejected',
    action: 'Resubmit',
  },
  {
    id: '#CR001',
    item: 'Maize Seeds',
    quantity: '50kg',
    date: 'Jan 15, 2024',
    status: 'Approved',
    action: 'View',
  },
  {
    id: '#CR002',
    item: 'NPK Fertilizer',
    quantity: '25kg',
    date: 'Jan 20, 2024',
    status: 'Pending',
    action: 'Cancel',
  },
  {
    id: '#CR003',
    item: 'Pesticide',
    quantity: '5L',
    date: 'Jan 18, 2024',
    status: 'Rejected',
    action: 'Resubmit',
  },
  {
    id: '#CR001',
    item: 'Maize Seeds',
    quantity: '50kg',
    date: 'Jan 15, 2024',
    status: 'Approved',
    action: 'View',
  },
  {
    id: '#CR002',
    item: 'NPK Fertilizer',
    quantity: '25kg',
    date: 'Jan 20, 2024',
    status: 'Pending',
    action: 'Cancel',
  },
  {
    id: '#CR003',
    item: 'Pesticide',
    quantity: '5L',
    date: 'Jan 18, 2024',
    status: 'Rejected',
    action: 'Resubmit',
  },
  {
    id: '#CR001',
    item: 'Maize Seeds',
    quantity: '50kg',
    date: 'Jan 15, 2024',
    status: 'Approved',
    action: 'View',
  },
];

export default function InputCreditRequests() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Input Credit Requests</h1>
          <p className="text-muted-foreground">
            Manage your credit requests for seeds, fertilizers, and other inputs
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">+ Request New Credit</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creditStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p
                  className={`text-3xl font-bold ${
                    stat.color === 'blue'
                      ? 'text-blue-600'
                      : stat.color === 'green'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Input Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inputProducts.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={product.image || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <Badge
                className={`absolute top-2 right-2 ${
                  product.status === 'In Stock' ? 'bg-green-600' : 'bg-orange-600'
                } text-white`}
              >
                {product.status}
              </Badge>
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-green-600">{product.price}</span>
                <span className="text-sm text-muted-foreground">{product.stock}</span>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Buy now</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Credit Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Credit Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Request ID</th>
                  <th className="text-left p-3">Items Requested</th>
                  <th className="text-left p-3">Quantity</th>
                  <th className="text-left p-3">Request Date</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 font-medium">{request.id}</td>
                    <td className="p-3">{request.item}</td>
                    <td className="p-3">{request.quantity}</td>
                    <td className="p-3">{request.date}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          request.status === 'Approved'
                            ? 'default'
                            : request.status === 'Pending'
                              ? 'secondary'
                              : 'destructive'
                        }
                        className={
                          request.status === 'Approved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : request.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }
                      >
                        {request.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        {request.action}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 ml-2">
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
