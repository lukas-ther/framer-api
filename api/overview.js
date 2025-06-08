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

    // Log environment info for debugging
    console.log('Environment info:', {
      nodeEnv: process.env.NODE_ENV,
      vercelRegion: process.env.VERCEL_REGION,
      vercelUrl: process.env.VERCEL_URL,
      userAgent: req.headers['user-agent'],
      xForwardedFor: req.headers['x-forwarded-for'],
      xRealIp: req.headers['x-real-ip']
    })

    const authHeader = `Basic ${Buffer.from(process.env.TICKET_TAILOR_API_KEY + ':').toString('base64')}`
    
    // Call Ticket Tailor Overview API using Basic Auth
    const response = await fetch('https://api.tickettailor.com/v1/overview', {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'User-Agent': 'curl/7.68.0'
      }
    })

    // Log detailed response info
    console.log('Ticket Tailor response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })

    // Get response text for detailed error analysis
    const responseText = await response.text()
    console.log('Response body:', responseText)

    // Check if the request was successful
    if (!response.ok) {
      console.error(`Ticket Tailor API error: ${response.status} ${response.statusText}`)
      
      // Return detailed error info for debugging
      return res.status(response.status).json({
        success: false,
        error: `Ticket Tailor API error: ${response.status}`,
        details: response.statusText,
        debug: {
          responseHeaders: Object.fromEntries(response.headers.entries()),
          responseBody: responseText,
          requestInfo: {
            url: 'https://api.tickettailor.com/v1/overview',
            method: 'GET',
            authHeaderLength: authHeader.length
          }
        }
      })
    }

    // Parse the response
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return res.status(500).json({
        success: false,
        error: 'Invalid JSON response',
        details: parseError.message,
        responseText: responseText
      })
    }

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
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
