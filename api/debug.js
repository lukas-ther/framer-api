export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.TICKET_TAILOR_API_KEY
  const hasApiKey = !!apiKey
  const apiKeyLength = apiKey ? apiKey.length : 0
  const apiKeyPrefix = apiKey ? apiKey.substring(0, 8) + '...' : 'Not set'
  
  // Test the basic auth encoding
  const basicAuth = apiKey ? Buffer.from(apiKey + ':').toString('base64') : 'N/A'
  
  return res.status(200).json({
    hasApiKey,
    apiKeyLength,
    apiKeyPrefix,
    basicAuth: basicAuth.substring(0, 20) + '...',
    environment: process.env.NODE_ENV || 'unknown'
  })
} 