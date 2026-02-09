'use client'

import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { user, loadAuthState } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            loadAuthState()
            return
        }
    }, [user])

    return (
        <div>
            {children}
        </div>
    )
}