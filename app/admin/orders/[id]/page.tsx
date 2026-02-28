'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    User,
    Calendar,
    Package,
    TrendingUp,
    TrendingDown,
    Eye,
    Download,
    Share2
} from 'lucide-react';

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { toast: showToast } = useToast();
    const [order, setOrder] = useState<any>(null);
    const [orderType, setOrderType] = useState<'farmer' | 'supplier'>('farmer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!params.id) return;

            setLoading(true);
            try {
                // Mock data - in real app, this would fetch from API
                const mockOrder = {
                    id: params.id as string,
                    totalPrice: Math.floor(Math.random() * 1000000) + 10000,
                    status: ['Completed', 'Processing', 'Failed'][Math.floor(Math.random() * 3)],
                    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                    buyer: {
                        id: 'buyer-1',
                        names: 'Jean Mugabo',
                        email: 'jean@example.com'
                    },
                    product: {
                        id: 'product-1',
                        name: 'Fresh Tomatoes',
                        description: 'Premium quality tomatoes from local farms',
                        category: 'vegetables',
                        price: 500,
                        quantity: 100,
                        measurementUnit: 'kg',
                        owner: {
                            id: orderType === 'farmer' ? 'farmer-1' : 'supplier-1',
                            names: orderType === 'farmer' ? 'Marie Mukamana' : 'Supplier Ltd',
                            email: orderType === 'farmer' ? 'marie@example.com' : 'supplier@example.com'
                        }
                    }
                };

                setOrder(mockOrder);
                setOrderType(orderType);
            } catch (err) {
                setError('Failed to load order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [params.id]);

    const handleShareOrder = (order: any) => {
        if (navigator.share) {
            navigator.share({
                title: `Order ${order.id}`,
                text: `Order ${order.id} - ${order.totalPrice} RWF`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast({
                description: 'Order link copied to clipboard',
                variant: 'default',
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'text-success bg-success/10';
            case 'Processing': return 'text-info bg-info/10';
            case 'Failed': return 'text-destructive bg-destructive/10';
            default: return 'text-muted-foreground bg-muted';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Completed': return <TrendingUp className="w-4 h-4" />;
            case 'Processing': return <Eye className="w-4 h-4" />;
            case 'Failed': return <TrendingDown className="w-4 h-4" />;
            default: return <Calendar className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-background">
                <Sidebar userType={UserType.ADMIN} activeItem="Order Management" />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading order...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex h-screen bg-background">
                <Sidebar userType={UserType.ADMIN} activeItem="Order Management" />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h1>
                        <p className="text-muted-foreground mb-4">{error || 'This order could not be found.'}</p>
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background">
            <Sidebar userType={UserType.ADMIN} activeItem="Order Management" />

            <main className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto p-6 space-y-6">
                    {/* Header */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => router.back()}
                                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <span>Order Details</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(order.status)}>
                                        {getStatusIcon(order.status)}
                                        <span className="ml-2">{order.status}</span>
                                    </Badge>
                                    <Badge variant="outline">
                                        {orderType === 'farmer' ? 'Farmer Order' : 'Supplier Order'}
                                    </Badge>
                                </div>
                            </CardTitle>
                            <CardDescription>
                                {orderType === 'farmer' ? 'Farmer-to-buyer transaction details' : 'Supplier-to-farmer transaction details'}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Order Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Order ID</p>
                                        <p className="font-semibold text-foreground">{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Amount</p>
                                        <p className="font-semibold text-foreground text-lg">RWF {order.totalPrice.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Status</p>
                                        <Badge className={getStatusColor(order.status)}>
                                            {getStatusIcon(order.status)}
                                            <span className="ml-2">{order.status}</span>
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Order Date</p>
                                        <p className="font-semibold text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleShareOrder(order)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>
                                    <Button
                                        onClick={() => window.print()}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                        <Package className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground text-lg">{order.product.name}</h3>
                                        <p className="text-muted-foreground">{order.product.description}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <Badge variant="outline">{order.product.category}</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {order.product.price} RWF per {order.product.measurementUnit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Participants */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Transaction Participants</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Buyer */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-foreground flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Buyer
                                        </h4>
                                        <div className="bg-card p-4 rounded-lg border">
                                            <p className="font-semibold text-foreground">{order.buyer.names}</p>
                                            <p className="text-sm text-muted-foreground">{order.buyer.email}</p>
                                        </div>
                                    </div>

                                    {/* Seller */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-foreground flex items-center gap-2">
                                            <Package className="w-4 h-4" />
                                            {orderType === 'farmer' ? 'Farmer' : 'Supplier'}
                                        </h4>
                                        <div className="bg-card p-4 rounded-lg border">
                                            <p className="font-semibold text-foreground">{order.product.owner.names}</p>
                                            <p className="text-sm text-muted-foreground">{order.product.owner.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>

    );
}
