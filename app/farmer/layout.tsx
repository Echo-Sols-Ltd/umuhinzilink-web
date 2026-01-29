'use client';

import { FarmerProvider } from "@/contexts/FarmerContext";

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
    return (<FarmerProvider>
        {children}
    </FarmerProvider>);
}