const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

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

    let responseData = {
      trackingNumber,
      status: 'pending',
      lastActivity: new Date().toISOString(),
      estimatedDelivery: null,
      currentLocation: 'Unknown',
      statusDescription: 'Tracking data unavailable',
      carrier: detectCarrier(trackingNumber).toUpperCase(),
      trackshipResponse: data
    };

    if (data.status === 'error' && data.status_msg === 'missing_store') {
      responseData.statusDescription = 'Store setup required in Trackship';
      responseData.currentLocation = 'Store not configured';
      responseData.error = 'missing_store';
    } else if (data.status === 'success' && data.data) {
      const trackingData = data.data;
      responseData.status = trackingData.status || 'pending';
      responseData.lastActivity = trackingData.last_activity || new Date().toISOString();
      responseData.estimatedDelivery = trackingData.estimated_delivery || null;
      responseData.currentLocation = trackingData.current_location || 'Unknown';
      responseData.statusDescription = trackingData.status_description || 'Tracking available';
      responseData.carrier = trackingData.carrier || detectCarrier(trackingNumber).toUpperCase();
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: responseData
      })
    };
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