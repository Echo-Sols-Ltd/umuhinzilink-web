'use client';

import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Calendar, Eye, Download, MessageSquare, ShoppingBag, Star, Award } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { UserType } from '@/types/enums';

interface ActivityData {
  date: string;
  action: string;
  details: string;
  type: 'login' | 'profile_update' | 'order' | 'message' | 'review' | 'achievement';
}

interface ProfileAnalytics {
  totalViews: number;
  profileCompletion: number;
  responseRate: number;
  averageRating: number;
  totalOrders: number;
  totalMessages: number;
  lastActive: string;
  joinDate: string;
}

function ProfileActivityComponent() {
  const { profile, hasRole } = useProfile();
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [analytics, setAnalytics] = useState<ProfileAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockActivities: ActivityData[] = [
      {
        date: '2024-01-15T10:30:00Z',
        action: 'Profile Updated',
        details: 'Updated farm information and added new crops',
        type: 'profile_update'
      },
      {
        date: '2024-01-14T15:45:00Z',
        action: 'New Order',
        details: 'Received order for 500kg of tomatoes',
        type: 'order'
      },
      {
        date: '2024-01-13T09:20:00Z',
        action: 'Message Received',
        details: 'New inquiry from Kigali Fresh Market',
        type: 'message'
      },
      {
        date: '2024-01-12T14:15:00Z',
        action: 'Review Received',
        details: '5-star review for product quality',
        type: 'review'
      },
      {
        date: '2024-01-11T08:00:00Z',
        action: 'Achievement Unlocked',
        details: 'Top Farmer of the Month - January 2024',
        type: 'achievement'
      }
    ];

    const mockAnalytics: ProfileAnalytics = {
      totalViews: 1247,
      profileCompletion: 85,
      responseRate: 92,
      averageRating: 4.8,
      totalOrders: 156,
      totalMessages: 89,
      lastActive: '2 hours ago',
      joinDate: 'January 2023'
    };

    setTimeout(() => {
      setActivities(mockActivities);
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, [profile]);

  const getActivityIcon = (type: ActivityData['type']) => {
    switch (type) {
      case 'login':
        return <Activity className="w-4 h-4 text-blue-500" />;
      case 'profile_update':
        return <Download className="w-4 h-4 text-green-500" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-purple-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-orange-500" />;
      case 'review':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-destructive" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Profile Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-info">Profile Views</p>
                <p className="text-2xl font-bold text-info">{analytics.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-info" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-xs text-success">+12% this month</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success">Messages</p>
                <p className="text-2xl font-bold text-success">{analytics.totalMessages.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-success" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${analytics.profileCompletion}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warning">Messages</p>
                <p className="text-xl font-bold text-warning">{analytics.totalMessages}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-purple-500">Excellent response time</p>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warning">Orders</p>
                <p className="text-2xl font-bold text-warning">{analytics.totalOrders.toLocaleString()}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-3 h-3 ${star <= Math.floor(analytics.averageRating) ? 'text-warning fill-current' : 'text-muted-foreground'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Activity Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-warning" />
              <div>
                <p className="text-sm font-medium text-foreground">Total Orders</p>
                <p className="text-xl font-bold text-foreground">{analytics.totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-warning" />
              <div>
                <p className="text-sm font-medium text-foreground">Messages</p>
                <p className="text-xl font-bold text-foreground">{analytics.totalMessages}</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-info" />
              <div>
                <p className="text-sm font-medium text-foreground">Member Since</p>
                <p className="text-sm font-bold text-foreground">{analytics.joinDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <div className="mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <span className="text-xs text-muted-foreground">{formatDate(activity.date)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <h4 className="font-medium text-success">Strong Performance</h4>
            </div>
            <p className="text-sm text-success">Your profile has a 92% response rate and 4.8-star rating, placing you in the top 10% of performers.</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-info" />
              <h4 className="font-medium text-info">Achievement Unlocked</h4>
            </div>
            <p className="text-sm text-info">You've been recognized as Top Farmer of the Month. Keep up the excellent work!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileActivityComponent;
