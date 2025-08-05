// Trackship API Service for multi-carrier tracking
// Sign up at https://trackship.com/ for API access

export interface TrackingStatus {
  trackingNumber: string;
  status: 'pending' | 'shipped' | 'delivered';
  lastActivity: string;
  estimatedDelivery?: string;
  currentLocation?: string;
  statusDescription: string;
  carrier?: string;
}

export interface TrackshipCreateResponse {
  status: string;
  status_msg: string;
  trackers_balance: string;
  user_plan: string;
}

export interface TrackshipTrackingResponse {
  status: string;
  status_msg: string;
  data?: {
    tracking_number: string;
    carrier: string;
    status: string;
    status_description: string;
    estimated_delivery?: string;
    events: Array<{
      status: string;
      status_description: string;
      location?: string;
      timestamp: string;
    }>;
  };
}

class TrackshipApiService {
  private baseUrl = 'https://api.trackship.com/v1';
  private apiKey: string;
  private appName: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_TRACKSHIP_API_KEY || '';
    this.appName = process.env.REACT_APP_TRACKSHIP_APP_NAME || 'Workspace Shipping Dashboard';
    console.log('Trackship API Key configured:', this.apiKey ? 'Yes' : 'No');
    console.log('App Name:', this.appName);
  }

  private detectCarrier(trackingNumber: string): string {
    // Simple carrier detection based on tracking number format
    if (trackingNumber.startsWith('1Z')) return 'ups';
    if (trackingNumber.startsWith('940') || trackingNumber.startsWith('93')) return 'usps';
    if (trackingNumber.startsWith('DHL') || trackingNumber.length === 10) return 'dhl';
    if (trackingNumber.length === 12) return 'fedex';
    return 'ups'; // Default to UPS
  }

  private async createShipment(trackingNumber: string, orderId: string, postalCode?: string): Promise<TrackshipCreateResponse> {
    if (!this.apiKey) {
      throw new Error('Trackship API key not configured');
    }

    console.log('Creating shipment for:', trackingNumber);
    console.log('API Key:', this.apiKey.substring(0, 10) + '...');

    try {
      const requestBody = {
        tracking_number: trackingNumber,
        tracking_provider: this.detectCarrier(trackingNumber),
        order_id: orderId,
        postal_code: postalCode || '00000',
        destination_country: 'US',
        app_name: this.appName
      };

      console.log('Request body:', requestBody);
      console.log('Request URL:', `${this.baseUrl}/shipment/create/`);

      const response = await fetch(`${this.baseUrl}/shipment/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'trackship-api-key': this.apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Trackship API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      return data as TrackshipCreateResponse;
    } catch (error) {
      console.error('Trackship API request failed:', error);
      throw error;
    }
  }

  private parseStatus(status: string, description: string): 'pending' | 'shipped' | 'delivered' {
    const lowerStatus = status.toLowerCase();
    const lowerDescription = description.toLowerCase();
    
    if (lowerStatus.includes('delivered') || lowerDescription.includes('delivered')) {
      return 'delivered';
    } else if (
      lowerStatus.includes('in_transit') || 
      lowerStatus.includes('picked_up') || 
      lowerDescription.includes('in transit') ||
      lowerDescription.includes('picked up')
    ) {
      return 'shipped';
    } else {
      return 'pending';
    }
  }

  async getTrackingStatus(trackingNumber: string, orderId?: string, postalCode?: string): Promise<TrackingStatus> {
    try {
      console.log('Getting tracking status for:', trackingNumber);
      
      // First, create the shipment in Trackship
      const orderIdToUse = orderId || `order_${Date.now()}`;
      const createResponse = await this.createShipment(trackingNumber, orderIdToUse, postalCode);
      
      console.log('Shipment creation response:', createResponse);
      
      if (createResponse.status !== 'ok') {
        throw new Error(`Failed to create shipment: ${createResponse.status_msg}`);
      }

      // For now, return mock data since we need to implement the tracking retrieval
      // In a real implementation, you would make another API call to get the tracking details
      const carrier = this.detectCarrier(trackingNumber);
      const status = 'shipped'; // Mock status
      
             const result = {
         trackingNumber,
         status: status as 'pending' | 'shipped' | 'delivered',
         lastActivity: new Date().toISOString(),
         estimatedDelivery: '2024-01-20',
         currentLocation: 'Distribution Center',
         statusDescription: 'Package in transit',
         carrier: carrier.toUpperCase(),
       };

      console.log('Parsed tracking result:', result);
      return result;
    } catch (error) {
      console.error('Failed to get tracking status:', error);
      throw error;
    }
  }

  // Batch tracking for multiple orders
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

// Create singleton instance
export const trackshipApiService = new TrackshipApiService();

// Mock service for development (when Trackship API credentials aren't available)
export class MockTrackshipApiService {
  async getTrackingStatus(trackingNumber: string): Promise<TrackingStatus> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock different statuses and carriers based on tracking number
    const mockData: Record<string, { status: 'pending' | 'shipped' | 'delivered', carrier: string }> = {
      'UPS123456789': { status: 'pending', carrier: 'UPS' },
      'FEDEX987654321': { status: 'shipped', carrier: 'FedEx' },
      'USPS555666777': { status: 'delivered', carrier: 'USPS' },
      'DHL888999000': { status: 'shipped', carrier: 'DHL' },
      '1Z999AA1234567890': { status: 'shipped', carrier: 'UPS' },
      '9400100000000000000000': { status: 'delivered', carrier: 'USPS' },
    };

    const mockInfo = mockData[trackingNumber] || { status: 'pending', carrier: 'Unknown' };
    
    const statusDescriptions = {
      pending: 'Package information sent to carrier',
      shipped: 'Package in transit',
      delivered: 'Package delivered successfully',
    };

    return {
      trackingNumber,
      status: mockInfo.status,
      lastActivity: new Date().toISOString(),
      estimatedDelivery: mockInfo.status === 'pending' ? '2024-01-20' : undefined,
      currentLocation: mockInfo.status === 'shipped' ? 'Distribution Center' : undefined,
      statusDescription: statusDescriptions[mockInfo.status],
      carrier: mockInfo.carrier,
    };
  }

  async getBatchTrackingStatus(trackingNumbers: string[]): Promise<TrackingStatus[]> {
    const promises = trackingNumbers.map(trackingNumber => 
      this.getTrackingStatus(trackingNumber)
    );
    return Promise.all(promises);
  }
}

export const mockTrackshipApiService = new MockTrackshipApiService();

// Helper function to get the appropriate service based on environment
export const getTrackingService = () => {
  const useRealApi = process.env.REACT_APP_USE_REAL_TRACKSHIP_API === 'true';
  const hasCredentials = process.env.REACT_APP_TRACKSHIP_API_KEY;
  const useProxy = process.env.REACT_APP_USE_PROXY_API === 'true';
  
  console.log('Environment check:', {
    useRealApi,
    hasCredentials: !!hasCredentials,
    useProxy,
    apiKey: hasCredentials ? hasCredentials.substring(0, 10) + '...' : 'None'
  });
  
  if (useProxy) {
    console.log('Using proxy API service');
    const { proxyApiService } = require('./proxyApi');
    return proxyApiService;
  }
  
  if (useRealApi && hasCredentials) {
    console.log('Using real Trackship API (may have CORS issues)');
    return trackshipApiService;
  }
  
  console.log('Using mock Trackship API');
  return mockTrackshipApiService;
}; 