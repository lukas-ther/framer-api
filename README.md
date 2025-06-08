# Framer API Backend

A minimalistic backend API for integrating Ticket Tailor with Framer websites using Vercel serverless functions.

## Project Structure

```
framer-api/
├── api/
│   └── overview.js     # Ticket Tailor overview endpoint
├── vercel.json         # Vercel deployment configuration  
├── package.json        # Project dependencies
└── README.md          # This file
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
TICKET_TAILOR_API_KEY=your_ticket_tailor_api_key_here
```

### 3. Local Development

```bash
npm run dev
```

This will start the Vercel development server at `http://localhost:3000`

### 4. Deploy to Vercel

```bash
npm run deploy
```

Or connect your GitHub repository to Vercel for automatic deployments.

## API Endpoints

### GET `/api/overview`

Returns overview statistics from Ticket Tailor Box Office.

**Response:**
```json
{
  "success": true,
  "data": {
    // Ticket Tailor overview data
  },
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

## Usage in Framer

```javascript
// In your Framer component
const [overview, setOverview] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch('https://your-deployment.vercel.app/api/overview')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setOverview(data.data)
      }
      setLoading(false)
    })
    .catch(err => {
      console.error('Error:', err)
      setLoading(false)
    })
}, [])
```

## Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add: `TICKET_TAILOR_API_KEY` with your API key value

## Security

- API keys are stored securely as environment variables
- CORS is configured to allow requests from any origin (restrict this in production)
- All requests are validated and errors are handled gracefully

## Next Steps

Once this basic endpoint is working, you can add more endpoints:
- `/api/events` - Get all events
- `/api/event/[id]` - Get specific event details
- `/api/tickets/[eventId]` - Get ticket information

## Documentation

- [Ticket Tailor API Documentation](https://developers.tickettailor.com/docs/api/get-overview)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions) 