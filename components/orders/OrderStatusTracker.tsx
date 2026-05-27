'use client';

import React from 'react';
import { CheckCircle, Clock, Truck, Package, XCircle, AlertCircle, DollarSign } from 'lucide-react';
import { OrderStatus } from '@/types';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';

interface OrderStatusTrackerProps {
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  className?: string;
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  orderStatus,
  createdAt,
  updatedAt,
  className,
}) => {
  const { t } = useI18n();
  const getStatusSteps = () => {
    const baseSteps = [
      {
        id: 'pending',
        labelKey: 'orderStatus.tracker.orderPlaced.label',
        descriptionKey: 'orderStatus.tracker.orderPlaced.description',
        icon: Clock,
        status: 'completed' as const,
        timestamp: createdAt,
      },
    ];

    if (orderStatus === OrderStatus.CANCELLED) {
      return [
        ...baseSteps,
        {
          id: 'cancelled',
          labelKey: 'orderStatus.tracker.cancelled.label',
          descriptionKey: 'orderStatus.tracker.cancelled.description',
          icon: XCircle,
          status: 'error' as const,
          timestamp: updatedAt,
        },
      ];
    }

    const isBeyondPayment = ![OrderStatus.PENDING].includes(orderStatus);
    const isPaymentActive = orderStatus === OrderStatus.PENDING

    const activeSteps = [
      ...baseSteps,
      {
        id: 'payment',
        labelKey: 'orderStatus.tracker.paymentPending.label',
        descriptionKey: 'orderStatus.tracker.paymentPending.description',
        icon: DollarSign,
        status: isBeyondPayment ? 'completed' : isPaymentActive ? 'active' : 'pending' as const,
        timestamp: isBeyondPayment ? updatedAt : undefined,
      },
      {
        id: 'confirmed',
        labelKey: 'orderStatus.tracker.orderConfirmed.label',
        descriptionKey: 'orderStatus.tracker.orderConfirmed.description',
        icon: CheckCircle,
        status: orderStatus === OrderStatus.CONFIRMED || orderStatus === OrderStatus.COMPLETED ? 'completed' : 'pending' as const,
        timestamp: orderStatus === OrderStatus.CONFIRMED || orderStatus === OrderStatus.COMPLETED ? updatedAt : undefined,
      },
    ];

    // Simple completion step for orders without delivery tracking
    if (orderStatus === OrderStatus.COMPLETED) {
      activeSteps.push({
        id: 'completed',
        labelKey: 'orderStatus.tracker.completed.label',
        descriptionKey: 'orderStatus.tracker.completed.description',
        icon: CheckCircle,
        status: 'completed' as const,
        timestamp: updatedAt,
      });
    }

    return activeSteps;
  };

  const steps = getStatusSteps();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'active':
        return 'text-info bg-info/10';
      case 'error':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getConnectorColor = (currentStatus: string, nextStatus?: string) => {
    if (currentStatus === 'completed') {
      return nextStatus === 'completed' || nextStatus === 'active' ? 'bg-success/30' : 'bg-border';
    }
    if (currentStatus === 'active') {
      return 'bg-info/30';
    }
    if (currentStatus === 'error') {
      return 'bg-destructive/30';
    }
    return 'bg-border';
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return timestamp;
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flow-root">
        <ul className="-mb-8">
          {steps.map((step, stepIdx) => (
            <li key={step.id}>
              <div className="relative pb-8">
                {stepIdx !== steps.length - 1 ? (
                  <span
                    className={cn(
                      'absolute top-4 left-4 -ml-px h-full w-0.5',
                      getConnectorColor(step.status, steps[stepIdx + 1]?.status)
                    )}
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                        getStatusColor(step.status)
                      )}
                    >
                      <step.icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className={cn(
                        'text-sm font-medium',
                        step.status === 'completed' ? 'text-foreground' :
                          step.status === 'active' ? 'text-info' :
                            step.status === 'error' ? 'text-destructive' : 'text-muted-foreground'
                      )}>
                        {t(step.labelKey)}
                      </p>
                      <p className="text-sm text-muted-foreground">{t(step.descriptionKey)}</p>
                    </div>
                    {step.timestamp && (
                      <div className="whitespace-nowrap text-right text-sm text-muted-foreground">
                        <time dateTime={step.timestamp}>
                          {formatTimestamp(step.timestamp)}
                        </time>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Overall Status Badge */}
      <div className="mt-6 flex items-center justify-between p-4 bg-card rounded-lg">
        <div className="flex items-center space-x-2">
          <div className={cn(
            'w-3 h-3 rounded-full',
            orderStatus === OrderStatus.COMPLETED ? 'bg-success' :
              orderStatus === OrderStatus.CONFIRMED ? 'bg-info' :
                orderStatus === OrderStatus.CANCELLED ? 'bg-destructive' : 'bg-warning'
          )} />
          <span className="text-sm font-medium text-foreground">
            {t('orderStatus.tracker.currentStatus', { status: orderStatus.replace('_', ' ') })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusTracker;