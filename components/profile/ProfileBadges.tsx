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
        icon: <Trophy className="w-6 h-6 text-yellow-500" />,
        category: 'achievement',
        earned: true,
        earnedDate: '2024-01-15'
      },
      {
        id: 'verified_seller',
        name: 'Verified Seller',
        description: 'Identity and business information verified by UmuhinziLink',
        icon: <CheckCircle className="w-6 h-6 text-blue-500" />,
        category: 'verification',
        earned: true,
        earnedDate: '2023-12-01'
      },
      {
        id: 'quality_excellence',
        name: 'Quality Excellence',
        description: 'Maintained 5-star rating for 6 consecutive months',
        icon: <Star className="w-6 h-6 text-purple-500" />,
        category: 'quality',
        earned: true,
        earnedDate: '2024-01-10'
      },
      {
        id: 'community_hero',
        name: 'Community Hero',
        description: 'Helped 10+ new farmers get started on the platform',
        icon: <Heart className="w-6 h-6 text-red-500" />,
        category: 'community',
        earned: true,
        earnedDate: '2023-11-20'
      },
      {
        id: 'organic_certified',
        name: 'Organic Certified',
        description: 'Official organic farming certification verified',
        icon: <Leaf className="w-6 h-6 text-green-500" />,
        category: 'verification',
        earned: false,
        progress: 75,
        maxProgress: 100
      },
      {
        id: 'hundred_orders',
        name: 'Century Club',
        description: 'Completed 100 successful orders',
        icon: <Target className="w-6 h-6 text-orange-500" />,
        category: 'milestone',
        earned: false,
        progress: 85,
        maxProgress: 100
      },
      {
        id: 'super_responder',
        name: 'Super Responder',
        description: '95%+ response rate for 3 months straight',
        icon: <Zap className="w-6 h-6 text-indigo-500" />,
        category: 'achievement',
        earned: false,
        progress: 92,
        maxProgress: 95
      },
      {
        id: 'premium_member',
        name: 'Premium Member',
        description: 'Upgraded to premium membership with exclusive benefits',
        icon: <Crown className="w-6 h-6 text-amber-500" />,
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
        return 'bg-yellow-50 border-yellow-200';
      case 'verification':
        return 'bg-blue-50 border-blue-200';
      case 'quality':
        return 'bg-purple-50 border-purple-200';
      case 'community':
        return 'bg-red-50 border-red-200';
      case 'milestone':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getVerificationLevelIcon = (level: VerificationStatus['verificationLevel']) => {
    switch (level) {
      case 'basic':
        return <Shield className="w-5 h-5 text-gray-500" />;
      case 'standard':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'premium':
        return <Crown className="w-5 h-5 text-amber-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
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
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getVerificationLevelIcon(verification.verificationLevel)}
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {verification.verificationLevel} Verification
                  </p>
                  <p className="text-sm text-gray-600">
                    {verification.isVerified ? 'Verified Account' : 'Verification Pending'}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                verification.isVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {verification.isVerified ? 'Verified' : 'In Progress'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Verified Fields</p>
                <div className="space-y-1">
                  {verification.verifiedFields.map((field, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{field}</span>
                    </div>
                  ))}
                </div>
              </div>
              {verification.pendingVerifications.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Pending Verification</p>
                  <div className="space-y-1">
                    {verification.pendingVerifications.map((field, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{field}</span>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
                <Medal className="w-4 h-4 text-yellow-500" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm mb-1">{badge.name}</h4>
              <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
              {badge.earnedDate && (
                <p className="text-xs text-gray-500">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available Badges ({availableBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableBadges.map((badge) => (
              <div 
                key={badge.id} 
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-75"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="opacity-50">{badge.icon}</div>
                  <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                </div>
                <h4 className="font-medium text-gray-700 text-sm mb-1">{badge.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                {badge.progress !== undefined && badge.maxProgress !== undefined && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs text-gray-600">
                        {badge.progress}/{badge.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-700">Achievement</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-700">Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-700">Quality</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-700">Community</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-700">Milestone</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileBadgesComponent;
