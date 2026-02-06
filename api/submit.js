// Store leads in memory (in production, use a database)
const leads = [];

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const lead = {
    id: Date.now(),
    name: name || 'Anonymous',
    email,
    message: message || '',
    timestamp: new Date().toISOString()
  };

  leads.push(lead);
  console.log('New lead:', lead);

  res.json({ success: true, message: 'Thank you for reaching out!' });
}
