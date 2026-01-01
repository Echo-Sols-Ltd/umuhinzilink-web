'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Brain, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const priceData = [
  { month: 'Jan', price: 300 },
  { month: 'Feb', price: 320 },
  { month: 'Mar', price: 280 },
  { month: 'Apr', price: 350 },
  { month: 'May', price: 380 },
  { month: 'Jun', price: 420 },
  { month: 'Jul', price: 450 },
  { month: 'Aug', price: 480 },
  { month: 'Sep', price: 460 },
  { month: 'Oct', price: 490 },
  { month: 'Nov', price: 520 },
  { month: 'Dec', price: 540 },
];

const topBuyers = [
  { name: 'Kigali Agro Market', location: 'Kigali City', crop: 'Maize', price: '450 RWF/kg' },
  { name: 'Rwanda Export Co.', location: 'Huye District', crop: 'Beans', price: '800 RWF/kg' },
  { name: 'Fresh Produce Ltd', location: 'Musanze District', crop: 'Bananas', price: '300 RWF/kg' },
];

export default function MarketAnalytics() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Market Analytics</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Crops" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              <SelectItem value="maize">Maize</SelectItem>
              <SelectItem value="beans">Beans</SelectItem>
              <SelectItem value="potatoes">Potatoes</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="kigali">Kigali</SelectItem>
              <SelectItem value="northern">Northern</SelectItem>
              <SelectItem value="southern">Southern</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Last 30 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="365">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price Trends Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Price Trends
            </CardTitle>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              +12% this month
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#22c55e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Buyers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Buyer</th>
                    <th className="text-left p-2">Location</th>
                    <th className="text-left p-2">Crop Interest</th>
                    <th className="text-left p-2">Offer Price</th>
                  </tr>
                </thead>
                <tbody>
                  {topBuyers.map((buyer, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {buyer.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium">{buyer.name}</span>
                        </div>
                      </td>
                      <td className="p-2 text-muted-foreground">{buyer.location}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">
                          {buyer.crop}
                        </Badge>
                      </td>
                      <td className="p-2 font-medium text-green-600">{buyer.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Demand Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Demand Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">High Demand</h4>
                  <p className="text-sm text-muted-foreground">Beans</p>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+25%</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Trending</h4>
                  <p className="text-sm text-muted-foreground">Maize</p>
                </div>
                <div className="flex items-center gap-1 text-yellow-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Low Demand</h4>
                  <p className="text-sm text-muted-foreground">Bananas</p>
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm font-medium">-8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Best Time to Sell</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Based on current trends, the optimal selling window for your maize is in the next
                  2-3 weeks.
                </p>
                <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Confidence: 85%
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100">Best Market</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Kigali Agro Market offers the highest prices for maize currently at 450 RWF/kg.
                </p>
                <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Distance: 25km from you
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
