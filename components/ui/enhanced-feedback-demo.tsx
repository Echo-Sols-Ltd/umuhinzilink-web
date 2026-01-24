'use client';

import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import { Separator } from './separator';
import { 
  useNotificationActions, 
  setGlobalNotificationActions 
} from './enhanced-notification-system';
import { useStackedNotifications } from './notification-stack';
import { 
  InlineError, 
  FieldError, 
  SuccessMessage, 
  WarningMessage, 
  InfoMessage 
} from './enhanced-inline-errors';
import { 
  SuccessCelebration, 
  useSuccessCelebration 
} from './success-celebration';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Zap, 
  Heart,
  Trophy,
  Gift,
  Star,
  Sparkles,
  RefreshCw,
  Send,
  Save,
  Upload,
  Download,
  Settings,
  Bell
} from 'lucide-react';

export const EnhancedFeedbackDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Notification hooks
  const notifications = useNotificationActions();
  const stackedNotifications = useStackedNotifications();
  const { celebrate, SuccessCelebrationComponent } = useSuccessCelebration();

  // Set global notification actions for standalone usage
  React.useEffect(() => {
    setGlobalNotificationActions(notifications);
  }, [notifications]);

  // Form validation
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on change
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
    
    // Mark as touched
    setFormTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Validate all fields
    const errors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setFormTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      notifications.error('Please fix the form errors before submitting');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      notifications.success('Account created successfully!', {
        title: 'Welcome aboard!',
        action: {
          label: 'Go to Dashboard',
          onClick: () => console.log('Navigate to dashboard'),
          variant: 'primary'
        }
      });
      
      celebrate({
        variant: 'confetti',
        message: '🎉 Welcome to UmuhinziLink!',
        icon: 'trophy',
        color: 'green'
      });
      
      // Reset form
      setFormData({ email: '', password: '', confirmPassword: '' });
      setFormErrors({});
      setFormTouched({});
      
    } catch (error) {
      notifications.error('Failed to create account. Please try again.', {
        title: 'Registration Failed',
        action: {
          label: 'Retry',
          onClick: () => handleSubmit(),
          variant: 'primary'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Enhanced Error Handling & User Feedback
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Beautiful notifications, inline errors, and success celebrations
        </p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="stacked">Stacked</TabsTrigger>
          <TabsTrigger value="inline">Inline Errors</TabsTrigger>
          <TabsTrigger value="celebrations">Celebrations</TabsTrigger>
          <TabsTrigger value="forms">Form Demo</TabsTrigger>
        </TabsList>

        {/* Enhanced Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Enhanced Notification System</span>
              </CardTitle>
              <CardDescription>
                Beautiful notifications with animations, progress bars, and action buttons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  onClick={() => notifications.success('Order placed successfully!')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Success
                </Button>
                
                <Button 
                  onClick={() => notifications.error('Payment failed. Please try again.')}
                  variant="destructive"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Error
                </Button>
                
                <Button 
                  onClick={() => notifications.warning('Session expires in 5 minutes')}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Warning
                </Button>
                
                <Button 
                  onClick={() => notifications.info('New features available!')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Info
                </Button>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  onClick={() => {
                    const id = notifications.loading('Processing your order...');
                    setTimeout(() => {
                      notifications.dismiss(id);
                      notifications.success('Order processed successfully!');
                    }, 3000);
                  }}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Loading Demo
                </Button>
                
                <Button 
                  onClick={() => notifications.success('Product saved to favorites!', {
                    title: 'Saved',
                    action: {
                      label: 'View Favorites',
                      onClick: () => console.log('Navigate to favorites'),
                      variant: 'primary'
                    }
                  })}
                  variant="outline"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  With Action
                </Button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Beautiful slide-in animations with spring physics</li>
                  <li>• Progress bars for auto-dismiss notifications</li>
                  <li>• Action buttons with hover effects</li>
                  <li>• Swipe gestures for dismissal</li>
                  <li>• Pause on hover functionality</li>
                  <li>• Semantic colors and icons</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stacked Notifications */}
        <TabsContent value="stacked" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Stacked Notification System</span>
              </CardTitle>
              <CardDescription>
                Advanced notification stacking with priorities and categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  onClick={() => stackedNotifications.success('Task completed!', {
                    title: 'Success',
                    category: 'tasks'
                  })}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Normal Success
                </Button>
                
                <Button 
                  onClick={() => stackedNotifications.error('Critical system error!', {
                    title: 'System Error',
                    priority: 'urgent',
                    category: 'system'
                  })}
                  variant="destructive"
                >
                  Urgent Error
                </Button>
                
                <Button 
                  onClick={() => stackedNotifications.warning('Low disk space', {
                    title: 'Warning',
                    priority: 'high',
                    expandable: true,
                    category: 'system',
                    metadata: { diskUsage: '95%', availableSpace: '2GB' }
                  })}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  High Priority
                </Button>
                
                <Button 
                  onClick={() => stackedNotifications.info('Update available', {
                    title: 'Info',
                    priority: 'low',
                    category: 'updates'
                  })}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Low Priority
                </Button>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button 
                  onClick={() => {
                    // Create multiple notifications to show stacking
                    stackedNotifications.info('First notification');
                    setTimeout(() => stackedNotifications.warning('Second notification'), 200);
                    setTimeout(() => stackedNotifications.success('Third notification'), 400);
                    setTimeout(() => stackedNotifications.error('Fourth notification'), 600);
                  }}
                  variant="outline"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Stack Demo
                </Button>
                
                <Button 
                  onClick={() => stackedNotifications.dismissAll()}
                  variant="outline"
                >
                  Clear All
                </Button>
                
                <Button 
                  onClick={() => stackedNotifications.dismissByCategory('system')}
                  variant="outline"
                >
                  Clear System
                </Button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-semibold mb-2">Advanced Features:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Priority-based stacking (urgent, high, normal, low)</li>
                  <li>• Category-based grouping and dismissal</li>
                  <li>• Expandable notifications with metadata</li>
                  <li>• Swipe-to-dismiss gestures</li>
                  <li>• Automatic stacking with visual depth</li>
                  <li>• Pause/resume functionality</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inline Errors */}
        <TabsContent value="inline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inline Error Messages</CardTitle>
              <CardDescription>
                Beautiful inline error messages with animations and variants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Variants */}
              <div className="space-y-4">
                <h4 className="font-semibold">Error Variants</h4>
                <InlineError 
                  message="This is a default error message with icon and animation"
                  type="error"
                  variant="default"
                />
                <InlineError 
                  message="This is a subtle error message without background"
                  type="error"
                  variant="subtle"
                />
                <InlineError 
                  message="This is a bordered error message"
                  type="error"
                  variant="bordered"
                />
                <InlineError 
                  message="This is a filled error message"
                  type="error"
                  variant="filled"
                />
              </div>

              <Separator />

              {/* Message Types */}
              <div className="space-y-4">
                <h4 className="font-semibold">Message Types</h4>
                <SuccessMessage 
                  message="Operation completed successfully!"
                  action={{
                    label: "View Details",
                    onClick: () => console.log('View details'),
                    variant: "secondary"
                  }}
                />
                <WarningMessage 
                  message="This action cannot be undone. Please proceed with caution."
                  dismissible
                  onDismiss={() => console.log('Warning dismissed')}
                />
                <InfoMessage 
                  message="New features are available in your dashboard."
                  action={{
                    label: "Learn More",
                    onClick: () => console.log('Learn more'),
                    variant: "primary"
                  }}
                />
                <InlineError 
                  message="Unable to connect to the server. Please check your internet connection."
                  action={{
                    label: "Retry",
                    onClick: () => console.log('Retry connection'),
                    variant: "primary"
                  }}
                  dismissible
                />
              </div>

              <Separator />

              {/* Sizes */}
              <div className="space-y-4">
                <h4 className="font-semibold">Sizes</h4>
                <InlineError message="Small error message" size="sm" />
                <InlineError message="Medium error message" size="md" />
                <InlineError message="Large error message" size="lg" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Success Celebrations */}
        <TabsContent value="celebrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Success Celebrations</span>
              </CardTitle>
              <CardDescription>
                Delightful success animations to celebrate user achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Button 
                  onClick={() => celebrate({
                    variant: 'default',
                    message: '✅ Task Completed!',
                    icon: 'checkCircle',
                    color: 'green'
                  })}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Default
                </Button>
                
                <Button 
                  onClick={() => celebrate({
                    variant: 'confetti',
                    message: '🎉 Order Placed!',
                    icon: 'gift',
                    color: 'rainbow'
                  })}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Confetti
                </Button>
                
                <Button 
                  onClick={() => celebrate({
                    variant: 'sparkles',
                    message: '✨ Achievement Unlocked!',
                    icon: 'star',
                    color: 'gold'
                  })}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Sparkles
                </Button>
                
                <Button 
                  onClick={() => celebrate({
                    variant: 'pulse',
                    message: '💖 Favorite Added!',
                    icon: 'heart',
                    color: 'purple'
                  })}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Pulse
                </Button>
                
                <Button 
                  onClick={() => celebrate({
                    variant: 'bounce',
                    message: '🚀 Upload Complete!',
                    icon: 'zap',
                    color: 'blue'
                  })}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Bounce
                </Button>
                
                <Button 
                  onClick={() => celebrate({
                    variant: 'fireworks',
                    message: '🏆 Level Up!',
                    icon: 'trophy',
                    color: 'gold',
                    size: 'lg'
                  })}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Fireworks
                </Button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-semibold mb-2">Celebration Features:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Multiple animation variants (confetti, sparkles, pulse, bounce, fireworks)</li>
                  <li>• Customizable icons and colors</li>
                  <li>• Different sizes (sm, md, lg, xl)</li>
                  <li>• Backdrop blur and overlay effects</li>
                  <li>• Auto-dismiss with custom duration</li>
                  <li>• Perfect for celebrating user achievements</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Form Demo */}
        <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Validation Demo</CardTitle>
              <CardDescription>
                Real-time form validation with beautiful error handling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className={formErrors.email && formTouched.email ? 'border-red-500' : ''}
                  />
                  <FieldError 
                    error={formErrors.email} 
                    touched={formTouched.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className={formErrors.password && formTouched.password ? 'border-red-500' : ''}
                  />
                  <FieldError 
                    error={formErrors.password} 
                    touched={formTouched.password}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className={formErrors.confirmPassword && formTouched.confirmPassword ? 'border-red-500' : ''}
                  />
                  <FieldError 
                    error={formErrors.confirmPassword} 
                    touched={formTouched.confirmPassword}
                  />
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-semibold mb-2">Form Features:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Real-time validation with shake animations</li>
                  <li>• Field-level error messages</li>
                  <li>• Success celebrations on form submission</li>
                  <li>• Loading states with spinners</li>
                  <li>• Comprehensive error handling</li>
                  <li>• Accessible form validation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Success Celebration Component */}
      <SuccessCelebrationComponent />
    </div>
  );
};