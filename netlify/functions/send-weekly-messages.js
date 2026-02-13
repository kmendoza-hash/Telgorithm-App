const Airtable = require('airtable');
const axios = require('axios');

// Curated list of astrophysics facts (you can expand this!)
const astrophysicsFacts = [
  "Did you know? The light from some stars takes so long to reach us that we're literally looking back in time. When you gaze at Andromeda, you see it as it was 2.5 million years ago! 🌟",
  
  "A black hole's event horizon is the point of no return. Once you cross it, not even light can escape. It's like a cosmic trapdoor to the unknown! 🕳️✨",
  
  "Neutron stars are so dense that a teaspoon of their material would weigh about 6 billion tons on Earth. That's like compressing Mount Everest into a sugar cube! ⛰️→🧊",
  
  "The cosmic microwave background radiation is the afterglow of the Big Bang, filling the entire universe. It's like the baby picture of our cosmos, taken just 380,000 years after birth! 📸🌌",
  
  "There are more stars in the universe than grains of sand on all the beaches on Earth. We're part of something truly magnificent! 🏖️<⭐",
  
  "If you could put Saturn in a giant bathtub, it would float! It's the only planet in our solar system less dense than water. 🪐🛁",
  
  "Time moves slower in stronger gravitational fields. An astronaut on the ISS ages slightly slower than people on Earth. It's time travel, just really, really slowly! ⏰🚀",
  
  "The Sun converts 4 million tons of matter into pure energy every second through nuclear fusion. That's the power source for all life on Earth! ☀️⚡",
  
  "Voyager 1, launched in 1977, is now in interstellar space over 15 billion miles away, and we can still communicate with it. Humanity's farthest messenger! 📡🌠",
  
  "A day on Venus is longer than its year. It takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun! 🌅🔄",
];

exports.handler = async (event, context) => {
  // Verify the request is authorized (using a secret token)
  const authHeader = event.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    // Initialize Airtable
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    // Get all active subscribers
    const subscribers = await base('Subscribers')
      .select({
        filterByFormula: '{Active} = TRUE()',
      })
      .all();

    if (subscribers.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No active subscribers' }),
      };
    }

    // Select a random fact for this week
    const fact = astrophysicsFacts[Math.floor(Math.random() * astrophysicsFacts.length)];

    // Telgorithm API endpoint
    const telgorithmApiUrl = 'https://api.telgorithm.com/messaging/messages';

    // Send SMS to all subscribers using Telgorithm
    const results = await Promise.allSettled(
      subscribers.map(async (subscriber) => {
        const phone = subscriber.fields.Phone;
        const name = subscriber.fields.Name;
        
        const message = `Hi ${name}! 🌌\n\n${fact}\n\n- Cosmic Texts\n\nReply STOP to unsubscribe`;

        // Telgorithm API request
        // Based on OpenAPI standard REST interface
        return axios.post(
          telgorithmApiUrl,
          {
            to: phone,
            from: process.env.TELGORITHM_PHONE_NUMBER,
            text: message,
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.TELGORITHM_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
      })
    );

    // Count successes and failures
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Log any failures for debugging
    const failures = results
      .filter(r => r.status === 'rejected')
      .map(r => r.reason?.response?.data || r.reason?.message);
    
    if (failures.length > 0) {
      console.error('Failed messages:', JSON.stringify(failures, null, 2));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Messages sent to ${successful} subscribers. ${failed} failed.`,
        fact: fact,
        failures: failed > 0 ? failures : undefined,
      }),
    };
  } catch (error) {
    console.error('Error sending messages:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send messages',
        details: error.message,
      }),
    };
  }
};
