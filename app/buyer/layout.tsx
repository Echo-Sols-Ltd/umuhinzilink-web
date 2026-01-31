'use client'

import { BuyerProvider } from "@/contexts/BuyerContext";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
    return (
        <BuyerProvider>
            {children}
        </BuyerProvider>
    )
}