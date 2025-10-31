"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  location?: string;
  // Add other user properties as needed
}

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Brain,
  TrendingUp,
  MessageSquare,
  ShoppingCart,
  User,
  Phone,
  Settings,
  LogOut,
  MapPin,
} from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "My Products", href: "/dashboard/products" },
  { icon: CreditCard, label: "Input Request", href: "/dashboard/credit" },
  { icon: Brain, label: "AI Tips", href: "/dashboard/ai-tips" },
  { icon: TrendingUp, label: "Market Analytics", href: "/dashboard/analytics" },
  { icon: MessageSquare, label: "Message", href: "/dashboard/messages" },
  { icon: ShoppingCart, label: "Orders", href: "/dashboard/orders" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Phone, label: "Contact", href: "/dashboard/contact" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: LogOut, label: "Logout", href: "/" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    // Get user from localStorage if available
    const user = typeof window !== 'undefined' ? localStorage.getItem("currentUser") : null
    if (user) {
      setCurrentUser(JSON.parse(user))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-border/40 p-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-green-600">
                <img src="/favicon.png" alt="UmuhinziLink Logo" className="h-8 w-8" />
                UmuhinziLink
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 w-8"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                const isLogout = item.label === "Logout"
                
                return (
                  <div key={item.href} className="px-1">
                    {isLogout ? (
                      <button
                        onClick={handleLogout}
                        className={`
                          w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                          text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400
                          hover:bg-red-50 dark:hover:bg-red-950/20
                          group
                        `}
                      >
                        <item.icon className="h-5 w-5 transition-colors group-hover:text-red-600 dark:group-hover:text-red-400" />
                        <span>{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`
                          w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                          ${isActive 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-green-600 dark:hover:text-green-400'
                          }
                          group
                        `}
                      >
                        <item.icon className={`h-5 w-5 transition-colors ${
                          isActive 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400'
                        }`} />
                        <span>{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-1 h-6 bg-green-600 dark:bg-green-400 rounded-full" />
                        )}
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>
            
            {/* User Profile Section */}
            <div className="mt-auto p-4 border-t border-border/40">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full border-2 border-green-200 dark:border-green-800"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {currentUser.location}
                  </p>
                </div>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  )
}
