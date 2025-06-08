export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const apiKey = process.env.TICKET_TAILOR_API_KEY
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    // Test ping endpoint first
    const pingResponse = await fetch('https://api.tickettailor.com/v1/ping', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    const pingData = await pingResponse.text()
    
    // Test overview endpoint
    const overviewResponse = await fetch('https://api.tickettailor.com/v1/overview', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    const overviewData = await overviewResponse.text()

    return res.status(200).json({
      ping: {
        status: pingResponse.status,
        statusText: pingResponse.statusText,
        data: pingData
      },
      overview: {
        status: overviewResponse.status,
        statusText: overviewResponse.statusText,
        data: overviewData
      },
      authHeader: `Basic ${Buffer.from(apiKey + ':').toString('base64')}`.substring(0, 30) + '...'
    })

  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    })
  }
} 