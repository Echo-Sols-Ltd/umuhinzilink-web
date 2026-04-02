'use client';

import React from 'react';
import { NegotiationStatus } from '@/types';
import { Check, Clock, TrendingUp, AlertCircle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NegotiationProgressIndicatorProps {
  currentStatus: NegotiationStatus;
  isExpired?: boolean;
  compact?: boolean;
  className?: string;
}

interface ProgressStep {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  completed: boolean;
  active: boolean;
  description?: string;
}

export const NegotiationProgressIndicator: React.FC<NegotiationProgressIndicatorProps> = ({
  currentStatus,
  isExpired = false,
  compact = false,
  className
}) => {
  const effectiveStatus = isExpired ? NegotiationStatus.EXPIRED : currentStatus;

  const getProgressSteps = (): ProgressStep[] => {
    const baseSteps: ProgressStep[] = [
      {
        key: 'proposal',
        label: 'Proposal Sent',
        icon: Package,
        completed: true,
        active: false,
        description: 'Buyer sent price proposal'
      },
      {
        key: 'pending',
        label: 'Seller Review',
        icon: Clock,
        completed: false,
        active: effectiveStatus === NegotiationStatus.PENDING,
        description: 'Waiting for seller response'
      },
      {
        key: 'negotiation',
        label: 'Negotiation',
        icon: TrendingUp,
        completed: false,
        active: effectiveStatus === NegotiationStatus.COUNTERED,
        description: 'Price negotiation in progress'
      },
      {
        key: 'agreement',
        label: 'Price Agreed',
        icon: Check,
        completed: effectiveStatus === NegotiationStatus.ACCEPTED,
        active: effectiveStatus === NegotiationStatus.ACCEPTED,
        description: 'Price agreed - ready for checkout'
      }
    ];

    // Update completion based on current status
    if (effectiveStatus === NegotiationStatus.COUNTERED) {
      baseSteps[1].completed = true;
      baseSteps[2].completed = false;
    } else if (effectiveStatus === NegotiationStatus.ACCEPTED) {
      baseSteps[1].completed = true;
      baseSteps[2].completed = true;
      baseSteps[3].completed = true;
    }

    // Handle rejected/expired
    if (effectiveStatus === NegotiationStatus.REJECTED || effectiveStatus === NegotiationStatus.EXPIRED) {
      const lastCompletedIndex = effectiveStatus === NegotiationStatus.REJECTED ? 1 : 1;
      baseSteps.forEach((step, index) => {
        step.completed = index <= lastCompletedIndex;
        step.active = false;
      });
      
      // Add final step for rejected/expired
      baseSteps.push({
        key: effectiveStatus.toLowerCase(),
        label: effectiveStatus === NegotiationStatus.REJECTED ? 'Declined' : 'Expired',
        icon: AlertCircle,
        completed: true,
        active: true,
        description: effectiveStatus === NegotiationStatus.REJECTED 
          ? 'Negotiation was declined' 
          : 'Time limit expired'
      });
    }

    return baseSteps;
  };

  const steps = getProgressSteps();

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.key}>
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors',
                step.completed 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-muted border-border text-muted-foreground',
                step.active && 'ring-2 ring-primary/20'
              )}>
                <Icon size={12} />
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-0.5 transition-colors',
                  step.completed ? 'bg-primary' : 'bg-border'
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Negotiation Progress</h3>
        <span className="text-xs text-muted-foreground">
          {steps.filter(s => s.completed).length} of {steps.length} steps
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.key} className="flex items-start gap-3">
              {/* Step Icon */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shrink-0',
                step.completed 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-muted border-border text-muted-foreground',
                step.active && 'ring-2 ring-primary/20 scale-110'
              )}>
                <Icon size={16} />
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    'text-sm font-medium',
                    step.completed ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {step.label}
                  </p>
                  {step.completed && (
                    <Check size={14} className="text-green-600" />
                  )}
                </div>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className={cn(
                  'absolute left-4 w-0.5 transition-colors',
                  step.completed ? 'bg-primary' : 'bg-border'
                )} style={{ marginTop: '32px', height: '24px' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
