'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, Bell, Mail, Globe, Shield, CreditCard, User, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    language: 'en',
    timezone: 'Africa/Kigali',
    currency: 'RWF',
  });

  // Load saved settings from localStorage if available
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    // Save to localStorage
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message or notification
    }, 1000);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="mr-2 h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <Label htmlFor="theme">Theme</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred theme</p>
                </div>
                <Button variant="outline" size="sm" onClick={toggleTheme}>
                  {theme === 'dark' ? (
                    <Moon className="mr-2 h-4 w-4" />
                  ) : (
                    <Sun className="mr-2 h-4 w-4" />
                  )}
                  {theme === 'dark' ? 'Dark' : 'Light'} Mode
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={value => handleSettingChange('language', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="rw">Kinyarwanda</SelectItem>
                    <SelectItem value="sw">Swahili</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={value => handleSettingChange('timezone', value)}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Kigali">(GMT+2) Kigali, Rwanda</SelectItem>
                    <SelectItem value="Africa/Nairobi">(GMT+3) Nairobi, Kenya</SelectItem>
                    <SelectItem value="Africa/Kampala">(GMT+3) Kampala, Uganda</SelectItem>
                    <SelectItem value="Africa/Dar_es_Salaam">
                      (GMT+3) Dar es Salaam, Tanzania
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={settings.currency}
                  onValueChange={value => handleSettingChange('currency', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RWF">Rwandan Franc (RWF)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="UGX">Ugandan Shilling (UGX)</SelectItem>
                    <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                    <SelectItem value="TZS">Tanzanian Shilling (TZS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about your account
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={checked => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications on your device
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={checked => handleSettingChange('pushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and promotions
                  </p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={settings.marketingEmails}
                  onCheckedChange={checked => handleSettingChange('marketingEmails', checked)}
                />
              </div>

              <div className="space-y-2 pt-4">
                <Label>Notification Types</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="order-updates" className="font-normal">
                      Order updates
                    </Label>
                    <Switch id="order-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="price-alerts" className="font-normal">
                      Price alerts
                    </Label>
                    <Switch id="price-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="market-trends" className="font-normal">
                      Market trends
                    </Label>
                    <Switch id="market-trends" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="system-messages" className="font-normal">
                      System messages
                    </Label>
                    <Switch id="system-messages" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Plans</CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Current Plan</h3>
                      <p className="text-sm text-muted-foreground">Free Plan</p>
                    </div>
                    <Button variant="outline">Upgrade Plan</Button>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Plan Features</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Basic access to platform</li>
                        <li>• Limited product listings</li>
                        <li>• Community support</li>
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Usage</p>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Storage</span>
                            <span>2GB / 5GB</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-full w-2/5 rounded-full bg-green-600"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Products</span>
                            <span>5 / 10</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-full w-1/2 rounded-full bg-blue-600"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Next Billing Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                      <Button variant="link" className="h-auto p-0 text-sm">
                        View billing history
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Payment Methods</h3>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-16 items-center justify-center rounded-md border bg-muted">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    + Add Payment Method
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy and data sharing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Data Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="data-collection">Data Collection</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow us to collect anonymous usage data to improve our services
                      </p>
                    </div>
                    <Switch id="data-collection" defaultChecked />
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="personalized-ads">Personalized Ads</Label>
                      <p className="text-sm text-muted-foreground">
                        Show personalized advertisements based on your activity
                      </p>
                    </div>
                    <Switch id="personalized-ads" defaultChecked />
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="location-tracking">Location Tracking</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow us to access your location for better service
                      </p>
                    </div>
                    <Switch id="location-tracking" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Account Data</h3>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Download Your Data</h4>
                        <p className="text-sm text-muted-foreground">
                          Request a copy of all your personal data
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Request Data
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border border-destructive p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-destructive">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Privacy Settings'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
