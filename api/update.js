// api/update.js waza
import fs from 'fs';
import path from 'path';

// File path for storing data
const dataFile = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { password, data } = req.body;
      
      // Verify password (same obfuscated method as client)
      const validPassword = Buffer.from('QTNmajI4MQ==', 'base64').toString('utf8');
      
      if (password !== validPassword) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Validate data structure
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Invalid data format' });
      }

      if (!data.downloadUrl || !Array.isArray(data.changelogs)) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Save data to file
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
      
      res.status(200).json({ success: true, message: 'Data updated successfully' });
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
