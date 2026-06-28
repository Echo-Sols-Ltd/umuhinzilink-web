'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import PageLoading from '@/components/layout/PageLoading';
import { Order, UserRole, isPaidOrder } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
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
} from '@/lib/icons';

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const {
        currentOrder,
        setCurrentOrder,
    } = useOrder();
    const { toast: showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const orderId = params.id as string;

    useEffect(() => {
        if (!orderId) return;

        let cancelled = false;

        const loadOrder = async () => {
            setLoading(true);
            setError(null);

            try {
                const { orderService } = await import('@/services/orders');
                const response = await orderService.getOrderById(orderId);
                if (cancelled) return;

                if (response.success && response.data) {
                    setCurrentOrder(response.data);
                } else {
                    throw new Error('Order not found');
                }
            } catch (error) {
                if (!cancelled) {
                    console.error('Failed to fetch order:', error);
                    setError('Order not found');
                    showToast({
                        title: "Error",
                        description: "Failed to load order details",
                        variant: "default"
                    });
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadOrder();

        return () => {
            cancelled = true;
        };
    }, [orderId, setCurrentOrder, showToast]);

    // Get current order based on type
    const getCurrentOrder = () => {
        return currentOrder;
    };

    const handleShareOrder = (order: Order) => {
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
            default: return <Package className="w-4 h-4" />;
        }
    };

    const handleBack = () => {
        router.push('/admin/orders');
    };

    if (loading) {
        return (
            <main className="flex-1 flex items-center justify-center">
                <PageLoading
                    variant="section"
                    label="Loading order"
                    description="Fetching order details…"
                    className="bg-transparent dark:bg-transparent"
                />
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">Order Not Found</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={handleBack} className="mt-4">
                        Back to Orders
                    </Button>
                </div>
            </main>
        );
    }

    const order = getCurrentOrder();

    if (!order) {
        return (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">Order Not Found</h2>
                    <p className="text-muted-foreground">The order you're looking for doesn't exist.</p>
                    <Button onClick={handleBack} className="mt-4">
                        Back to Orders
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <>
            <AdminPageHeader
                    title="Order Details"
                    description={`#${order.id.slice(0, 8)} • Order`}
                    backHref="/admin/orders"
                    backLabel="Back to Orders"
                    actions={
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleShareOrder(order)}
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </>
                    }
                />

                <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
                    {/* Order Status Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Order Status</CardTitle>
                                    <CardDescription>
                                        Current status and progress information
                                    </CardDescription>
                                </div>
                                <Badge className={getStatusColor(order.status)}>
                                    <div className="flex items-center space-x-1">
                                        {getStatusIcon(order.status)}
                                        <span>{order.status}</span>
                                    </div>
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Order ID</p>
                                    <p className="font-medium">#{order.id.slice(0, 8)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                    <p className="font-medium">RWF {order.totalPrice?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Created</p>
                                    <p className="font-medium">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    Customer Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">
                                        {order.buyer?.firstName} {order.buyer?.lastName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{order.buyer?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">{order.buyer?.phoneNumber || 'N/A'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Package className="w-5 h-5 mr-2" />
                                    Product Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Product Name</p>
                                    <p className="font-medium">{order.product?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Quantity</p>
                                    <p className="font-medium">
                                        {order.quantity} {order.product?.measurementUnit}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Unit Price</p>
                                    <p className="font-medium">
                                        RWF {(order.totalPrice / order.quantity).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Payment Status</p>
                                    <Badge className={isPaidOrder(order.status) ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10'}>
                                        {isPaidOrder(order.status) ? 'Paid' : 'Unpaid'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Actions</CardTitle>
                            <CardDescription>
                                Administrative controls for this order
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Full Details
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    View Timeline
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Invoice
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </main>
        </>
    );
}

