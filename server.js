const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'locations.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper: read/write stored locations
function readLocations() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveLocations(locations) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(locations, null, 2));
}

// Receive location from the tracking page (only sent AFTER user clicks "Allow")
app.post('/api/location', (req, res) => {
  const { latitude, longitude, accuracy, name } = req.body;

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'latitude and longitude are required numbers' });
  }

  const entry = {
    id: Date.now(),
    name: name || 'Anonymous',
    latitude,
    longitude,
    accuracy: accuracy || null,
    timestamp: new Date().toISOString(),
    ip: req.ip
  };

  const locations = readLocations();
  locations.push(entry);
  saveLocations(locations);

  console.log(`New location received: ${entry.name} -> (${latitude}, ${longitude})`);
  res.json({ success: true, entry });
});

// Fetch all stored locations for the dashboard
app.get('/api/locations', (req, res) => {
  res.json(readLocations());
});

// Clear all data (useful for testing/demo)
app.delete('/api/locations', (req, res) => {
  saveLocations([]);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Tracking link: http://localhost:${PORT}/`);
  console.log(`Dashboard: http://localhost:${PORT}/dashboard.html`);
});
