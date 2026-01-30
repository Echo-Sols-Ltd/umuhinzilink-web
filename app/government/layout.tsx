import { GovernmentProvider } from "@/contexts/GovernmentContext";

export default function GovernmentLayout({ children }: { children: React.ReactNode }) {
    return <GovernmentProvider>
        {children}
    </GovernmentProvider>;
}