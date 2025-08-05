import { TrackingStatus } from './trackshipApi';

class NetlifyApiService {
  private baseUrl: string;

  constructor() {
    // Use the current domain for Netlify functions
    this.baseUrl = window.location.origin;
  }

  async getTrackingStatus(trackingNumber: string, orderId?: string, postalCode?: string): Promise<TrackingStatus> {
    try {
      console.log('Making Netlify API request for:', trackingNumber);
      
      const response = await fetch(`${this.baseUrl}/.netlify/functions/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingNumber,
          orderId: orderId || `order_${Date.now()}`,
          postalCode: postalCode || '00000'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Netlify API response:', data);

      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      return data.data;
    } catch (error) {
      console.error('Netlify API request failed:', error);
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

export const netlifyApiService = new NetlifyApiService(); 