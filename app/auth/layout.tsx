'use client'

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { getHomePathForRole } from '@/lib/appPaths'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuth()
    const router = useRouter()
    useEffect(() => {
        if (isAuthenticated) {
            router.replace(getHomePathForRole(user?.role));
        }
    }, [isAuthenticated, user, router]);
    return <>{children}</>
}