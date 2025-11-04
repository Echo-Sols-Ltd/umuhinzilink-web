'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, Save, User, Mail, MapPin, Phone, Calendar, Crop } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Jean de Dieu',
    email: 'jean.dieu@example.com',
    phone: '+250 78 123 4567',
    location: 'Kigali, Rwanda',
    joinDate: 'January 2023',
    bio: 'Passionate farmer with 5+ years of experience in sustainable agriculture and organic farming practices.',
    avatar: '/avatars/jean.png',
  });
  const [formData, setFormData] = useState({ ...userData });

  useEffect(() => {
    // In a real app, you would fetch user data here
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        // Add other user properties as needed
      }));
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, you would update the user data in your backend
    setUserData({ ...formData });
    setIsEditing(false);

    // Update localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          ...user,
          name: formData.name,
          email: formData.email,
          // Update other fields as needed
        })
      );
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // In a real app, you would upload the file to your server
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and personal information
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences" disabled>
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal information and how it's displayed on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={isEditing ? formData.avatar : userData.avatar} />
                      <AvatarFallback>
                        {userData.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                        <Pencil className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </label>
                    )}
                  </div>
                  {isEditing && (
                    <p className="text-sm text-muted-foreground">
                      Click on the avatar to change your profile picture
                    </p>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 rounded-md border p-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{userData.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 rounded-md border p-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{userData.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 rounded-md border p-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{userData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="location"
                          name="location"
                          className="pl-10"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 rounded-md border p-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{userData.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="flex items-center space-x-2 rounded-md border p-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{userData.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.bio}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="rounded-md border p-4">
                      <p className="text-sm">{userData.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Update your password and enable two-factor authentication for added security.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Change Password</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Active Sessions</h3>
                      <p className="text-sm text-muted-foreground">
                        View and manage your active sessions.
                      </p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
