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
    // Parse the webhook data
    const webhookData = JSON.parse(event.body);
    
    console.log('Received webhook from Trackship:', webhookData);
    
    // Here you would typically:
    // 1. Store the webhook data in a database
    // 2. Update your order status
    // 3. Send notifications
    // 4. Trigger other business logic
    
    // For now, we'll just log it
    console.log('Webhook processed successfully');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Webhook received successfully' 
      })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    
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