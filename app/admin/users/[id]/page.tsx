'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import PageLoading from '@/components/layout/PageLoading';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { useI18n } from '@/contexts/I18nContext';
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
    const { t } = useI18n();
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
                setError(t('admin.usersDetail.failedToLoad'));
                showToast({
                    title: t('common.error'),
                    description: t('admin.usersDetail.toasts.loadFailed'),
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
            title: t('common.information'),
            description: t('admin.usersDetail.toasts.notAvailable'),
            variant: "default"
        });
    };

    const handleSuspendUser = async () => {
        if (!selectedUser) return;

        try {
            await adminService.toggleUserStatus(selectedUser.id, true);
            setCurrentUser({ ...selectedUser, active: false });
            showToast({
                title: t('common.success'),
                description: t('admin.usersDetail.toasts.userSuspended'),
                variant: "default"
            });
        } catch (error) {
            console.error('Failed to suspend user:', error);
            showToast({
                title: t('common.error'),
                description: t('admin.usersDetail.toasts.suspendFailed'),
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
                title: t('common.success'),
                description: t('admin.usersDetail.toasts.userActivated'),
                variant: "default"
            });
        } catch (error) {
            console.error('Failed to unsuspend user:', error);
            showToast({
                title: t('common.error'),
                description: t('admin.usersDetail.toasts.activateFailed'),
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
                        label={t('admin.usersDetail.loadingLabel')}
                        description={t('admin.usersDetail.loadingDescription')}
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
                        <h2 className="text-xl font-semibold text-foreground mb-2">{t('admin.usersDetail.notFoundTitle')}</h2>
                        <p className="text-muted-foreground">{error || t('admin.usersDetail.notFoundDesc')}</p>
                        <Button onClick={handleBack} className="mt-4">
                            {t('admin.usersDetail.backToUsers')}
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
                    title={t('admin.usersDetail.title')}
                    description={`#${user.id.slice(0, 8)} • ${user.role}`}
                    backHref="/admin/users"
                    backLabel={t('admin.usersDetail.backToUsers')}
                    actions={
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSendMessage}
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                {t('admin.usersDetail.message')}
                            </Button>
                            {!user.active ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleUnsuspendUser}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    {t('admin.usersDetail.unsuspend')}
                                </Button>
                            ) : (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleSuspendUser}
                                >
                                    <Ban className="w-4 h-4 mr-2" />
                                    {t('admin.usersDetail.suspend')}
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
                                    <CardTitle className="text-lg">{t('admin.usersDetail.userStatus')}</CardTitle>
                                    <CardDescription>
                                        {t('admin.usersDetail.userStatusDesc')}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge className={user.emailVerified ? 'text-success bg-success/10' : 'text-warning bg-warning/10'}>
                                        <div className="flex items-center space-x-1">
                                            {user.emailVerified ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                            <span>{user.emailVerified ? t('admin.users.status.verified') : t('admin.users.status.pending')}</span>
                                        </div>
                                    </Badge>
                                    {!user.active && (
                                        <Badge className="text-destructive bg-destructive/10">
                                            <div className="flex items-center space-x-1">
                                                <XCircle className="w-4 h-4" />
                                                <span>{t('admin.users.status.suspended')}</span>
                                            </div>
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin.usersDetail.userId')}</p>
                                    <p className="font-medium">#{user.id.slice(0, 8)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin.usersDetail.role')}</p>
                                    <p className="font-medium">{user.role}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin.usersDetail.joined')}</p>
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
                                    {t('admin.usersDetail.personalInfo')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin.usersDetail.fullName')}</p>
                                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin.usersDetail.email')}</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin.usersDetail.phone')}</p>
                                    <p className="font-medium">{user.phoneNumber || t('profile.notProvided')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin.usersDetail.address')}</p>
                                    <p className="font-medium">
                                        {t('profile.notProvided')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Shield className="w-5 h-5 mr-2" />
                                    {t('admin.usersDetail.accountInfo')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin.usersDetail.accountType')}</p>
                                    <p className="font-medium">{user.role}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin.usersDetail.verificationStatus')}</p>
                                    <Badge className={user.emailVerified ? 'text-success bg-success/10' : 'text-warning bg-warning/10'}>
                                        {user.emailVerified ? t('admin.users.status.verifiedAccount') : t('admin.users.status.pendingVerification')}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin.usersDetail.accountStatus')}</p>
                                    <Badge className={!user.active ? 'text-destructive bg-destructive/10' : 'text-success bg-success/10'}>
                                        {!user.active ? t('admin.users.status.suspended') : t('admin.usersDetail.active')}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.usersDetail.adminActions')}</CardTitle>
                            <CardDescription>
                                {t('admin.usersDetail.adminActionsDesc')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" onClick={handleSendMessage}>
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    {t('admin.usersDetail.sendMessage')}
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    {t('admin.usersDetail.editUser')}
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {t('admin.usersDetail.viewActivity')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
