export default async function handler(req, res) {
  // Enable CORS for all origins (you can restrict this to your Framer domain later)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    })
  }

  try {
    // Check if API key is configured
    if (!process.env.TICKET_TAILOR_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      })
    }

    // Call Ticket Tailor Overview API using Basic Auth
    const response = await fetch('https://api.tickettailor.com/v1/overview', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.TICKET_TAILOR_API_KEY + ':').toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    // Check if the request was successful
    if (!response.ok) {
      console.error(`Ticket Tailor API error: ${response.status} ${response.statusText}`)
      return res.status(response.status).json({
        success: false,
        error: `Ticket Tailor API error: ${response.status}`,
        details: response.statusText
      })
    }

    // Parse the response
    const data = await response.json()

    // Return the data
    return res.status(200).json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('API Error:', error)
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
} 