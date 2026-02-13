const Airtable = require('airtable');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { name, phone } = JSON.parse(event.body);

    // Validate input
    if (!name || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name and phone number are required' }),
      };
    }

    // Basic phone number validation (should start with + and contain digits)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Invalid phone number format. Please include country code (e.g., +1 555-123-4567)' 
        }),
      };
    }

    // Initialize Airtable
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    // Check if phone number already exists
    const existingRecords = await base('Subscribers')
      .select({
        filterByFormula: `{Phone} = '${phone.replace(/'/g, "\\'")}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (existingRecords.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'This phone number is already subscribed! 🌟' 
        }),
      };
    }

    // Create new subscriber record
    await base('Subscribers').create([
      {
        fields: {
          Name: name,
          Phone: phone,
          'Subscribed Date': new Date().toISOString(),
          Active: true,
        },
      },
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Success! You\'re subscribed to weekly cosmic texts! 🚀' 
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process subscription. Please try again.' 
      }),
    };
  }
};
