'use client';

import React, { useEffect, useState } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Wifi, WifiOff, RefreshCw, Home, MessageCircle } from 'lucide-react';

export default function OfflinePage() {
  const { isOnline, isSlowConnection, effectiveType } = useNetworkStatus();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Redirect to home if back online
    if (isOnline && !isSlowConnection) {
      window.location.href = '/';
    }
  }, [isOnline, isSlowConnection]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Wait a bit before checking connection
    setTimeout(() => {
      setIsRetrying(false);
      if (navigator.onLine) {
        window.location.reload();
      }
    }, 2000);
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const getConnectionMessage = () => {
    if (!isOnline) {
      return {
        title: "You're Currently Offline",
        description: "Please check your internet connection and try again. Some cached content may still be available.",
        icon: <WifiOff className="w-16 h-16 text-red-400 mx-auto mb-4" />,
        color: "red"
      };
    } else if (isSlowConnection) {
      return {
        title: "Slow Connection Detected",
        description: `Your connection (${effectiveType}) may not support all features. We've optimized the experience for your network.`,
        icon: <Wifi className="w-16 h-16 text-yellow-400 mx-auto mb-4" />,
        color: "yellow"
      };
    } else {
      return {
        title: "Connection Issues",
        description: "We're having trouble connecting to our servers. Please try again in a moment.",
        icon: <WifiOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
        color: "gray"
      };
    }
  };

  const connectionInfo = getConnectionMessage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Agricultural Logo/Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-agricultural-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">🌾</span>
          </div>
          <h1 className="text-2xl font-bold text-agricultural-primary">UmuhinziLink</h1>
        </div>

        {/* Connection Status */}
        {connectionInfo.icon}
        
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          {connectionInfo.title}
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {connectionInfo.description}
        </p>

        {/* Connection Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Status:</span>
            <span className={`font-medium ${
              isOnline ? 'text-green-600' : 'text-red-600'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          
          {effectiveType && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-500">Connection:</span>
              <span className="font-medium text-gray-700 uppercase">
                {effectiveType}
              </span>
            </div>
          )}
          
          {retryCount > 0 && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-500">Retry attempts:</span>
              <span className="font-medium text-gray-700">
                {retryCount}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full bg-agricultural-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-agricultural-primary-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Checking Connection...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </>
            )}
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </button>
        </div>

        {/* Offline Features */}
        {!isOnline && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Available Offline:
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Cached product listings
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Saved farmer profiles
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Previous search results
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                Limited messaging (queued)
              </div>
            </div>
          </div>
        )}

        {/* Tips for Rural Users */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <details className="text-left">
            <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-agricultural-primary">
              Tips for Better Connectivity
            </summary>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p>• Move to a location with better signal strength</p>
              <p>• Try switching between mobile data and Wi-Fi</p>
              <p>• Close other apps that might be using data</p>
              <p>• Wait for peak hours to pass if network is congested</p>
              <p>• Some features work offline and will sync when connected</p>
            </div>
          </details>
        </div>

        {/* Emergency Contact */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">
            Need immediate assistance?
          </p>
          <a 
            href="tel:+250123456789" 
            className="inline-flex items-center text-sm text-agricultural-primary hover:text-agricultural-primary-light"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Call Support: +250 123 456 789
          </a>
        </div>
      </div>
    </div>
  );
}