import { AdminProvider } from "@/contexts/AdminContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminProvider>
        {children}
    </AdminProvider>;
}