// Netlify Serverless Function as API Proxy
const fetch = require('node-fetch');

// Get environment variables
const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_APP_ID,
  DATABASE_URL,
  OPENAI_API_KEY,
  GEMINI_API_KEY
} = process.env;

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    // Parse the URL path to determine which API endpoint to call
    const path = event.path.replace('/.netlify/functions/api', '');
    
    // Simple response for testing
    if (path === '/status') {
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'online',
          message: 'API is working. This is a serverless function on Netlify.'
        })
      };
    }

    // For other API endpoints, you would need to implement your server-side logic here
    // or proxy to your actual API server if you have one

    return {
      statusCode: 404,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Not found' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server error', message: error.message })
    };
  }
};