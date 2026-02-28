'use client';

import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, Shield, Star, Trophy, Medal, Crown, Gem, Zap, Target, Heart, Leaf } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'achievement' | 'verification' | 'quality' | 'community' | 'milestone';
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
}

interface VerificationStatus {
  isVerified: boolean;
  verificationLevel: 'basic' | 'standard' | 'premium';
  verifiedFields: string[];
  pendingVerifications: string[];
}

function ProfileBadgesComponent() {
  const { profile } = useProfile();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [verification, setVerification] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from API based on user profile
    const mockBadges: Badge[] = [
      {
        id: 'top_farmer',
        name: 'Top Farmer',
        description: 'Recognized as top performer for exceptional quality and service',
        icon: <Trophy className="w-6 h-6 text-warning" />,
        category: 'achievement',
        earned: true,
        earnedDate: '2024-01-15'
      },
      {
        id: 'verified_seller',
        name: 'Verified Seller',
        description: 'Identity and business information verified by UmuhinziLink',
        icon: <CheckCircle className="w-6 h-6 text-info" />,
        category: 'verification',
        earned: true,
        earnedDate: '2023-12-01'
      },
      {
        id: 'quality_excellence',
        name: 'Quality Excellence',
        description: 'Maintained 5-star rating for 6 consecutive months',
        icon: <Star className="w-6 h-6 text-warning" />,
        category: 'quality',
        earned: true,
        earnedDate: '2024-01-10'
      },
      {
        id: 'community_hero',
        name: 'Community Hero',
        description: 'Helped 10+ new farmers get started on the platform',
        icon: <Heart className="w-6 h-6 text-destructive" />,
        category: 'community',
        earned: true,
        earnedDate: '2023-11-20'
      },
      {
        id: 'organic_certified',
        name: 'Organic Certified',
        description: 'Official organic farming certification verified',
        icon: <Leaf className="w-6 h-6 text-success" />,
        category: 'verification',
        earned: false,
        progress: 75,
        maxProgress: 100
      },
      {
        id: 'hundred_orders',
        name: 'Century Club',
        description: 'Completed 100 successful orders',
        icon: <Target className="w-6 h-6 text-orange-600" />,
        category: 'milestone',
        earned: false,
        progress: 85,
        maxProgress: 100
      },
      {
        id: 'super_responder',
        name: 'Super Responder',
        description: '95%+ response rate for 3 months straight',
        icon: <Zap className="w-6 h-6 text-indigo-600" />,
        category: 'achievement',
        earned: false,
        progress: 92,
        maxProgress: 95
      },
      {
        id: 'premium_member',
        name: 'Premium Member',
        description: 'Upgraded to premium membership with exclusive benefits',
        icon: <Crown className="w-6 h-6 text-amber-600" />,
        category: 'milestone',
        earned: false
      }
    ];

    const mockVerification: VerificationStatus = {
      isVerified: true,
      verificationLevel: 'standard',
      verifiedFields: ['Identity', 'Business Registration', 'Phone Number', 'Email Address'],
      pendingVerifications: ['Organic Certification', 'Bank Account']
    };

    setTimeout(() => {
      setBadges(mockBadges);
      setVerification(mockVerification);
      setLoading(false);
    }, 1000);
  }, [profile]);

  const getCategoryColor = (category: Badge['category']) => {
    switch (category) {
      case 'achievement':
        return 'bg-warning/10 border-warning';
      case 'verification':
        return 'bg-info/10 border-info';
      case 'quality':
        return 'bg-warning/10 border-warning';
      case 'community':
        return 'bg-destructive/10 border-destructive';
      case 'milestone':
        return 'bg-warning/10 border-warning';
      default:
        return 'bg-muted border-border';
    }
  };

  const getVerificationLevelIcon = (level: VerificationStatus['verificationLevel']) => {
    switch (level) {
      case 'basic':
        return <Shield className="w-5 h-5 text-muted-foreground" />;
      case 'standard':
        return <Shield className="w-5 h-5 text-info" />;
      case 'premium':
        return <Crown className="w-5 h-5 text-warning" />;
      default:
        return <Shield className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const earnedBadges = badges.filter(badge => badge.earned);
  const availableBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="space-y-6">
      {/* Verification Status */}
      {verification && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Verification Status</h3>
          <div className="bg-card border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getVerificationLevelIcon(verification.verificationLevel)}
                <div>
                  <p className="font-medium text-foreground capitalize">
                    {verification.verificationLevel} Verification
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {verification.isVerified ? 'Verified Account' : 'Verification Pending'}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                verification.isVerified 
                  ? 'bg-success/10 text-success' 
                  : 'bg-warning/10 text-warning'
              }`}>
                {verification.isVerified ? 'Verified' : 'In Progress'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Verified Fields</p>
                <div className="space-y-1">
                  {verification.verifiedFields.map((field, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm text-muted-foreground">{field}</span>
                    </div>
                  ))}
                </div>
              </div>
              {verification.pendingVerifications.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Pending Verification</p>
                  <div className="space-y-1">
                    {verification.pendingVerifications.map((field, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-warning rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{field}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Earned Badges */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Earned Badges ({earnedBadges.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {earnedBadges.map((badge) => (
            <div 
              key={badge.id} 
              className={`border rounded-lg p-4 ${getCategoryColor(badge.category)}`}
            >
              <div className="flex items-center justify-between mb-2">
                {badge.icon}
                <Medal className="w-4 h-4 text-warning" />
              </div>
              <h4 className="font-medium text-foreground text-sm mb-1">{badge.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
              {badge.earnedDate && (
                <p className="text-xs text-muted-foreground">
                  Earned: {formatDate(badge.earnedDate)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Available Badges */}
      {availableBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Available Badges ({availableBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableBadges.map((badge) => (
              <div 
                key={badge.id} 
                className="border border-border rounded-lg p-4 bg-muted opacity-75"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="opacity-50">{badge.icon}</div>
                  <div className="w-4 h-4 border-2 border-muted-foreground rounded-full"></div>
                </div>
                <h4 className="font-medium text-foreground text-sm mb-1">{badge.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                {badge.progress !== undefined && badge.maxProgress !== undefined && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs text-muted-foreground">
                        {badge.progress}/{badge.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-info h-1.5 rounded-full" 
                        style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badge Categories Legend */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Badge Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-warning" />
            <span className="text-sm text-foreground">Achievement</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-info" />
            <span className="text-sm text-foreground">Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-warning" />
            <span className="text-sm text-foreground">Quality</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-destructive" />
            <span className="text-sm text-foreground">Community</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-warning" />
            <span className="text-sm text-foreground">Milestone</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileBadgesComponent;
