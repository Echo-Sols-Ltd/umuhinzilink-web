"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Phone, Lock, Smartphone } from "lucide-react"
import Link from "next/link"

// Mock user data for farmers
const mockUsers = [
  {
    id: 1,
    name: "Marie Uwimana",
    phone: "+250788123456",
    password: "farmer123",
    location: "Nyagatare",
    crops: ["Maize", "Beans"],
    avatar: "/african-woman-farmer.png"
  },
  {
    id: 2,
    name: "Jean Baptiste Nkurunziza",
    phone: "+250788654321", 
    password: "farmer456",
    location: "Nyagatare",
    crops: ["Beans", "Potatoes"],
    avatar: "/african-woman-farmer.png" // We'll use this for now since we don't have a male farmer image
  },
  {
    id: 3,
    name: "Agnes Mukamana",
    phone: "+250788987654",
    password: "farmer789",
    location: "Nyagatare", 
    crops: ["Vegetables", "Tomatoes"],
    avatar: "/african-woman-farmer.png"
  }
]

export default function LoginPage() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if user exists in mock data
    const user = mockUsers.find(u => u.phone === phone && u.password === password)
    
    if (user) {
      // Store user data in localStorage (in a real app, you'd use proper authentication)
      localStorage.setItem("currentUser", JSON.stringify(user))
      router.push("/dashboard")
    } else {
      setError("Invalid phone number or password. Try: +250788123456 / farmer123")
    }
    
    setIsLoading(false)
  }

  const handleDemoLogin = () => {
    setPhone("+250788123456")
    setPassword("farmer123")
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f0fdf4_0%,#dcfce7_100%)] dark:bg-[linear-gradient(135deg,#052e16_0%,#14532d_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="flex items-center justify-center gap-2 text-2xl font-bold text-green-600">
            <div className="relative h-10 w-10">
              <Image 
                src="/favicon.png" 
                alt="UmuhinziLink Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            UmuhinziLink
          </Link>
          <p className="text-muted-foreground">
            Welcome back, farmer! Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your phone number and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+250788123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Account */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Demo Account</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleDemoLogin}
              >
                <User className="mr-2 h-4 w-4" />
                Try Demo Account
              </Button>
            </div>

            {/* Mock Users Info */}
            <div className="space-y-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
              <p className="font-medium">Demo Accounts:</p>
              <div className="space-y-1">
                <p className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  +250788123456 / farmer123 (Marie)
                </p>
                <p className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  +250788654321 / farmer456 (Jean)
                </p>
                <p className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  +250788987654 / farmer789 (Agnes)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-green-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
