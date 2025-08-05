import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Clock, MapPin, Truck } from 'lucide-react';
import { TrackingStatus } from '../services/trackshipApi';

interface TrackingStatusProps {
  trackingNumber: string;
  currentStatus: 'pending' | 'shipped' | 'delivered';
  onStatusUpdate: (status: 'pending' | 'shipped' | 'delivered') => void;
  onEstimatedDeliveryUpdate?: (date: string) => void;
}

const TrackingStatusComponent: React.FC<TrackingStatusProps> = ({
  trackingNumber,
  currentStatus,
  onStatusUpdate,
  onEstimatedDeliveryUpdate,
}) => {
  const [trackingData, setTrackingData] = useState<TrackingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchTrackingStatus = useCallback(async () => {
    if (!trackingNumber) return;

    console.log('Fetching tracking status for:', trackingNumber);
    setIsLoading(true);
    setError(null);

    try {
      // Import the tracking service (mock or real based on environment)
      const { getTrackingService } = await import('../services/trackshipApi');
      
      console.log('Getting tracking service...');
      const trackingService = getTrackingService();
      console.log('Tracking service obtained, making API call...');
      
      const status = await trackingService.getTrackingStatus(trackingNumber);
      console.log('API call completed, status:', status);
      setTrackingData(status);
      setLastUpdated(new Date());
      
      // Update parent component with new status
      onStatusUpdate(status.status);
      
      if (status.estimatedDelivery && onEstimatedDeliveryUpdate) {
        onEstimatedDeliveryUpdate(status.estimatedDelivery);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tracking status');
    } finally {
      setIsLoading(false);
    }
  }, [trackingNumber, onStatusUpdate, onEstimatedDeliveryUpdate]);

  useEffect(() => {
    if (trackingNumber && !isInitialized) {
      // Only fetch on initial load
      fetchTrackingStatus();
      setIsInitialized(true);
    }
  }, [trackingNumber, fetchTrackingStatus, isInitialized]);

  const getStatusIcon = (status: 'pending' | 'shipped' | 'delivered') => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-success-600" />;
      case 'shipped':
        return <Clock className="w-4 h-4 text-primary-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-warning-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: 'pending' | 'shipped' | 'delivered') => {
    switch (status) {
      case 'delivered':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'shipped':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'pending':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!trackingNumber) {
    return (
      <div className="text-sm text-gray-500">
        No tracking number available
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span>Updating tracking...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>Tracking unavailable</span>
        </div>
        <button
          onClick={fetchTrackingStatus}
          className="text-xs text-primary-600 hover:text-primary-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="text-sm text-gray-500">
        Loading tracking information...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon(trackingData.status)}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(trackingData.status)}`}>
            {trackingData.statusDescription}
          </span>
        </div>
        
        <button
          onClick={fetchTrackingStatus}
          disabled={isLoading}
          className="text-xs text-primary-600 hover:text-primary-700 transition-colors duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Store Setup Warning */}
      {(trackingData as any).error === 'missing_store' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
          <div className="flex items-center space-x-1 text-xs text-yellow-800">
            <AlertCircle className="w-3 h-3" />
            <span className="font-medium">Store setup required</span>
          </div>
          <div className="text-xs text-yellow-700 mt-1">
            Configure your store in Trackship to get real tracking data
          </div>
        </div>
      )}

      {/* Tracking Details */}
      <div className="text-xs text-gray-600 space-y-1">
        {trackingData.carrier && (
          <div className="flex items-center space-x-1">
            <Truck className="w-3 h-3" />
            <span className="font-medium">{trackingData.carrier}</span>
          </div>
        )}
        
        {trackingData.currentLocation && (
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>{trackingData.currentLocation}</span>
          </div>
        )}
        
        {trackingData.lastActivity && (
          <div>
            Last activity: {new Date(trackingData.lastActivity).toLocaleString()}
          </div>
        )}
        
        {trackingData.estimatedDelivery && (
          <div>
            Est. delivery: {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
          </div>
        )}
        
        {lastUpdated && (
          <div className="text-gray-400">
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingStatusComponent; 