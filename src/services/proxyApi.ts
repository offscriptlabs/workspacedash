// Proxy API Service for Trackship tracking
// This service calls our local proxy server to avoid CORS issues

export interface TrackingStatus {
  trackingNumber: string;
  status: 'pending' | 'shipped' | 'delivered';
  lastActivity: string;
  estimatedDelivery?: string;
  currentLocation?: string;
  statusDescription: string;
  carrier?: string;
}

class ProxyApiService {
  private baseUrl = 'http://localhost:3001/api';

  async getTrackingStatus(trackingNumber: string, orderId?: string, postalCode?: string): Promise<TrackingStatus> {
    try {
      console.log('Making proxy API request for:', trackingNumber);

      const response = await fetch(`${this.baseUrl}/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingNumber,
          orderId,
          postalCode,
        }),
      });

      if (!response.ok) {
        throw new Error(`Proxy API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Proxy API response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Failed to get tracking data');
      }

      return data.data;
    } catch (error) {
      console.error('Proxy API request failed:', error);
      throw error;
    }
  }

  async getBatchTrackingStatus(trackingNumbers: string[]): Promise<TrackingStatus[]> {
    const promises = trackingNumbers.map(async (trackingNumber, index) => {
      try {
        return await this.getTrackingStatus(trackingNumber, `batch_${index}`);
      } catch (error) {
        console.error(`Failed to track ${trackingNumber}:`, error);
        return {
          trackingNumber,
          status: 'pending' as const,
          lastActivity: '',
          statusDescription: 'Tracking unavailable',
        };
      }
    });

    return Promise.all(promises);
  }
}

export const proxyApiService = new ProxyApiService(); 