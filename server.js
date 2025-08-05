const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Trackship API proxy endpoint
app.post('/api/tracking', async (req, res) => {
  try {
    const { trackingNumber, orderId, postalCode } = req.body;
    
    const requestBody = {
      tracking_number: trackingNumber,
      tracking_provider: detectCarrier(trackingNumber),
      order_id: orderId || `order_${Date.now()}`,
      postal_code: postalCode || '00000',
      destination_country: 'US',
      app_name: 'Workspace Shipping Dashboard',
      store_id: process.env.TRACKSHIP_STORE_ID || 'test_store_123' // Add store ID
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

    res.json({
      success: true,
      data: {
        trackingNumber,
        status: 'shipped',
        lastActivity: new Date().toISOString(),
        estimatedDelivery: '2024-01-20',
        currentLocation: 'Distribution Center',
        statusDescription: 'Package in transit',
        carrier: detectCarrier(trackingNumber).toUpperCase(),
        trackshipResponse: data
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Webhook endpoint for Trackship to send tracking updates
app.post('/api/webhook/trackship', (req, res) => {
  try {
    console.log('Received webhook from Trackship:', req.body);
    
    // Process the webhook data
    const webhookData = req.body;
    
    // You can store this data, update your database, or trigger other actions
    // For now, we'll just log it
    console.log('Webhook processed successfully');
    
    // Always respond with 200 OK to acknowledge receipt
    res.status(200).json({ 
      success: true, 
      message: 'Webhook received successfully' 
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Proxy server is running'
  });
});

function detectCarrier(trackingNumber) {
  if (trackingNumber.startsWith('1Z')) return 'ups';
  if (trackingNumber.startsWith('940') || trackingNumber.startsWith('93')) return 'usps';
  if (trackingNumber.startsWith('DHL') || trackingNumber.length === 10) return 'dhl';
  if (trackingNumber.length === 12) return 'fedex';
  return 'ups';
}

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log('Trackship API Key:', process.env.TRACKSHIP_API_KEY ? 'Configured' : 'Not configured');
}); 