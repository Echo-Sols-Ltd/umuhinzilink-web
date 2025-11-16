import React, { createContext, useContext, useState } from 'react'
import { BuyerRequest, FarmerRequest, LoginRequest, SupplierRequest, User, UserRequest, Farmer, Supplier, Buyer } from "@/types";
import { UserType } from '@/types/enums';
import { authService } from "@/services/auth";

import { farmerService } from "@/services/farmers";
import { buyerService } from "@/services/buyers";
import { supplierService } from "@/services/suppliers";
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';


interface AuthContextType {
    login: (data: LoginRequest) => Promise<void>
    loading: boolean
    loadAuthState: () => Promise<void>
    user: User | null
    farmer: Farmer | null
    supplier: Supplier | null
    buyer: Buyer | null
    logout: () => Promise<void>
    register: (data: UserRequest) => Promise<void>
    registerBuyer: (data: BuyerRequest) => Promise<void>
    registerSupplier: (data: SupplierRequest) => Promise<void>
    registerFarmer: (data: FarmerRequest) => Promise<void>
    verifyOtp: (data: string) => Promise<void>
    askOtpCode: () => Promise<void>
    updateAvatar: (data: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [farmer, setFarmer] = useState<Farmer | null>(null)
    const [supplier, setSupplier] = useState<Supplier | null>(null)
    const [buyer, setBuyer] = useState<Buyer | null>(null)

    const fetchFarmer = async () => {
        try {
            const res = await farmerService.getMe()
            if (!res.success) {
               console.error('Failed to fetch farmer:', res.error)
            }
            if (res.data) {
                await localStorage.setItemAsync('farmer', JSON.stringify(res.data))
                if (!res.data) {
                    router.push('/auth/farmerSignup')
                    return
                }
                setFarmer(res.data)
            }

        } catch  {
         toast({ title: 'Fetching farmer failed', description: 'Please try again later', variant: 'destructive' })
        }
    }

    const fetchBuyer = async () => {
        try {
            const res = await buyerService.getMe()
            if (!res.success) {
                toast({ title: 'Fetching Buyer failed', description: 'Please try again later', variant: 'destructive' })
            }
            if (res.data) {
                await localStorage.setItemAsync('buyer', JSON.stringify(res.data))
                if (!res.data) {
                    router.push('/auth/buyerSignup')
                    return
                }
                setBuyer(res.data)
            }

        } catch  {
            toast({ title: 'Fetching buyer failed', description: 'Please try again later', variant: 'destructive' })
        }
    }


    const fetchSupplier = async () => {
        try {
            const res = await supplierService.getMe()
            if (!res.success) {
                toast({ title: 'Fetching supplier failed', description: 'Please try again later', variant: 'destructive' })
            }
            if (res.data) {
                await localStorage.setItemAsync('supplier', JSON.stringify(res.data))
                if (!res.data) {
                    router.push('/auth/supplierSignup')
                    return
                }
                setSupplier(res.data)
            }

        } catch  {
            toast({ title: 'Fetching supplier failed', description: 'Please try again later', variant: 'destructive' })
        }
    }


    const getUser = async () => {
        const stringUser = await localStorage.getItemAsync('user')
        if (!stringUser) return null
        const user: User = JSON.parse(stringUser)
        return user
    }

    const getFarmer = async () => {
        const stringUser = await localStorage.getItemAsync('farmer')
        if (!stringUser) return null
        const user: Farmer = JSON.parse(stringUser)
        return user
    }

    const getBuyer = async () => {
        const stringUser = await localStorage.getItemAsync('buyer')
        if (!stringUser) return null
        const user: Buyer = JSON.parse(stringUser)
        return user
    }

    const getSupplier = async () => {
        const stringUser = await    localStorage.getItemAsync('supplier')
        if (!stringUser) return null
        const user: Supplier = JSON.parse(stringUser)
        return user
    }



    const loadAuthState = async () => {
        try {
            // await localStorage.removeItemAsync('auth_token')

            const token = await localStorage.getItemAsync('auth_token')
            const user = await getUser()
            const farmer = await getFarmer()
            const supplier = await getSupplier()
            const buyer = await getBuyer()

            if (token && user) {
                setUser(user)

                if (user.role === UserType.BUYER) {
                    if (!buyer) {

                        router.push('/auth/buyerSignup')
                        return
                    }
                    if (!user.verified) {
                        router.push('/auth/otp')
                        return
                    }
                    setBuyer(buyer)
                    router.push('/dashboard/buyer')
                }
                if (user.role === UserType.FARMER) {
                    if (!farmer) {
                        router.push('/auth/farmerSignup')
                        return
                    }
                    if (!user.verified) {
                        router.push('/auth/otp')
                        return
                    }
                    setFarmer(farmer)
                    router.push('/dashboard/farmer')
                }
                if (user.role === UserType.SUPPLIER) {
                    if (!supplier) {
                        router.push('/auth/supplierSignup')
                        return
                    }
                    if (!user.verified) {
                        router.push('/auth/otp')
                        return
                    }
                    setSupplier(supplier)
                    router.push('/dashboard/supplier')
                }
                return
            }
            router.replace('/auth')
        } catch  {
            toast({
                title: 'Loading auth state failed',
                description: 'Please try again later',
                variant: 'destructive'
            })
            router.replace('/auth')
        }
    }

    const login = async (data: LoginRequest) => {

        try {
            setLoading(true)
            const res = await authService.login(data)
            if (!res.success) {
                toast({
                    title: "Login Failed",
                    description: res.message,
                    variant: "destructive"
                })
            }
            if (res.success && res.data) {

                await localStorage.setItemAsync('auth_token', res.data.token)
                await localStorage.setItemAsync('user', JSON.stringify(res.data.user))
                setUser(res.data.user)

                if (res.data.user.role === UserType.BUYER) {
                    await fetchBuyer()
                }
                if (res.data.user.role === UserType.FARMER) {
                    await fetchFarmer()
                }
                if (res.data.user.role === UserType.SUPPLIER) {
                    await fetchSupplier()
                }
                router.replace('/')
            }

        } catch  {
                toast({
                title: 'Error logging in',
                description: 'Please try again',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const register = async (data: UserRequest) => {
        try {
            setLoading(true)

            const res = await authService.register(data)
            if (!res.success) {
                toast({
                    title: "Register Failed",
                    description: res.message,
                    variant: "destructive"
                })
            }

            if (res.success && res.data) {

                await localStorage.setItemAsync('auth_token', res.data.token)
                await localStorage.setItemAsync('user', JSON.stringify(res.data.user))
                setUser(res.data.user)
                router.push('/auth/profileCreate')
            }
        } catch  {
            toast({
                title: 'Error registering',
                description: 'Please try again',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const registerBuyer = async (data: BuyerRequest) => {
        try {
            setLoading(true)
            const res = await authService.registerBuyer(data)
            if (!res.success) {
                toast({
                    title: "Register Failed",
                    description: res.message,
                    variant: "destructive"
                })
            }
            if (res.success && res.data) {
                await localStorage.setItemAsync('buyer', JSON.stringify(res.data))
                setBuyer(res.data)
                router.replace('/')
            }
        } catch  {
            toast({
                title: 'Error registering buyer',
                description: 'Please try again',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const registerSupplier = async (data: SupplierRequest) => {
        try {
            setLoading(true)
            const res = await authService.registerSupplier(data)
            if (!res.success) {
                toast({
                    title: "Register Failed",
                    description: res.message,
                    variant: "destructive"
                })
            }
            if (res.success && res.data) {
                await localStorage.setItemAsync('supplier', JSON.stringify(res.data))
                setSupplier(res.data)
                router.replace('/')
            }
        } catch  {
            toast({
                title: 'Error registering supplier',
                description: 'Please try again',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const registerFarmer = async (data: FarmerRequest) => {
        try {
            setLoading(true)
            const res = await authService.registerFarmer(data)
            if (!res.success) {
                toast({
                    title: "Register Failed",
                    description: res.message,
                    variant: "destructive"
                })
            }
            if (res.success && res.data) {
                await localStorage.setItemAsync('farmer', JSON.stringify(res.data))
                setFarmer(res.data)
                router.replace('/')
            }
        } catch  {
            toast({
                title: 'Error registering farmer',
                description: 'Please try again',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const verifyOtp = async (data: string) => {
        try {
            setLoading(true)
            const res = await authService.verifyOtp(data)
            if (!res.success) {
                toast({
                    title: "Verify Failed",
                    description: res.message,
                    variant: "destructive"
                })
            }
            if (res.success && res.data && user) {
                user.verified = true
                await localStorage.setItemAsync('user', JSON.stringify(user))
                setUser(user)
                router.replace('/')
            }
        } catch  {
            toast({
                title: 'Error verifying',
                description: 'Please try again',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const askOtpCode = async () => {
        try {
            setLoading(true)
            const res = await authService.askOtpCode()
            if (!res.success) {
                toast({
                    title: "Ask OTP Failed",
                    description: res.message,
                    variant: "destructive"
                })
            }

        } catch  {
                toast({
                title: 'Error asking for OTP',
                description: 'Please try again',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        await localStorage.removeItemAsync('auth_token')
        await localStorage.removeItemAsync('user')
        await localStorage.removeItemAsync('farmer')
        await localStorage.removeItemAsync('supplier')
        await localStorage.removeItemAsync('buyer')
        await localStorage.clear()
        setUser(null)
        setFarmer(null)
        setSupplier(null)
        setBuyer(null)

        router.replace('/')
    }

    const updateAvatar = async (data: string) => {
        setUser((prev) => {
            if (!prev) return null
            prev.avatar = data
            return prev
        })
        await localStorage.setItemAsync('user', JSON.stringify(user))

    }

    return (
        <AuthContext.Provider value={{
            loading,
            login,
            loadAuthState,
            user,
            farmer,
            supplier,
            buyer,
            logout,
            register,
            registerBuyer,
            registerSupplier,
            registerFarmer,
            verifyOtp,
            askOtpCode,
            updateAvatar
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export { useAuth, AuthProvider }