const router = require('express').router();

// Geofence center (latitude, longitude) and radius (in meters)
const geofence = {
  center: {
    latitude: 28.7041, // Example latitude (e.g., Delhi, India)
    longitude: 77.1025, // Example longitude
  },
  radius: 5000, // Radius in meters (5 km)
};

// Haversine formula to calculate the distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
}

// POST route to check if the user is inside the geofence
router.post('/check-geofence', (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  // Calculate the distance from the user's location to the geofence center
  const distance = calculateDistance(
    geofence.center.latitude,
    geofence.center.longitude,
    latitude,
    longitude
  );

  // Check if the user is inside the geofence
  if (distance <= geofence.radius) {
    res.json({ insideGeofence: true, distance });
  } else {
    res.json({ insideGeofence: false, distance });
  }
});
