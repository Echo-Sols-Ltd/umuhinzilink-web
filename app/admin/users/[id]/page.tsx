'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { adminService } from '@/services/admin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    UserIcon,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Edit,
    Ban,
    MessageSquare
} from 'lucide-react';

export default function AdminUserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user: currentUser } = useAuth();
    const {
        users,
        currentUser: selectedUser,
        setCurrentUser,
        loading: contextLoading
    } = useUser();
    const { toast: showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const userId = params.id as string;

    useEffect(() => {
        const loadUser = async () => {
            if (!userId) return;

            setLoading(true);
            setError(null);

            try {
                // Step 1: Check if user is already in context lists
                let foundUser = users?.find(u => u.id === userId);

                // Step 2: Check if it's the current context user
                if (!foundUser && selectedUser?.id === userId) {
                    foundUser = selectedUser;
                }

                if (foundUser) {
                    // ✅ Found in context - use immediately
                    setCurrentUser(foundUser);
                    setLoading(false);
                } else {
                    const userData = await adminService.getUserById(userId);
                    setCurrentUser(userData);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setError('Failed to load user');
                showToast({
                    title: "Error",
                    description: "Failed to load user details",
                    variant: "default"
                });
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadUser();
        }
    }, [userId, users, selectedUser, setCurrentUser, showToast]);

    const handleBack = () => {
        router.push('/admin/users');
    };

    const handleSendMessage = () => {
        showToast({
            title: "Not available",
            description: "Direct messaging is only available through order negotiations.",
            variant: "default"
        });
    };

    const handleSuspendUser = async () => {
        if (!selectedUser) return;

        try {
            // For now, just show a toast since the API method doesn't exist
            showToast({
                title: "Info",
                description: "Suspend user functionality not yet implemented",
                variant: "default"
            });
        } catch (error) {
            console.error('Failed to suspend user:', error);
            showToast({
                title: "Error",
                description: "Failed to suspend user",
                variant: "default"
            });
        }
    };

    const handleUnsuspendUser = async () => {
        if (!selectedUser) return;

        try {
            // For now, just show a toast since the API method doesn't exist
            showToast({
                title: "Info",
                description: "Unsuspend user functionality not yet implemented",
                variant: "default"
            });
        } catch (error) {
            console.error('Failed to unsuspend user:', error);
            showToast({
                title: "Error",
                description: "Failed to unsuspend user",
                variant: "default"
            });
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-background">
                <Sidebar userType={UserRole.ADMIN} activeItem="Users" />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </main>
            </div>
        );
    }

    if (error || !selectedUser) {
        return (
            <div className="flex h-screen bg-background">
                <Sidebar userType={UserRole.ADMIN} activeItem="Users" />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <UserIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-foreground mb-2">User Not Found</h2>
                        <p className="text-muted-foreground">{error || 'The user you\'re looking for doesn\'t exist.'}</p>
                        <Button onClick={handleBack} className="mt-4">
                            Back to Users
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    const user = selectedUser;

    return (
        <div className="flex h-screen bg-background">
            <Sidebar userType={UserRole.ADMIN} activeItem="Users" />

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
                            <span>Back to Users</span>
                        </Button>
                        <div className="h-8 w-px bg-border"></div>
                        <div>
                            <h1 className="text-xl font-semibold text-foreground">User Details</h1>
                            <p className="text-sm text-muted-foreground">
                                #{user.id.slice(0, 8)} • {user.role}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSendMessage}
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                        </Button>
                        {(user as any).suspended ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleUnsuspendUser}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Unsuspend
                            </Button>
                        ) : (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleSuspendUser}
                            >
                                <Ban className="w-4 h-4 mr-2" />
                                Suspend
                            </Button>
                        )}
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* User Status Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">User Status</CardTitle>
                                    <CardDescription>
                                        Current status and verification information
                                    </CardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge className={user.emailVerified ? 'text-success bg-success/10' : 'text-warning bg-warning/10'}>
                                        <div className="flex items-center space-x-1">
                                            {user.emailVerified ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                            <span>{user.emailVerified ? 'Verified' : 'Pending'}</span>
                                        </div>
                                    </Badge>
                                    {(user as any).suspended && (
                                        <Badge className="text-destructive bg-destructive/10">
                                            <div className="flex items-center space-x-1">
                                                <XCircle className="w-4 h-4" />
                                                <span>Suspended</span>
                                            </div>
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">User ID</p>
                                    <p className="font-medium">#{user.id.slice(0, 8)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Role</p>
                                    <p className="font-medium">{user.role}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Joined</p>
                                    <p className="font-medium">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <UserIcon className="w-5 h-5 mr-2" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Full Name</p>
                                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email Address</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone Number</p>
                                    <p className="font-medium">{user.phoneNumber || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Address</p>
                                    <p className="font-medium">
                                        {'Not provided'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Shield className="w-5 h-5 mr-2" />
                                    Account Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Account Type</p>
                                    <p className="font-medium">{user.role}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Verification Status</p>
                                    <Badge className={user.emailVerified ? 'text-success bg-success/10' : 'text-warning bg-warning/10'}>
                                        {user.emailVerified ? 'Verified' : 'Pending Verification'}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Account Status</p>
                                    <Badge className={(user as any).suspended ? 'text-destructive bg-destructive/10' : 'text-success bg-success/10'}>
                                        {(user as any).suspended ? 'Suspended' : 'Active'}
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
                                Administrative controls for this user
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" onClick={handleSendMessage}>
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Send Message
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit User
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    View Activity
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
