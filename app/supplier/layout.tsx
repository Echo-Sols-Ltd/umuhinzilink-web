import { SupplierProvider } from "@/contexts/SupplierContext";

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
    return <SupplierProvider>
        {children}
    </SupplierProvider>;
}