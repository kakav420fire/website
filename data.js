// api/data.js
import fs from 'fs';
import path from 'path';

// Default data structure
const defaultData = {
  downloadUrl: 'https://gofile.io/d/qtUQtv',
  changelogs: [
    {
      version: 'v1.2.0',
      content: '• Better Stability\n• Improved UNC to 35\n• Fixed bugs\n• Fully New Ui (UNFINISHED)'
    },
    {
      version: 'v1.0.1', 
      content: '• 25 UNC\n• Minor bug fixes\n• Optimized Bridge'
    },
    {
      version: 'v1.0.0',
      content: '• Release\n• UI \n• 18 UNC'
    }
  ]
};

// File path for storing data
const dataFile = path.join(process.cwd(), 'data.json');

// Ensure data file exists
function ensureDataFile() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
  }
}

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

  if (req.method === 'GET') {
    try {
      ensureDataFile();
      const data = fs.readFileSync(dataFile, 'utf8');
      const jsonData = JSON.parse(data);
      res.status(200).json(jsonData);
    } catch (error) {
      console.error('Error reading data:', error);
      res.status(200).json(defaultData);
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
