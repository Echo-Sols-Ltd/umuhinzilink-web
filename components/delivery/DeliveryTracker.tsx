import React, { useState } from 'react';
import { DeliveryStep, Delivery } from '@/types/order';
import { DeliveryStatus } from '@/types/enums';
import { Check, Clock, Truck, Package, AlertCircle, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types/enums';

interface DeliveryTrackerProps {
  delivery: Delivery | undefined;
  onUpdateStatus: (newStatus: DeliveryStatus) => void;
  isLoading?: boolean;
}

const DELIVERY_STEPS = [
  {
    status: DeliveryStatus.PENDING,
    label: 'Order Received',
    description: 'Order has been received and is being processed',
    icon: Package,
    color: 'text-gray-500',
    completedColor: 'text-green-500'
  },
  {
    status: DeliveryStatus.SCHEDULED,
    label: 'Preparing Order',
    description: 'Order is being prepared for delivery',
    icon: Package,
    color: 'text-blue-500',
    completedColor: 'text-green-500'
  },
  {
    status: DeliveryStatus.IN_TRANSIT,
    label: 'In Transit',
    description: 'Order is on the way to delivery location',
    icon: Truck,
    color: 'text-orange-500',
    completedColor: 'text-green-500'
  },
  {
    status: DeliveryStatus.DELIVERED,
    label: 'Delivered',
    description: 'Order has been successfully delivered',
    icon: Check,
    color: 'text-green-500',
    completedColor: 'text-green-500'
  }
];

const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  [DeliveryStatus.PENDING]: 'Pending',
  [DeliveryStatus.SCHEDULED]: 'Preparing',
  [DeliveryStatus.IN_TRANSIT]: 'In Transit',
  [DeliveryStatus.DELIVERED]: 'Delivered',
  [DeliveryStatus.FAILED]: 'Failed'
};

const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, string> = {
  [DeliveryStatus.PENDING]: 'bg-gray-100 text-gray-700',
  [DeliveryStatus.SCHEDULED]: 'bg-blue-100 text-blue-700',
  [DeliveryStatus.IN_TRANSIT]: 'bg-orange-100 text-orange-700',
  [DeliveryStatus.DELIVERED]: 'bg-green-100 text-green-700',
  [DeliveryStatus.FAILED]: 'bg-red-100 text-red-700'
};

export default function DeliveryTracker({ delivery, onUpdateStatus, isLoading = false }: DeliveryTrackerProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus | null>(null);
  const { user } = useAuth();

  const canUpdateStatus = user?.role !== UserType.BUYER;

  if (!delivery) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No delivery information available</p>
      </div>
    );
  }

  // Find the current step based on trackingSteps
  const currentStepIndex = delivery.trackingSteps ?
    Math.max(...delivery.trackingSteps.map((step, index) => step.completed ? index : -1)) : -1;

  // Derive current status from the last completed step in trackingSteps
  const currentStatus = delivery.trackingSteps && delivery.trackingSteps.length > 0
    ? delivery.trackingSteps
      .filter(step => step.completed)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0]?.status || DeliveryStatus.PENDING
    : DeliveryStatus.PENDING;

  const handleUpdateStatus = (status: DeliveryStatus) => {
    setSelectedStatus(status);
    setShowUpdateModal(true);
  };

  const confirmUpdateStatus = () => {
    if (selectedStatus) {
      onUpdateStatus(selectedStatus);
      setShowUpdateModal(false);
      setSelectedStatus(null);
    }
  };

  const getNextStatus = () => {
    const currentIndex = DELIVERY_STEPS.findIndex(step => step.status === currentStatus);
    if (currentIndex < DELIVERY_STEPS.length - 1) {
      return DELIVERY_STEPS[currentIndex + 1];
    }
    return null;
  };

  const nextStatus = getNextStatus();

  // Check if a step is completed based on trackingSteps
  const isStepCompleted = (stepStatus: DeliveryStatus) => {
    if (!delivery.trackingSteps) return false;
    const step = delivery.trackingSteps.find(s => s.status === stepStatus);
    return step?.completed || false;
  };

  // Check if a step is currently active (last completed step)
  const isStepActive = (stepStatus: DeliveryStatus, index: number) => {
    return index === currentStepIndex;
  };

  return (
    <div className="space-y-6">
      {/* Current Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${DELIVERY_STATUS_COLORS[currentStatus as DeliveryStatus]}`}>
            {DELIVERY_STATUS_LABELS[currentStatus as DeliveryStatus]}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {delivery.deliveryStartDate && new Date(delivery.deliveryStartDate).toLocaleDateString()}
          </div>
        </div>

        {/* Update Delivery Button */}
        {nextStatus && !isLoading && canUpdateStatus && (
          <button
            onClick={() => handleUpdateStatus(nextStatus.status)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Truck className="w-4 h-4" />
            <span>Update to {nextStatus.label}</span>
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="relative">
        <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-b from-green-500 to-gray-300"></div>
        <div className="space-y-8">
          {DELIVERY_STEPS.map((step, index) => {
            const isCompleted = isStepCompleted(step.status);
            const isCurrent = isStepActive(step.status, index);
            const Icon = step.icon;

            return (
              <div key={step.status} className="relative flex items-start space-x-4">
                <div className={`
                  relative z-10 w-8 h-8 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300'}
                `}>
                  <Icon className={`w-4 h-4 text-white ${isCompleted ? 'text-white' : isCurrent ? 'text-white' : step.color
                    }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-medium ${isCompleted ? 'text-green-600' : isCurrent ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                      {step.label}
                    </h3>
                    {isCompleted && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                    {isCurrent && (
                      <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${isCompleted ? 'text-green-600' : isCurrent ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                    {step.description}
                  </p>

                  {/* Show timestamp for completed steps */}
                  {isCompleted && delivery.trackingSteps && delivery.trackingSteps[index] && (
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      Completed: {new Date(delivery.trackingSteps[index].completedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Timeline */}
      {delivery.trackingSteps && delivery.trackingSteps.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Delivery Timeline</h3>
          <div className="space-y-2">
            {delivery.trackingSteps.map((step, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${step.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  <span className={`${step.completed ? 'text-green-600 font-medium' : 'text-gray-700'
                    }`}>
                    {DELIVERY_STATUS_LABELS[step.status]}
                  </span>
                </div>
                <span className={`${step.completed ? 'text-green-600' : 'text-gray-500'
                  }`}>
                  {new Date(step.completedAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateModal && selectedStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Update Delivery Status
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to update the delivery status to <strong>{DELIVERY_STATUS_LABELS[selectedStatus]}</strong>?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmUpdateStatus}
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Confirm Update'}
              </button>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
