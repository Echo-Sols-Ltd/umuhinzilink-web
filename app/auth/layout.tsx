'use client'

import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            if (!user.verified) {
                return
            }
            router.replace('/')
        }
    }, [user])

    return (
        <div>
            {children}
        </div>
    )
}