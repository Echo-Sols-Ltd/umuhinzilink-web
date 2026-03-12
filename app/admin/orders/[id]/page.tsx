'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import { Order, UserType } from '@/types';
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
} from 'lucide-react';

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const {
        farmerOrders,
        buyerOrders,
        supplierOrders,
        currentFarmerOrder,
        currentBuyerOrder,
        currentSupplierOrder,
        setCurrentFarmerOrder,
        setCurrentBuyerOrder,
        setCurrentSupplierOrder,
        fetchFarmerOrders,
        fetchBuyerOrders,
        fetchSupplierOrders
    } = useOrder();
    const { toast: showToast } = useToast();
    const [orderType, setOrderType] = useState<'farmer' | 'supplier'>('farmer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const orderId = params.id as string;

    useEffect(() => {
        const loadOrder = async () => {
            if (!orderId) return;

            setLoading(true);
            setError(null);

            try {
                // Step 1: Check all order types in context
                let foundOrder = null;
                let foundType = null;

                // Check farmer orders
                foundOrder = farmerOrders?.find(o => o.id === orderId);
                if (foundOrder) {
                    foundType = 'farmer';
                    setCurrentFarmerOrder(foundOrder);
                }

                // Check buyer orders
                if (!foundOrder) {
                    foundOrder = buyerOrders?.find(o => o.id === orderId);
                    if (foundOrder) {
                        foundType = 'buyer';
                        setCurrentBuyerOrder(foundOrder);
                    }
                }

                // Check supplier orders
                if (!foundOrder) {
                    foundOrder = supplierOrders?.find(o => o.id === orderId);
                    if (foundOrder) {
                        foundType = 'supplier';
                        setCurrentSupplierOrder(foundOrder);
                    }
                }

                // Check current context orders
                if (!foundOrder) {
                    if (currentFarmerOrder?.id === orderId) {
                        foundOrder = currentFarmerOrder;
                        foundType = 'farmer';
                    } else if (currentBuyerOrder?.id === orderId) {
                        foundOrder = currentBuyerOrder;
                        foundType = 'buyer';
                    } else if (currentSupplierOrder?.id === orderId) {
                        foundOrder = currentSupplierOrder;
                        foundType = 'supplier';
                    }
                }

                if (foundOrder) {
                    // ✅ Found in context - use immediately
                    setOrderType(foundType as 'farmer' | 'supplier');
                    setLoading(false);
                } else {
                    // ❌ Not in context - fetch from server
                    // Try different endpoints based on order type
                    let response = null;

                    try {
                        const { orderService } = await import('@/services/orders');
                        response = await orderService.getFarmerOrderById(orderId);
                        if (response.success && response.data) {
                            setCurrentFarmerOrder(response.data);
                            setOrderType('farmer');
                            fetchFarmerOrders();
                        }
                    } catch (e) {
                        // Try supplier order
                        try {
                            const { orderService } = await import('@/services/orders');
                            response = await orderService.getSupplierOrderById(orderId);
                            if (response.success && response.data) {
                                setCurrentSupplierOrder(response.data);
                                setOrderType('supplier');
                                fetchSupplierOrders();
                            }
                        } catch (e2) {
                            throw new Error('Order not found');
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch order:', error);
                setError('Order not found');
                showToast({
                    title: "Error",
                    description: "Failed to load order details",
                    variant: "default"
                });
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            loadOrder();
        }
    }, [orderId, farmerOrders, buyerOrders, supplierOrders, currentFarmerOrder, currentBuyerOrder, currentSupplierOrder, setCurrentFarmerOrder, setCurrentBuyerOrder, setCurrentSupplierOrder, fetchFarmerOrders, fetchBuyerOrders, fetchSupplierOrders, showToast]);

    // Get current order based on type
    const getCurrentOrder = () => {
        switch (orderType) {
            case 'farmer':
                return currentFarmerOrder;
            case 'supplier':
                return currentSupplierOrder;
            default:
                return null;
        }
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
            <div className="flex h-screen bg-background">
                <Sidebar userType={UserType.GOVERNMENT} activeItem="Orders" />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-background">
                <Sidebar userType={UserType.GOVERNMENT} activeItem="Orders" />
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
            </div>
        );
    }

    const order = getCurrentOrder();

    if (!order) {
        return (
            <div className="flex h-screen bg-background">
                <Sidebar userType={UserType.GOVERNMENT} activeItem="Orders" />
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
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background">
            <Sidebar userType={UserType.GOVERNMENT} activeItem="Orders" />

            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={handleBack}
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Orders</span>
                        </Button>
                        <div className="h-8 w-px bg-border"></div>
                        <div>
                            <h1 className="text-xl font-semibold text-foreground">Order Details</h1>
                            <p className="text-sm text-muted-foreground">
                                #{order.id.slice(0, 8)} • {orderType === 'farmer' ? 'Farmer Order' : 'Supplier Order'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
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
                    </div>
                </header>

                <div className="p-6 space-y-6">
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
                                        {orderType === 'farmer' ? order.buyer?.names : order.buyer?.names}
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
                                    <Badge className={order.isPaid ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10'}>
                                        {order.isPaid ? 'Paid' : 'Unpaid'}
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
                </div>
            </main>
        </div>
    );
}
