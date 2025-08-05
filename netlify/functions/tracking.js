const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { trackingNumber, orderId, postalCode } = JSON.parse(event.body);
    
    const requestBody = {
      tracking_number: trackingNumber,
      tracking_provider: detectCarrier(trackingNumber),
      order_id: orderId || `order_${Date.now()}`,
      postal_code: postalCode || '00000',
      destination_country: 'US',
      app_name: 'Workspace Shipping Dashboard',
      store_id: process.env.TRACKSHIP_STORE_ID || 'test_store_123'
    };

    console.log('Proxying request to Trackship:', requestBody);

    const response = await fetch('https://api.trackship.com/v1/shipment/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'trackship-api-key': process.env.TRACKSHIP_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('Trackship response:', data);

    // Check if Trackship returned an error
    if (data.status === 'error') {
      console.log('Trackship error:', data.status_msg);
      
      // If it's a missing_store error, we need to handle this differently
      if (data.status_msg === 'missing_store') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: {
              trackingNumber,
              status: 'pending',
              lastActivity: new Date().toISOString(),
              estimatedDelivery: null,
              currentLocation: 'Store not configured',
              statusDescription: 'Store setup required in Trackship',
              carrier: detectCarrier(trackingNumber).toUpperCase(),
              trackshipResponse: data,
              error: 'missing_store'
            }
          })
        });
      }
    }

    // If Trackship returned success, try to get actual tracking data
    if (data.status === 'success' && data.data) {
      // Parse the actual tracking data from Trackship
      const trackingData = data.data;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            trackingNumber,
            status: trackingData.status || 'pending',
            lastActivity: trackingData.last_activity || new Date().toISOString(),
            estimatedDelivery: trackingData.estimated_delivery || null,
            currentLocation: trackingData.current_location || 'Unknown',
            statusDescription: trackingData.status_description || 'Tracking available',
            carrier: trackingData.carrier || detectCarrier(trackingNumber).toUpperCase(),
            trackshipResponse: data
          }
        })
      });
    }

    // Fallback to mock data if we can't parse the response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          trackingNumber,
          status: 'pending',
          lastActivity: new Date().toISOString(),
          estimatedDelivery: null,
          currentLocation: 'Unknown',
          statusDescription: 'Tracking data unavailable',
          carrier: detectCarrier(trackingNumber).toUpperCase(),
          trackshipResponse: data
        }
      })
    });
  } catch (error) {
    console.error('Tracking API error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};

function detectCarrier(trackingNumber) {
  if (trackingNumber.startsWith('1Z')) return 'ups';
  if (trackingNumber.startsWith('940') || trackingNumber.startsWith('93')) return 'usps';
  if (trackingNumber.startsWith('DHL') || trackingNumber.length === 10) return 'dhl';
  if (trackingNumber.startsWith('FEDEX') || trackingNumber.length === 12) return 'fedex';
  return 'unknown';
} 