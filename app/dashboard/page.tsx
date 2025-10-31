"use client"

import { useEffect, useState } from "react"

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  location?: string;
  crops?: Array<{
    id: string;
    name: string;
    status: string;
    plantedDate: string;
    harvestDate: string;
  }>;
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  Cloud,
  CloudRain,
  Sun,
  Brain,
  TrendingUp,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const marketData = [
  { month: "Jan", price: 300 },
  { month: "Feb", price: 320 },
  { month: "Mar", price: 280 },
  { month: "Apr", price: 350 },
  { month: "May", price: 380 },
  { month: "Jun", price: 420 },
  { month: "Jul", price: 450 },
  { month: "Aug", price: 480 },
  { month: "Sep", price: 460 },
  { month: "Oct", price: 490 },
  { month: "Nov", price: 520 },
  { month: "Dec", price: 540 },
]

const recentOrders = [
  {
    id: "#ORD001",
    crop: "Amaru (Beans)",
    buyer: "Kimisagara Market",
    amount: "50kg",
    status: "Delivered",
    action: "View",
  },
  {
    id: "#ORD002",
    crop: "Ibirayi (Potatoes)",
    buyer: "Fresh Foods Ltd",
    amount: "100kg",
    status: "Pending",
    action: "Update",
  },
  {
    id: "#ORD003",
    crop: "Inyama (Tomatoes)",
    buyer: "Hotel des Mille Collines",
    amount: "25kg",
    status: "Processing",
    action: "View",
  },
]

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
  }, [])

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your crops and connect with buyers across Rwanda
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">+ Add New Produce</Button>
      </div>

      {/* Welcome Banner */}
      <Card className="bg-green-600 text-white border-green-600">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-16 h-16 rounded-full border-2 border-white/20"
            />
            <div>
              <h2 className="text-xl font-bold mb-2">Welcome back, {currentUser.name}!</h2>
              <p className="text-green-100">
                Manage your crops ({currentUser.crops.join(", ")}) and connect with buyers in {currentUser.location}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Products Listed</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold text-blue-600">5</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Credit Requests</p>
                <p className="text-2xl font-bold text-orange-600">3</p>
              </div>
              <CreditCard className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Messages</p>
                <p className="text-2xl font-bold text-purple-600">8</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <Card className="bg-blue-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Today&apos;s Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">24&deg;C</p>
                  <p className="text-blue-100">Partly Cloudy</p>
                  <p className="text-sm text-blue-200">Kigali, Rwanda</p>
                </div>
                <CloudRain className="h-12 w-12 text-blue-200" />
              </div>
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <p className="text-blue-200">Tomorrow</p>
                  <Sun className="h-4 w-4 mx-auto my-1" />
                  <p>26&deg;C</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-200">Thu</p>
                  <CloudRain className="h-4 w-4 mx-auto my-1" />
                  <p>23&deg;C</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-200">Fri</p>
                  <Sun className="h-4 w-4 mx-auto my-1" />
                  <p>25&deg;C</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Farming Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-600" />
              AI Farming Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <h4 className="font-medium text-sm">Umusaruro w&apos;amaru</h4>
                <p className="text-xs text-muted-foreground">
                  Ku gihe cy&apos;itemberere rya ibigori ni ukwezi kwa mbere rugira inyungu y&apos;amazi
                </p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <h4 className="font-medium text-sm">Weather Alert</h4>
                <p className="text-xs text-muted-foreground">
                  Imvura nyinshi itegerejwe mu minsi 3 iri imbere. Kuraguza ibigori byawe kandi witondere amazi
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-medium text-sm">Market Price</h4>
                <p className="text-xs text-muted-foreground">
                  Igiciro cy&apos;amaru cyiyongereye 15% muri uyu kwezi. Ni igihe cyo kugurisha
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Chat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Ask AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">Baza ibibazo cyangwa mu Kinyarwanda...</p>
            </div>
            <div className="space-y-2">
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded text-sm">
                <p className="font-medium">Bean Fertilizer</p>
                <p className="text-xs text-muted-foreground">Jan 14</p>
              </div>
              <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded text-sm">
                <p className="font-medium">Maize Planting</p>
                <p className="text-xs text-muted-foreground">Jan 10</p>
              </div>
            </div>
            <Button className="w-full text-sm">View All Saved Tips</Button>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tips Read This Week</span>
                <span className="font-bold text-green-600">12</span>
              </div>
              <div className="flex justify-between">
                <span>Tips Bookmarked</span>
                <span className="font-bold text-green-600">8</span>
              </div>
              <div className="flex justify-between">
                <span>AI Questions Asked</span>
                <span className="font-bold text-green-600">15</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Price Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Market Price Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Order ID</th>
                  <th className="text-left p-2">Crop</th>
                  <th className="text-left p-2">Buyer</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2 font-medium">{order.id}</td>
                    <td className="p-2">{order.crop}</td>
                    <td className="p-2">{order.buyer}</td>
                    <td className="p-2">{order.amount}</td>
                    <td className="p-2">
                      <Badge
                        variant={
                          order.status === "Delivered"
                            ? "default"
                            : order.status === "Pending"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        {order.action}
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
  )
}
