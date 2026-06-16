'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import PageLoading from '@/components/layout/PageLoading';
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
import { useToast } from '@/components/ui/use-toast';

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
            await adminService.toggleUserStatus(selectedUser.id, true);
            setCurrentUser({ ...selectedUser, active: false });
            showToast({
                title: "Success",
                description: "User suspended successfully",
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
            await adminService.toggleUserStatus(selectedUser.id, false);
            setCurrentUser({ ...selectedUser, active: true });
            showToast({
                title: "Success",
                description: "User activated successfully",
                variant: "default"
            });
        } catch (error) {
            console.error('Failed to unsuspend user:', error);
            showToast({
                title: "Error",
                description: "Failed to activate user",
                variant: "default"
            });
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-background">
                <Sidebar userType={UserRole.ADMIN} activeItem="Users" />
                <main className="flex-1 flex items-center justify-center">
                    <PageLoading
                        variant="section"
                        label="Loading user"
                        description="Fetching account details…"
                        className="bg-transparent dark:bg-transparent"
                    />
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
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar userType={UserRole.ADMIN} activeItem="Users" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminPageHeader
                    title="User Details"
                    description={`#${user.id.slice(0, 8)} • ${user.role}`}
                    backHref="/admin/users"
                    backLabel="Back to Users"
                    actions={
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSendMessage}
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Message
                            </Button>
                            {!user.active ? (
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
                        </>
                    }
                />

                <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
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
                                    {!user.active && (
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
                                    <Badge className={!user.active ? 'text-destructive bg-destructive/10' : 'text-success bg-success/10'}>
                                        {!user.active ? 'Suspended' : 'Active'}
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
                </main>
            </div>
        </div>
    );
}
