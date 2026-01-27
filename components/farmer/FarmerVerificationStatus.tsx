'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  Award, 
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  Building,
  Leaf
} from 'lucide-react';

export interface VerificationItem {
  id: string;
  type: 'identity' | 'farm' | 'certification' | 'contact' | 'business';
  label: string;
  status: 'verified' | 'pending' | 'rejected' | 'not_submitted';
  verifiedDate?: string;
  expiryDate?: string;
  description?: string;
  documents?: string[];
  verifiedBy?: string;
}

export interface FarmerVerificationStatusProps {
  verified: boolean;
  verificationScore?: number; // 0-100
  verificationItems: VerificationItem[];
  certifications?: {
    id: string;
    name: string;
    issuer: string;
    issuedDate: string;
    expiryDate?: string;
    status: 'active' | 'expired' | 'pending';
    certificateUrl?: string;
  }[];
  onRequestVerification?: (type: string) => void;
  onViewCertificate?: (certificateId: string) => void;
  className?: string;
}

export const FarmerVerificationStatus = React.forwardRef<HTMLDivElement, FarmerVerificationStatusProps>(
  ({ 
    verified,
    verificationScore = 0,
    verificationItems,
    certifications = [],
    onRequestVerification,
    onViewCertificate,
    className,
    ...props 
  }, ref) => {
    
    const getStatusIcon = (status: VerificationItem['status']) => {
      switch (status) {
        case 'verified':
          return <CheckCircle className="w-4 h-4 text-growth-success" />;
        case 'pending':
          return <Clock className="w-4 h-4 text-caution-yellow" />;
        case 'rejected':
          return <XCircle className="w-4 h-4 text-alert-red" />;
        case 'not_submitted':
          return <AlertTriangle className="w-4 h-4 text-gray-400" />;
        default:
          return <AlertTriangle className="w-4 h-4 text-gray-400" />;
      }
    };

    const getStatusBadge = (status: VerificationItem['status']) => {
      switch (status) {
        case 'verified':
          return <Badge variant="success" size="sm">Verified</Badge>;
        case 'pending':
          return <Badge variant="warning" size="sm">Pending</Badge>;
        case 'rejected':
          return <Badge variant="destructive" size="sm">Rejected</Badge>;
        case 'not_submitted':
          return <Badge variant="secondary" size="sm">Not Submitted</Badge>;
        default:
          return <Badge variant="secondary" size="sm">Unknown</Badge>;
      }
    };

    const getTypeIcon = (type: VerificationItem['type']) => {
      switch (type) {
        case 'identity':
          return <User className="w-5 h-5" />;
        case 'farm':
          return <MapPin className="w-5 h-5" />;
        case 'certification':
          return <Award className="w-5 h-5" />;
        case 'contact':
          return <Phone className="w-5 h-5" />;
        case 'business':
          return <Building className="w-5 h-5" />;
        default:
          return <FileText className="w-5 h-5" />;
      }
    };

    const getCertificationStatusBadge = (status: 'active' | 'expired' | 'pending') => {
      switch (status) {
        case 'active':
          return <Badge variant="success" size="sm">Active</Badge>;
        case 'expired':
          return <Badge variant="destructive" size="sm">Expired</Badge>;
        case 'pending':
          return <Badge variant="warning" size="sm">Pending</Badge>;
        default:
          return <Badge variant="secondary" size="sm">Unknown</Badge>;
      }
    };

    const verifiedCount = verificationItems.filter(item => item.status === 'verified').length;
    const totalItems = verificationItems.length;
    const completionPercentage = totalItems > 0 ? (verifiedCount / totalItems) * 100 : 0;

    return (
      <div ref={ref} className={cn('space-y-6', className)} {...props}>
        {/* Overall Verification Status */}
        <Card className="agricultural-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {verified ? (
                <ShieldCheck className="w-6 h-6 text-growth-success" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-caution-yellow" />
              )}
              Verification Status
              {verified && (
                <Badge variant="success" className="ml-auto">
                  Verified Farmer
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Verification Progress</span>
                  <span>{Math.round(completionPercentage)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-agricultural-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Verification score */}
              {verificationScore > 0 && (
                <div className="flex items-center justify-between p-3 bg-agricultural-primary/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-agricultural-primary" />
                    <span className="font-medium">Trust Score</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-agricultural-primary">
                      {verificationScore}
                    </div>
                    <div className="text-xs text-muted-foreground">out of 100</div>
                  </div>
                </div>
              )}

              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-growth-success">{verifiedCount}</div>
                  <div className="text-sm text-muted-foreground">Verified</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-caution-yellow">
                    {verificationItems.filter(item => item.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-alert-red">
                    {verificationItems.filter(item => item.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Items */}
        <Card className="agricultural-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-agricultural-primary" />
              Verification Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verificationItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-medium">{item.label}</h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        )}
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status.replace('_', ' ')}</span>
                      </div>
                      
                      {item.verifiedDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Verified {new Date(item.verifiedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {item.expiryDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Expires {new Date(item.expiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    {item.verifiedBy && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Verified by {item.verifiedBy}
                      </p>
                    )}
                    
                    {item.status === 'not_submitted' && onRequestVerification && (
                      <button
                        onClick={() => onRequestVerification(item.type)}
                        className="mt-2 text-sm text-agricultural-primary hover:text-agricultural-primary-light font-medium"
                      >
                        Submit for verification →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        {certifications.length > 0 && (
          <Card className="agricultural-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-harvest-gold" />
                Certifications & Awards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex-shrink-0 p-2 bg-harvest-gold/10 rounded-lg">
                      <Leaf className="w-5 h-5 text-harvest-gold" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-medium">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">Issued by {cert.issuer}</p>
                        </div>
                        {getCertificationStatusBadge(cert.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Issued {new Date(cert.issuedDate).toLocaleDateString()}</span>
                        </div>
                        
                        {cert.expiryDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {cert.status === 'expired' ? 'Expired' : 'Expires'} {' '}
                              {new Date(cert.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {cert.certificateUrl && onViewCertificate && (
                        <button
                          onClick={() => onViewCertificate(cert.id)}
                          className="mt-2 text-sm text-agricultural-primary hover:text-agricultural-primary-light font-medium"
                        >
                          View Certificate →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
);

FarmerVerificationStatus.displayName = 'FarmerVerificationStatus';